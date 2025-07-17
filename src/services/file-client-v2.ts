import { fastAPIAuthService } from './fastapi-auth-v2';

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

export class FileClientServiceV2 {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';
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

    return fastAPIAuthService.authenticatedRequest<FileListResponse>(
      `/knowledge/items/?${searchParams.toString()}`
    );
  }

  /**
   * 获取单个文件
   */
  async getFile(id: string): Promise<FileItem> {
    return fastAPIAuthService.authenticatedRequest<FileItem>(
      `/knowledge/items/${id}`
    );
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
    return fastAPIAuthService.authenticatedRequest<FileItem>(
      `/knowledge/items/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 更新文件
   */
  async updateFile(id: string, data: Partial<FileItem>): Promise<FileItem> {
    return fastAPIAuthService.authenticatedRequest<FileItem>(
      `/knowledge/items/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 删除文件
   */
  async deleteFile(id: string): Promise<void> {
    await fastAPIAuthService.authenticatedRequest<void>(
      `/knowledge/items/${id}`,
      {
        method: 'DELETE',
      }
    );
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

    const headers = fastAPIAuthService.getAuthHeaders();
    if (!headers) {
      throw new Error('Not authenticated');
    }

    // 移除 Content-Type 让浏览器自动设置 multipart/form-data
    const { 'Content-Type': _, ...authHeaders } = headers;

    const response = await fetch(`${this.baseUrl}/knowledge/items/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    if (response.status === 401) {
      fastAPIAuthService.logout();
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Upload failed: ${response.status}`);
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

    return fastAPIAuthService.authenticatedRequest<SearchResponse>(
      `/knowledge/items/search?${searchParams.toString()}`
    );
  }

  /**
   * AI 搜索
   */
  async aiSearch(request: AISearchRequest): Promise<SearchResponse> {
    return fastAPIAuthService.authenticatedRequest<SearchResponse>(
      `/knowledge/ai/search`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * 批量删除文件
   */
  async batchDelete(request: BatchDeleteRequest): Promise<BatchDeleteResponse> {
    return fastAPIAuthService.authenticatedRequest<BatchDeleteResponse>(
      `/knowledge/items/batch-delete`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
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
export const fileClientV2 = new FileClientServiceV2();
