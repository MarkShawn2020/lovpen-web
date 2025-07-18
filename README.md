# Lovpen Web

<p align="center">
  <img
    src="public/assets/images/neurora-logo-red.svg"
    alt="Lovpen Web Logo"
    width="200"
    style="max-width: 100%; height: auto;"
  />
</p>

🚀 现代化的智能Web应用平台，基于 Next.js 15 + React 19 构建 ⚡️ 集成AI功能、知识管理、文件处理、用户认证等核心功能模块。

**项目状态**: v0.1.0 Beta Development | **健康度**: 9/10

## 核心功能

### 🎯 主要特性
- **AI智能集成**: 多模型支持 (Anthropic Claude, OpenAI)
- **知识管理**: 文档上传、处理、检索系统
- **文件管理**: 完整的文件生命周期管理
- **用户系统**: 基于Clerk的完整认证和Profile管理
- **排期管理**: 日程和任务安排功能
- **API集成**: 15个后端API模块，104个端点

### 🔧 技术架构

#### 前端技术栈
- ⚡ **Next.js 15** + React 19 (App Router)
- 🎨 **Tailwind CSS 4.x** + shadcn/ui 组件库
- 🔷 **TypeScript** 严格类型检查
- 🌐 **国际化** (next-intl)

#### 后端集成
- 🗄️ **数据库**: DrizzleORM + PostgreSQL (本地 PGlite)
- 🔐 **认证**: Clerk (多因子认证、社交登录)
- 🤖 **AI服务**: Anthropic Claude + OpenAI
- 📡 **API**: 15个模块化后端API

#### 开发体验
- 🧪 **测试**: Vitest + Playwright
- 📏 **代码质量**: ESLint + Prettier + Lefthook
- 📝 **提交规范**: Commitlint + Commitizen
- 🔍 **监控**: Sentry + Spotlight
- 📊 **分析**: Bundle Analyzer + Lighthouse

#### 安全与性能
- 🛡️ **安全**: Arcjet (Bot检测、WAF防护)
- 📈 **监控**: PostHog Analytics
- ⚡ **优化**: 静态生成 + ISR

## 快速开始

### 环境要求
- Node.js 20+
- npm (项目使用npm，非pnpm)

### 安装与运行

```bash
# 克隆项目
git clone <repository-url> lovpen-web
cd lovpen-web

# 安装依赖
npm install

# 启动开发服务器 (包含数据库)
npm run dev

# 仅启动Next.js服务器
npm run dev:next

# 启动Sentry监控
npm run dev:spotlight
```

打开 http://localhost:3000 查看应用。项目已预配置PGlite本地数据库，无需额外设置。

### 开发命令

```bash
# 代码检查和修复
npm run lint
npm run check:types

# 数据库操作
npm run db:generate     # 生成迁移
npm run db:studio       # 打开数据库管理界面

# 测试
npm run test            # 单元测试
npm run test:e2e        # E2E测试

# 构建
npm run build           # 生产构建
npm run build-stats     # 构建分析
```

## 配置

### 环境变量设置

创建 `.env.local` 文件并配置以下变量：

```bash
# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# 数据库 (生产环境)
DATABASE_URL=your_postgresql_connection_string

# Sentry 监控
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project

# Arcjet 安全
ARCJET_KEY=your_arcjet_key

# Better Stack 日志
BETTER_STACK_SOURCE_TOKEN=your_token

# PostHog 分析
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Clerk 认证配置

1. 在 [Clerk.com](https://clerk.com) 创建账号和应用
2. 复制 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 和 `CLERK_SECRET_KEY`
3. 添加到 `.env.local` 文件

支持功能：注册、登录、多因子认证、社交登录、用户管理等。

### 数据库配置

**本地开发**: 使用 PGlite，无需额外配置  
**生产环境**: 配置 PostgreSQL 连接字符串到 `DATABASE_URL`

```bash
# 生成数据库迁移
npm run db:generate

