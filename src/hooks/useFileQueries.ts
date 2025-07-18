'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fileClientV2} from '@/services/file-client-v2';
import type {FileItem} from '@/services/file-client-v2';

type FileQueryParams = {
  limit?: number;
  offset?: number;
  enabled?: boolean;
};

type SearchQueryParams = {
  query: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
};

// Query keys for React Query
export const fileQueryKeys = {
  all: ['files'] as const,
  lists: () => [...fileQueryKeys.all, 'list'] as const,
  list: (params: FileQueryParams) => [...fileQueryKeys.lists(), params] as const,
  searches: () => [...fileQueryKeys.all, 'search'] as const,
  search: (params: SearchQueryParams) => [...fileQueryKeys.searches(), params] as const,
  detail: (id: string) => [...fileQueryKeys.all, 'detail', id] as const,
};

// Hook for fetching files
export function useFiles(params: FileQueryParams = {}) {
  const {limit = 100, offset = 0, enabled = true} = params;
  
  return useQuery({
    queryKey: fileQueryKeys.list({limit, offset}),
    queryFn: async () => {
      const response = await fileClientV2.getFiles({limit, offset});
      return response;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for searching files
export function useSearchFiles(params: SearchQueryParams) {
  const {query, limit = 100, offset = 0, enabled = true} = params;
  
  return useQuery({
    queryKey: fileQueryKeys.search({query, limit, offset}),
    queryFn: async () => {
      if (!query.trim()) {
        return {items: [], total: 0, limit, offset};
      }
      const response = await fileClientV2.searchFiles({query, limit, offset});
      return response;
    },
    enabled: enabled && !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for deleting files
export function useDeleteFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fileId: string) => {
      await fileClientV2.deleteFile(fileId);
      return fileId;
    },
    onSuccess: (deletedFileId) => {
      // Invalidate and refetch files list
      queryClient.invalidateQueries({queryKey: fileQueryKeys.lists()});
      queryClient.invalidateQueries({queryKey: fileQueryKeys.searches()});
      
      // Remove the deleted file from all cached queries
      queryClient.setQueriesData(
        {queryKey: fileQueryKeys.lists()},
        (oldData: any) => {
          if (!oldData) {
 return oldData; 
}
          return {
            ...oldData,
            items: oldData.items.filter((file: FileItem) => file.id !== deletedFileId),
          };
        }
      );
    },
    onError: (error) => {
      console.error('Failed to delete file:', error);
      // You can add toast notification here
    },
  });
}

// Hook for uploading files (if needed)
export function useUploadFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fileData: FormData) => {
      // Implement upload logic here
      // const response = await fileClientV2.uploadFile(fileData);
      // return response;
      throw new Error('Upload not implemented');
    },
    onSuccess: () => {
      // Invalidate files list to show new file
      queryClient.invalidateQueries({queryKey: fileQueryKeys.lists()});
    },
    onError: (error) => {
      console.error('Failed to upload file:', error);
    },
  });
}

// Hook for getting file content (if needed)
export function useFileContent(fileId: string, enabled = false) {
  return useQuery({
    queryKey: fileQueryKeys.detail(fileId),
    queryFn: async () => {
      // Implement file content fetching if needed
      // const response = await fileClientV2.getFileContent(fileId);
      // return response;
      throw new Error('File content fetching not implemented');
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
