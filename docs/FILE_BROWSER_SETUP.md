# File Browser System Setup Guide

This guide explains how to set up and use the file browser system that integrates with the FastAPI backend.

## Overview

The file browser system provides a complete file management interface that connects to a FastAPI backend for knowledge management. It includes:

- File upload with drag-and-drop support
- File browsing with grid and list views
- Basic and AI-powered search functionality
- File editing and metadata management
- Batch operations for file management
- User authentication integration with Clerk

## Architecture

### Frontend Components

1. **Authentication Service** (`/src/services/fastapi-auth.ts`)
   - Handles Clerk → FastAPI authentication token conversion
   - Manages token caching and renewal
   - Provides authenticated fetch utilities

2. **Client Service** (`/src/services/file-client.ts`)
   - Provides a complete API client for file operations
   - Handles file uploads, downloads, and CRUD operations
   - Supports batch operations and search functionality

3. **API Proxy Layer** (`/src/app/api/files/`)
   - Proxies requests between frontend and FastAPI backend
   - Handles authentication and error translation
   - Provides secure API endpoints

4. **UI Components** (`/src/app/[locale]/(auth)/dashboard/files/`)
   - Main file browser interface
   - File upload page with progress tracking
   - Search page with filters and AI search
   - File detail page with editing capabilities

## Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env` file:

```env
# FastAPI Backend Configuration
NEXT_PUBLIC_FASTAPI_BASE_URL=http://localhost:8000

# OpenTelemetry (disabled to reduce warnings)
OTEL_SDK_DISABLED=true
OTEL_INSTRUMENTATION_DISABLED=true
```

### 2. FastAPI Backend Requirements

Your FastAPI backend must implement the following endpoints:

#### Authentication
- `POST /account/oauth/login/clerk` - Convert Clerk user to FastAPI token

#### File Operations
- `GET /knowledge/items/` - List files with pagination and filters
- `POST /knowledge/items/` - Create new knowledge item
- `POST /knowledge/items/upload` - Upload files (multipart/form-data)
- `GET /knowledge/items/{id}` - Get single file
- `PUT /knowledge/items/{id}` - Update file
- `DELETE /knowledge/items/{id}` - Delete file
- `GET /knowledge/items/search` - Basic search
- `POST /knowledge/ai/search` - AI-powered search
- `POST /knowledge/items/batch-delete` - Batch delete operations

#### Authentication Headers
All endpoints (except authentication) require:
```
Authorization: Bearer <access_token>
```

### 3. Data Schema

The system expects the following data structure:

```typescript
interface FileItem {
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
```

### 4. File Upload Support

The system supports the following file types:
- **Text**: .txt, .md, .csv, .json
- **Documents**: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
- **Images**: .jpg, .jpeg, .png, .gif, .webp
- **Audio**: .mp3, .wav, .ogg, .m4a
- **Video**: .mp4, .webm, .mov

File size limit: 50MB per file

## Usage

### Accessing the File Browser

1. Navigate to `/dashboard/files` in your application
2. The system will automatically redirect from `/knowledge-base` to the new file browser

### File Operations

#### Upload Files
1. Go to `/dashboard/files/upload`
2. Drag and drop files or click to select
3. Optionally add titles for each file
4. Click "Upload All" to process files

#### Browse Files
1. View files in grid or list format
2. Use filters to narrow down results
3. Select multiple files for batch operations
4. Click on files to view details

#### Search Files
1. Use the search bar for basic keyword search
2. Go to `/dashboard/files/search` for advanced search
3. Use AI search for natural language queries
4. Apply filters by content type, platform, or date range

#### Edit Files
1. Click on a file to view details
2. Click "Edit" to modify title, content, or tags
3. Save changes to update the file

### Navigation

The file browser is integrated into the main navigation:
- **文件** (Files) - Direct access to file browser
- **知识库** (Knowledge Base) - Redirects to file browser for compatibility

## API Integration

### Authentication Flow

1. User logs in through Clerk
2. Frontend calls `/api/files/*` endpoints
3. API proxy converts Clerk session to FastAPI token
4. Requests are forwarded to FastAPI backend with authentication

### Error Handling

The system provides comprehensive error handling:
- Authentication errors (401)
- File validation errors (400)
- Server errors (500)
- Network errors with retry logic

### Performance Optimization

- Token caching to reduce authentication overhead
- Debounced search to prevent excessive API calls
- Pagination support for large file lists
- Lazy loading for file content

## Development

### Adding New Features

1. Update the `FileClientService` for new API endpoints
2. Create new API routes in `/src/app/api/files/`
3. Add UI components in the appropriate page
4. Update the FastAPI backend to support new endpoints

### Testing

1. Ensure FastAPI backend is running on the configured URL
2. Test file upload with various file types
3. Verify search functionality works correctly
4. Test batch operations and error handling

### Debugging

Enable detailed logging by checking:
- Browser console for client-side errors
- Network tab for API request/response details
- FastAPI logs for backend issues
- Authentication token validity

## Security Considerations

1. **File Validation**: All uploaded files are validated for type and size
2. **User Isolation**: All operations are user-scoped through authentication
3. **CORS Configuration**: Ensure proper CORS settings on FastAPI backend
4. **Token Security**: Authentication tokens are handled securely with proper expiration

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify Clerk configuration and FastAPI OAuth endpoint
2. **File Upload Failures**: Check file size limits and supported formats
3. **Search Not Working**: Ensure FastAPI search endpoints are implemented
4. **UI Not Loading**: Verify environment variables are set correctly

### Support

For issues related to:
- Frontend components: Check browser console and network requests
- Backend integration: Verify FastAPI endpoint responses
- Authentication: Check Clerk configuration and token conversion
- File operations: Verify file permissions and storage configuration