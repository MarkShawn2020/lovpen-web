export type FileItem = {
  id: string;
  title?: string;
  content?: string;
  content_type: string;
  source_platform: string;
  source_id?: string;
  metadata: Record<string, any>;
  tags: string[];
  created_at: string;
  updated_at: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
}

export type FileListResponse = {
  items: FileItem[];
  total: number;
  has_more: boolean;
  next_cursor?: string;
}

export type SearchResponse = {
  items: FileItem[];
  total: number;
  has_more: boolean;
  next_cursor?: string;
  highlights?: Record<string, string[]>;
}

export type AISearchRequest = {
  query: string;
  limit?: number;
  offset?: number;
  enable_highlighting?: boolean;
  include_reasoning?: boolean;
  filters?: {
    content_types?: string[];
    platforms?: string[];
    date_range?: {
      start?: string;
      end?: string;
    };
  };
}

export type BatchDeleteRequest = {
  filename_pattern?: string;
  item_ids?: string[];
}

export type BatchDeleteResponse = {
  deleted_count: number;
  deleted_items: Array<{
    id: string;
    title?: string;
  }>;
}

export class FileClientService {
  private baseUrl = '/api/files';
  private fastAPIBaseUrl = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';
  
  /**
   * 获取认证头部
   */
  private getAuthHeaders(): HeadersInit {
    // 从localStorage获取认证token
    let token = null;
    if (typeof window !== 'undefined') {
      try {
        const tokensStr = localStorage.getItem('fastapi_auth_token');
        if (tokensStr) {
          const tokens = JSON.parse(tokensStr);
          token = tokens.access_token;
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * 获取文件列表
   */
  async getFiles(params?: {
    limit?: number;
    offset?: number;
    item_type?: string;
    platform?: string;
  }): Promise<FileListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit) {
 searchParams.set('limit', params.limit.toString());
}
    if (params?.offset) {
 searchParams.set('offset', params.offset.toString());
}
    if (params?.item_type) {
 searchParams.set('item_type', params.item_type);
}
    if (params?.platform) {
 searchParams.set('platform', params.platform);
}

    const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 获取单个文件
   */
  async getFile(id: string): Promise<FileItem> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 创建文件
   */
  async createFile(data: {
    title?: string;
    content?: string;
    content_type: string;
    source_platform: string;
    metadata?: Record<string, any>;
    tags?: string[];
  }): Promise<FileItem> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create file: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 更新文件
   */
  async updateFile(id: string, data: Partial<FileItem>): Promise<FileItem> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update file: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 删除文件
   */
  async deleteFile(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.status}`);
    }
  }

  /**
   * 上传文件
   */
  async uploadFile(file: File, title?: string): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) {
      formData.append('title', title);
    }

    const authHeaders = this.getAuthHeaders();
    // 对于FormData，移除Content-Type让浏览器自动设置
    const { 'Content-Type': contentType, ...otherHeaders } = authHeaders as Record<string, string>;
    
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: otherHeaders,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Failed to upload file: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 批量上传文件
   */
  async uploadFiles(files: File[], titles?: string[]): Promise<FileItem[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, titles?.[index])
    );

    return Promise.all(uploadPromises);
  }

  /**
   * 搜索文件
   */
  async searchFiles(params: {
    query: string;
    limit?: number;
    offset?: number;
    item_type?: string;
    platform?: string;
  }): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set('query', params.query);
    if (params.limit) {
 searchParams.set('limit', params.limit.toString());
}
    if (params.offset) {
 searchParams.set('offset', params.offset.toString());
}
    if (params.item_type) {
 searchParams.set('item_type', params.item_type);
}
    if (params.platform) {
 searchParams.set('platform', params.platform);
}

    const response = await fetch(`${this.baseUrl}/search?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.status}`);
    }

    return response.json();
  }

  /**
   * AI 搜索
   */
  async aiSearch(request: AISearchRequest): Promise<SearchResponse> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to perform AI search: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 批量删除文件
   */
  async batchDelete(request: BatchDeleteRequest): Promise<BatchDeleteResponse> {
    const response = await fetch(`${this.baseUrl}/batch-delete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to batch delete files: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 批量删除指定文件
   */
  async batchDeleteByIds(ids: string[]): Promise<BatchDeleteResponse> {
    return this.batchDelete({ item_ids: ids });
  }

  /**
   * 按文件名模式批量删除
   */
  async batchDeleteByPattern(pattern: string): Promise<BatchDeleteResponse> {
    return this.batchDelete({ filename_pattern: pattern });
  }
}

// 导出单例实例
export const fileClient = new FileClientService();