# 查看数据库管理界面
npm run db:studio
```

## 项目结构

```
lovpen-web/
├── src/
│   ├── app/[locale]/              # Next.js App Router (国际化)
│   │   ├── (auth)/               # 认证路由组
│   │   │   ├── profile/          # 用户档案
│   │   │   ├── space/            # 文件空间
│   │   │   └── topic-schedule/   # 排期管理
│   │   ├── (marketing)/          # 营销页面
│   │   └── api/                  # API路由
│   ├── components/               # React组件
│   │   ├── ui/                   # shadcn/ui基础组件
│   │   ├── profile/              # 用户档案组件
│   │   ├── knowledge/            # 知识管理组件
│   │   ├── chat/                 # 聊天组件
│   │   └── layout/               # 布局组件
│   ├── lib/                      # 第三方库配置
│   ├── models/                   # 数据库模型 (Drizzle)
│   ├── services/                 # 服务层
│   ├── types/                    # TypeScript类型定义
│   ├── utils/                    # 工具函数
│   └── validations/              # Zod验证模式
├── backend-apis/                 # 后端API文档 (15个模块)
├── docs/                         # 项目文档
├── migrations/                   # 数据库迁移
├── public/                       # 静态资源
└── tests/                        # 测试文件
    ├── e2e/                      # E2E测试
    └── integration/              # 集成测试
```

## API文档

项目包含15个后端API模块，总计104个端点：

- **Knowledge API** (28个端点) - 知识管理
- **Files API** (13个端点) - 文件管理  
- **User API** (11个端点) - 用户管理
- **Account API** (9个端点) - 账户管理
- **uni-pusher API** (9个端点) - 推送服务
- **即刻 API** (7个端点) - 即刻集成
- **微信 API** (6个端点) - 微信集成
- **Map API** (5个端点) - 地图服务
- **LLM API** (4个端点) - AI模型
- **VPN API** (4个端点) - VPN服务
- **media API** (3个端点) - 媒体处理
- **thoughts API** (2个端点) - 思维导图
- **Badminton API** (1个端点) - 羽毛球
- **OSS API** (1个端点) - 对象存储
- **Spider API** (1个端点) - 爬虫服务

详细API文档请查看 `backend-apis/` 目录。

## 开发指南

### 数据库schema修改

1. 更新 `src/models/Schema.ts`
2. 生成迁移：`npm run db:generate`
3. 迁移会在下次数据库交互时自动应用

### 添加新功能

1. 在 `src/app/[locale]/(auth)/` 下创建新路由
2. 在 `src/components/` 下创建相关组件
3. 添加API路由到 `src/app/api/`
4. 更新类型定义 `src/types/`
5. 添加验证模式 `src/validations/`

### 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
npm run commit  # 交互式提交助手
```

支持的类型：`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 测试

### 单元测试 (Vitest)

```bash
npm run test  # 运行单元测试
```

### E2E测试 (Playwright)

```bash
npm run test:e2e  # 运行端到端测试
```

### Storybook组件开发

```bash
npm run storybook       # 启动Storybook
npm run storybook:test  # 运行Storybook测试
```

## 部署

### 生产构建

```bash
npm run build   # 生产构建
npm run start   # 启动生产服务器
```

数据库迁移会在构建过程中自动执行，确保设置好 `DATABASE_URL` 环境变量。

### 性能分析

```bash
npm run build-stats  # 构建分析
npm run lighthouse   # 性能分析
```

## 开发工具

### VSCode集成

项目包含完整的VSCode配置：

- 推荐扩展 (`.vscode/extensions.json`)
- 调试配置 (前后端)
- 任务配置
- 设置同步

### 数据库管理

```bash
npm run db:studio  # 打开 Drizzle Studio
```

访问 https://local.drizzle.studio 管理数据库。

## 许可证

MIT License, Copyright © 2025

## 项目状态

- **版本**: v0.1.0
- **状态**: Beta Development
- **健康度**: 9/10
- **最近活动**: 高活跃度 (30天内27次提交)
- **技术栈**: 现代化 (Next.js 15 + React 19)

---

🚀 **Lovpen Web** - 现代化智能Web应用平台
