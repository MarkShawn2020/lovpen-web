'use client';

import {useState} from 'react';
import {Calendar as CalendarIcon, Plus} from 'lucide-react';
import {Button} from '@/components/lovpen-ui/button';
import {cn} from '@/lib/utils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-styles.css';

type TopicScheduleItem = {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in_progress' | 'completed';
}

const TopicSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduleItems] = useState<TopicScheduleItem[]>([
    {
      id: '1',
      title: '人工智能未来发展趋势',
      description: '探讨AI技术在各行业的应用前景',
      date: new Date(2024, 6, 15), // July 15, 2024
      category: '科技',
      priority: 'high',
      status: 'planned'
    },
    {
      id: '2',
      title: '可持续发展与环保',
      description: '分析绿色能源的发展现状',
      date: new Date(2024, 6, 20), // July 20, 2024
      category: '环保',
      priority: 'medium',
      status: 'in_progress'
    },
  ]);

  const getScheduleItemsForDate = (date: Date) => {
    return scheduleItems.filter(item => 
      item.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-main">选题排期</h1>
          </div>
          <Button className="flex items-center justify-center space-x-2 bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span>新增选题</span>
          </Button>
        </div>
        <p className="text-text-faded text-base sm:text-lg">管理和规划您的内容创作计划</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* 日历部分 */}
        <div className="lg:col-span-2">
          <div className="bg-background-main rounded-2xl p-4 sm:p-6 shadow-md border border-border-default/20">
            <div className="custom-calendar">
              <Calendar
                onChange={value => setSelectedDate(value as Date)}
                value={selectedDate}
                locale="zh-CN"
                formatShortWeekday={(locale, date) => {
                  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
                  return weekdays[date.getDay()] || '';
                }}
                tileContent={({ date }) => {
                  const itemsForDate = getScheduleItemsForDate(date);
                  if (itemsForDate.length > 0) {
                    return (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    );
                  }
                  return null;
                }}
                tileClassName={({ date }) => {
                  const itemsForDate = getScheduleItemsForDate(date);
                  const hasItems = itemsForDate.length > 0;
                  const today = isToday(date);
                  const selected = isSelected(date);
                  
                  return cn(
                    'relative',
                    today && 'react-calendar__tile--today',
                    selected && 'react-calendar__tile--selected',
                    hasItems && 'has-items'
                  );
                }}
              />
            </div>
          </div>
        </div>

        {/* 选题列表部分 */}
        <div className="lg:col-span-1">
          <div className="bg-background-main rounded-2xl p-4 sm:p-6 shadow-md border border-border-default/20">
            <h3 className="text-lg font-medium text-text-main mb-4">
              {selectedDate ? `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日` : '全部选题'}
            </h3>
            
            <div className="space-y-4">
              {(selectedDate ? getScheduleItemsForDate(selectedDate) : scheduleItems).map(item => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 bg-white rounded-lg border border-border-default/20 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-text-main text-sm">{item.title}</h4>
                    <div className="flex space-x-1">
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full border',
                        getPriorityColor(item.priority)
                      )}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-text-faded text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-faded">
                      {item.date.toLocaleDateString('zh-CN')}
                    </span>
                    <span className={cn(
                      'px-2 py-1 text-xs rounded-full border',
                      getStatusColor(item.status)
                    )}
                    >
                      {item.status === 'planned'
? '计划中' 
                       : item.status === 'in_progress' ? '进行中' : '已完成'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {((selectedDate && getScheduleItemsForDate(selectedDate).length === 0) 
              || (!selectedDate && scheduleItems.length === 0)) && (
              <div className="text-center py-8 text-text-faded">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无选题安排</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSchedule;
