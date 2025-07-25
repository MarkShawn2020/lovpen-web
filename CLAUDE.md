# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## **前端设计请严格遵循 @ocs/design-guide.md  **

## Commands

### Development
```bash
npm run dev              # Start development server with database
npm run dev:next         # Next.js dev server only
npm run dev:spotlight    # Sentry Spotlight for local error monitoring
```

### UI Components (shadcn/ui)
```bash
# Standard way to add shadcn/ui-old components
pnpm dlx shadcn add [component-name]

# Examples:
pnpm dlx shadcn add button
pnpm dlx shadcn add select
pnpm dlx shadcn add dialog
pnpm dlx shadcn add form

# List available components
pnpm dlx shadcn add

# Add multiple components at once
pnpm dlx shadcn add button select dialog
```

### Build and Type Checking
```bash
npm run build            # Production build with in-memory database for tests
npm run build:next       # Next.js build only
npm run start            # Start production server
npm run check:types      # TypeScript type checking
```

### Testing
```bash
npm run test             # Run Vitest unit tests
npm run test:e2e         # Run Playwright E2E tests
npm run storybook        # Start Storybook for UI development
npm run storybook:test   # Run Storybook tests
```

### Database
```bash
npm run db-server:file   # Local PostgreSQL server with file persistence
npm run db-server:memory # In-memory PostgreSQL server for testing
npm run db:generate      # Generate database migrations
npm run db:studio        # Open Drizzle Studio database explorer
```

### Code Quality
```bash
npm run lint             # ESLint with auto-fix
npm run commit           # Interactive commit with Commitizen
npm run check:deps       # Check unused dependencies with Knip
npm run check:i18n       # Validate internationalization files
```

### Analysis
```bash
npm run build-stats      # Bundle analyzer
npm run lighthouse       # Performance analysis
npm run test:lighthouse  # Performance testing
```

## Architecture

This is a production-ready Next.js 15 boilerplate with App Router, emphasizing developer experience and modern tooling.

### Core Stack
- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS 4.x
- **Database**: DrizzleORM with PostgreSQL (PGlite for local development)
- **Authentication**: Clerk with multi-factor auth and social providers
- **Type Safety**: TypeScript with strict configuration
- **Internationalization**: next-intl with Crowdin integration

### Project Structure
```
src/
├── app/[locale]/           # Next.js App Router with i18n
│   ├── (auth)/            # Authentication routes (grouped)
│   │   ├── (center)/      # Centered auth layout
│   │   └── dashboard/     # Protected dashboard area
│   └── (marketing)/       # Public marketing pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── analytics/        # Analytics components
├── libs/                 # Third-party library configurations
├── models/               # Database schema (Drizzle ORM)
├── utils/                # Utility functions and app config
├── validations/          # Zod validation schemas
├── locales/              # i18n translation files
└── middleware.ts         # Next.js middleware for auth/i18n
```

### Key Architectural Patterns

#### Route Groups
- `(auth)` - Authentication-related pages with shared layouts
- `(center)` - Centered layout for sign-in/sign-up forms
- `(marketing)` - Public-facing pages
- `[locale]` - Internationalization routing

#### Database Layer
- **Schema**: Defined in `src/models/Schema.ts` using Drizzle ORM
- **Local Development**: PGlite for offline development
- **Production**: PostgreSQL with automatic migrations
- **Type Safety**: Full TypeScript integration with database schema

#### Authentication Flow
- Clerk handles all authentication logic
- Middleware enforces route protection
- Multi-factor auth and social providers supported
- User profiles managed through Clerk dashboard

#### Internationalization
- Route-based localization with `[locale]` dynamic segments
- Translation files in `src/locales/`
- Crowdin integration for translation management
- Type-safe translations with next-intl

### Development Workflow

#### Adding New Features
1. Update database schema in `src/models/Schema.ts` if needed
2. Run `npm run db:generate` to create migrations
3. Add validation schemas in `src/validations/`
4. Create components following existing patterns
5. Add translations to locale files

#### Testing Strategy
- **Unit Tests**: Vitest with browser mode for component testing
- **E2E Tests**: Playwright with automatic server setup
- **Visual Testing**: Storybook for component development
- **Type Safety**: Strict TypeScript checking

#### Code Quality Tools
- **ESLint**: Antfu config with Next.js, accessibility, and testing rules
- **Lefthook**: Git hooks for pre-commit linting and type checking
- **Commitlint**: Conventional commit message validation
- **Knip**: Unused dependency detection

### Configuration Files

#### Essential Configs
- `next.config.ts` - Next.js with Sentry, i18n, and bundle analyzer
- `drizzle.config.ts` - Database configuration and migrations
- `tsconfig.json` - Strict TypeScript with path mapping
- `eslint.config.mjs` - Comprehensive linting rules
- `playwright.config.ts` - E2E testing with database setup

#### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `SENTRY_*` - Error monitoring configuration
- `ARCJET_KEY` - Security and bot protection

### Security Features
- **Arcjet**: Bot detection and WAF protection
- **Clerk**: Secure authentication with MFA
- **Sentry**: Error monitoring and performance tracking
- **CSP**: Content Security Policy headers
- **Type Safety**: Runtime validation with Zod

### Performance Optimizations
- Bundle analysis with webpack-bundle-analyzer
- Image optimization with Next.js Image component
- Static generation for marketing pages
- Incremental Static Regeneration (ISR) support
- Performance monitoring with Lighthouse and Checkly

## Notes

- The project uses `npm` as the package manager (not pnpm despite global preferences)
- Database migrations are automatically applied during development
- All external integrations are optional and can be disabled via environment variables
- Storybook is configured for component development and testing
- The boilerplate follows Next.js 15 and React 19 best practices

## Workflow Tips

- 本地已经开启一个 dev 服务，请不要 build，只要 pnpm lint:fix && pnpm check:types 即可

## Checkpoint 记录

### 项目检查点 - 2025-07-18

**项目**: @lovpen/web | **分支**: main  
**里程碑**: Beta Development | **健康度**: 9/10

#### 技术状态
- **代码质量**: 优秀 (165个TS/TSX文件，严格类型检查)
- **架构健康**: 健康 (Next.js 15 + React 19，现代化技术栈)
- **API集成**: 完善 (15个API模块，104个端点)

#### 开发活动分析
- **期间提交**: 最近30天27个提交 (高活跃度)
- **主要特性**: Profile系统组件、排期功能、用户认证优化
- **发展趋势**: 上升 (持续功能迭代和UI改进)

#### 文档维护
- [x] README.md: 完整且最新 (Next.js Boilerplate说明完善)
- [x] API文档: 自动生成，结构清晰 (backend-apis/README.md)
- [x] 配置同步: 正常 (package.json, CLAUDE.md同步)

#### 建议行动
1. 继续完善Profile组件系统 (已新增7个profile视图组件)
2. 优化API文档结构 (当前15个模块文档完整)
3. 加强用户认证流程 (Clerk集成基础已完成)
4. 考虑添加更多测试覆盖 (当前有Vitest和Playwright配置)

**Git提交**: f86cc8c (fix: user avatar dropdown)
```
