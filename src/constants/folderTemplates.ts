/**
 * 知识库默认文件夹模板配置
 * 定义了预设的文件夹结构和分类规则
 */

export type FolderTemplate = {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  isSystem: boolean;
  sortOrder: number;
  children?: FolderTemplate[];
  autoClassify?: {
    platforms?: string[];
    contentTypes?: string[];
    fileExtensions?: string[];
  };
};

export const FOLDER_TEMPLATES: FolderTemplate[] = [
  {
    id: 'library',
    name: '📚 Library',
    icon: '📚',
    description: '用户手动上传的文件',
    path: '/Library',
    isSystem: true,
    sortOrder: 1,
    autoClassify: {
      platforms: ['manual'],
    },
    children: [
      {
        id: 'library-documents',
        name: '📄 Documents',
        icon: '📄',
        description: '文档类文件',
        path: '/Library/Documents',
        isSystem: true,
        sortOrder: 1,
        autoClassify: {
          contentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          fileExtensions: ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'],
        },
      },
      {
        id: 'library-images',
        name: '🖼️ Images',
        icon: '🖼️',
        description: '图片类文件',
        path: '/Library/Images',
        isSystem: true,
        sortOrder: 2,
        autoClassify: {
          contentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
          fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
        },
      },
      {
        id: 'library-videos',
        name: '🎥 Videos',
        icon: '🎥',
        description: '视频类文件',
        path: '/Library/Videos',
        isSystem: true,
        sortOrder: 3,
        autoClassify: {
          contentTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
          fileExtensions: ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv'],
        },
      },
      {
        id: 'library-others',
        name: '📦 Others',
        icon: '📦',
        description: '其他类型文件',
        path: '/Library/Others',
        isSystem: true,
        sortOrder: 4,
      },
    ],
  },
  {
    id: 'memo',
    name: '📝 Memo',
    icon: '📝',
    description: '用户随手记的资料、灵感',
    path: '/Memo',
    isSystem: true,
    sortOrder: 2,
    children: [
      {
        id: 'memo-ideas',
        name: '💡 Ideas',
        icon: '💡',
        description: '创意想法',
        path: '/Memo/Ideas',
        isSystem: true,
        sortOrder: 1,
      },
      {
        id: 'memo-notes',
        name: '📋 Notes',
        icon: '📋',
        description: '学习笔记',
        path: '/Memo/Notes',
        isSystem: true,
        sortOrder: 2,
      },
      {
        id: 'memo-drafts',
        name: '✏️ Drafts',
        icon: '✏️',
        description: '草稿文件',
        path: '/Memo/Drafts',
        isSystem: true,
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'chats',
    name: '💬 Chats',
    icon: '💬',
    description: '与AI助手的对话记录',
    path: '/Chats',
    isSystem: true,
    sortOrder: 3,
    autoClassify: {
      platforms: ['claude', 'openai', 'gemini'],
    },
    children: [
      {
        id: 'chats-claude',
        name: '🤖 Claude',
        icon: '🤖',
        description: 'Claude对话记录',
        path: '/Chats/Claude',
        isSystem: true,
        sortOrder: 1,
        autoClassify: {
          platforms: ['claude'],
        },
      },
      {
        id: 'chats-gpt',
        name: '🧠 GPT',
        icon: '🧠',
        description: 'GPT对话记录',
        path: '/Chats/GPT',
        isSystem: true,
        sortOrder: 2,
        autoClassify: {
          platforms: ['openai', 'gpt'],
        },
      },
      {
        id: 'chats-others',
        name: '🤖 Others',
        icon: '🤖',
        description: '其他AI对话记录',
        path: '/Chats/Others',
        isSystem: true,
        sortOrder: 3,
        autoClassify: {
          platforms: ['gemini', 'other-ai'],
        },
      },
    ],
  },
  {
    id: 'imports',
    name: '📥 Imports',
    icon: '📥',
    description: '第三方平台导入的内容',
    path: '/Imports',
    isSystem: true,
    sortOrder: 4,
    autoClassify: {
      platforms: ['notion', 'flomo', 'wechat-mp', 'wechat-chat', 'feishu', 'obsidian'],
    },
    children: [
      {
        id: 'imports-notion',
        name: '📋 Notion',
        icon: '📋',
        description: 'Notion文档',
        path: '/Imports/Notion',
        isSystem: true,
        sortOrder: 1,
        autoClassify: {
          platforms: ['notion'],
        },
      },
      {
        id: 'imports-flomo',
        name: '🔖 Flomo',
        icon: '🔖',
        description: 'Flomo笔记',
        path: '/Imports/Flomo',
        isSystem: true,
        sortOrder: 2,
        autoClassify: {
          platforms: ['flomo'],
        },
      },
      {
        id: 'imports-wechat',
        name: '💬 WeChat',
        icon: '💬',
        description: '微信内容',
        path: '/Imports/WeChat',
        isSystem: true,
        sortOrder: 3,
        autoClassify: {
          platforms: ['wechat-mp', 'wechat-chat'],
        },
      },
      {
        id: 'imports-feishu',
        name: '🚀 Feishu',
        icon: '🚀',
        description: '飞书文档',
        path: '/Imports/Feishu',
        isSystem: true,
        sortOrder: 4,
        autoClassify: {
          platforms: ['feishu'],
        },
      },
      {
        id: 'imports-obsidian',
        name: '🔮 Obsidian',
        icon: '🔮',
        description: 'Obsidian笔记',
        path: '/Imports/Obsidian',
        isSystem: true,
        sortOrder: 5,
        autoClassify: {
          platforms: ['obsidian'],
        },
      },
      {
        id: 'imports-others',
        name: '📦 Others',
        icon: '📦',
        description: '其他平台内容',
        path: '/Imports/Others',
        isSystem: true,
        sortOrder: 6,
      },
    ],
  },
  {
    id: 'shared',
    name: '🤝 Shared',
    icon: '🤝',
    description: '共享文件夹',
    path: '/Shared',
    isSystem: true,
    sortOrder: 5,
    children: [
      {
        id: 'shared-public',
        name: '🌐 Public',
        icon: '🌐',
        description: '公开分享',
        path: '/Shared/Public',
        isSystem: true,
        sortOrder: 1,
      },
      {
        id: 'shared-team',
        name: '👥 Team',
        icon: '👥',
        description: '团队共享',
        path: '/Shared/Team',
        isSystem: true,
        sortOrder: 2,
      },
    ],
  },
];

/**
 * 根据文件信息自动推荐目标文件夹
 */
export function getRecommendedFolder(file: {
  platform?: string;
  contentType?: string;
  fileName?: string;
}): FolderTemplate | null {
  const { platform, contentType, fileName } = file;
  
  // 获取文件扩展名
  const extension = fileName?.split('.').pop()?.toLowerCase();
  
  // 遍历所有模板寻找匹配项
  for (const template of FOLDER_TEMPLATES) {
    const match = checkFolderMatch(template, platform, contentType, extension);
    if (match) {
      return match;
    }
  }
  
  return null;
}

function checkFolderMatch(
  template: FolderTemplate,
  platform?: string,
  contentType?: string,
  extension?: string
): FolderTemplate | null {
  // 检查当前模板是否匹配
  if (template.autoClassify) {
    const { platforms, contentTypes, fileExtensions } = template.autoClassify;
    
    if (platforms && platform && platforms.includes(platform)) {
      return template;
    }
    
    if (contentTypes && contentType && contentTypes.includes(contentType)) {
      return template;
    }
    
    if (fileExtensions && extension && fileExtensions.includes(extension)) {
      return template;
    }
  }
  
  // 递归检查子文件夹
  if (template.children) {
    for (const child of template.children) {
      const match = checkFolderMatch(child, platform, contentType, extension);
      if (match) {
        return match;
      }
    }
  }
  
  return null;
}

/**
 * 获取文件夹树形结构
 */
export function getFolderTree(): FolderTemplate[] {
  return FOLDER_TEMPLATES.sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * 根据路径查找文件夹模板
 */
export function getFolderByPath(path: string): FolderTemplate | null {
  function searchFolder(folders: FolderTemplate[]): FolderTemplate | null {
    for (const folder of folders) {
      if (folder.path === path) {
        return folder;
      }
      if (folder.children) {
        const found = searchFolder(folder.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  
  return searchFolder(FOLDER_TEMPLATES);
}

/**
 * 根据ID查找文件夹模板
 */
export function getFolderById(id: string): FolderTemplate | null {
  function searchFolder(folders: FolderTemplate[]): FolderTemplate | null {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder;
      }
      if (folder.children) {
        const found = searchFolder(folder.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  
  return searchFolder(FOLDER_TEMPLATES);
}
