'use client';

import { useEffect, useState } from 'react';
import { waitlistClient } from '@/services/waitlist-client';
import type { WaitlistListResponse, WaitlistResponse, WaitlistStats } from '@/types/waitlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, MessageSquare, Trash2, XCircle } from 'lucide-react';

export function WaitlistAdminDashboard() {
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [entries, setEntries] = useState<WaitlistListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [selectedEntry, setSelectedEntry] = useState<WaitlistResponse | null>(null);
  const [notes, setNotes] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, entriesData] = await Promise.all([
        waitlistClient.getWaitlistStats(),
        waitlistClient.getWaitlistEntries({
          page: currentPage,
          size: 20,
          status_filter: statusFilter === 'all' ? undefined : statusFilter as any,
          search: search || undefined,
        }),
      ]);
      
      setStats(statsData);
      setEntries(entriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, statusFilter, search]);

  const handleAction = async (
    id: number,
    action: 'approve' | 'reject' | 'delete',
    notes: string = ''
  ) => {
    setIsActionLoading(true);
    try {
      if (action === 'approve') {
        await waitlistClient.approveWaitlistEntry(id, notes);
      } else if (action === 'reject') {
        await waitlistClient.rejectWaitlistEntry(id, notes);
      } else if (action === 'delete') {
        await waitlistClient.deleteWaitlistEntry(id);
      }
      
      await loadData(); // Reload data
      setSelectedEntry(null);
      setNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
<Badge variant="outline" className="text-yellow-600 border-yellow-300">
<Clock className="w-3 h-3 mr-1" />
待审核
</Badge>
);
      case 'approved':
        return (
<Badge variant="outline" className="text-green-600 border-green-300">
<CheckCircle className="w-3 h-3 mr-1" />
已批准
</Badge>
);
      case 'rejected':
        return (
<Badge variant="outline" className="text-red-600 border-red-300">
<XCircle className="w-3 h-3 mr-1" />
已拒绝
</Badge>
);
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading && !stats && !entries) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          错误: 
{' '}
{error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总申请数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_submissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">待审核</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">已批准</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">已拒绝</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected_count}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="搜索姓名或邮箱..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="approved">已批准</SelectItem>
            <SelectItem value="rejected">已拒绝</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadData} variant="outline">
          刷新
        </Button>
      </div>

      {/* Entries Table */}
      {entries && (
        <Card>
          <CardHeader>
            <CardTitle>申请列表</CardTitle>
            <CardDescription>
              共 
{' '}
{entries.total}
{' '}
条记录，第 
{' '}
{entries.page}
{' '}
页，共 
{' '}
{entries.pages}
{' '}
页
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>公司</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>申请时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.items.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.company || '-'}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell>{entry.source}</TableCell>
                    <TableCell>
                      {new Date(entry.created_at).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {entry.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(entry.id, 'approve')}
                              disabled={isActionLoading}
                            >
                              批准
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(entry.id, 'reject')}
                              disabled={isActionLoading}
                            >
                              拒绝
                            </Button>
                          </>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>申请详情</DialogTitle>
                              <DialogDescription>
                                {selectedEntry?.name}
{' '}
(
{selectedEntry?.email}
)
                              </DialogDescription>
                            </DialogHeader>
                            {selectedEntry && (
                              <div className="space-y-4">
                                <div>
                                  <Label>公司</Label>
                                  <p className="text-sm">{selectedEntry.company || '未提供'}</p>
                                </div>
                                <div>
                                  <Label>使用场景</Label>
                                  <p className="text-sm">{selectedEntry.use_case || '未提供'}</p>
                                </div>
                                <div>
                                  <Label>当前备注</Label>
                                  <p className="text-sm">{selectedEntry.notes || '无'}</p>
                                </div>
                                {selectedEntry.status === 'pending' && (
                                  <div>
                                    <Label htmlFor="notes">添加备注</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="备注信息..."
                                      value={notes}
                                      onChange={e => setNotes(e.target.value)}
                                      rows={3}
                                    />
                                    <div className="flex gap-2 mt-3">
                                      <Button
                                        onClick={() => handleAction(selectedEntry.id, 'approve', notes)}
                                        disabled={isActionLoading}
                                        className="flex-1"
                                      >
                                        批准
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => handleAction(selectedEntry.id, 'reject', notes)}
                                        disabled={isActionLoading}
                                        className="flex-1"
                                      >
                                        拒绝
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                <div className="pt-2">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleAction(selectedEntry.id, 'delete')}
                                    disabled={isActionLoading}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    删除记录
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {entries.pages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <Button
                  variant="outline"
                  disabled={entries.page === 1}
                  onClick={() => setCurrentPage(entries.page - 1)}
                >
                  上一页
                </Button>
                <span className="flex items-center px-4">
                  第 
{' '}
{entries.page}
{' '}
页，共 
{' '}
{entries.pages}
{' '}
页
                </span>
                <Button
                  variant="outline"
                  disabled={entries.page === entries.pages}
                  onClick={() => setCurrentPage(entries.page + 1)}
                >
                  下一页
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
