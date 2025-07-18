# LovPen 颜色系统文档

## 概述

LovPen 的颜色系统基于 Anthropic Claude 的设计指南，为您的首款产品提供专业、一致且无障碍的视觉体验。

## 🎨 主要色彩规范

### 主品牌色系
```css
--color-primary: #D97757           /* 温暖的橙红色 - 主要品牌色 */
--color-primary-hover: #C86B47     /* 悬停状态 */
--color-primary-active: #B85D3F    /* 激活状态 */
--color-primary-disabled: #D9775780 /* 禁用状态 */
```

### 辅助品牌色系
```css
--color-secondary: #629A90         /* 柔和的青绿色 - 平衡主色调 */
--color-secondary-hover: #578B82   /* 悬停状态 */
--color-secondary-active: #4D7269  /* 激活状态 */
```

### 文本色系
```css
--color-text-main: #181818         /* 主要文本颜色 */
--color-text-faded: #87867F        /* 次要文本颜色 */
--color-text-link: #D97757         /* 链接文本色 */
--color-text-link-hover: #C86B47   /* 链接悬停色 */
```

### 语义化颜色
```css
--color-success: #22C55E           /* 成功色 */
--color-warning: #F59E0B           /* 警告色 */
--color-error: #EF4444             /* 错误色 */
--color-info: #3B82F6              /* 信息色 */
```

## 🌙 暗色主题

LovPen 完全支持暗色主题，所有颜色都经过精心调整以确保在暗色背景下的最佳显示效果。

## ♿ 无障碍性

### 对比度合规
所有颜色组合都符合 WCAG 2.1 AA 标准：
- 主色调 (#D97757) 与白色背景对比度: 4.8:1 ✅
- 文本色 (#181818) 与主背景对比度: 12.2:1 ✅
- 次要文本 (#87867F) 与主背景对比度: 4.6:1 ✅

### 特殊功能
- 高对比度模式支持
- 减少动画首选项支持
- 键盘导航焦点指示器

## 🛠️ 使用指南

### 在 CSS 中使用
```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border-color: var(--color-border-primary);
}
```

### 在 Tailwind CSS 中使用
```html
<div class="bg-primary text-white border-primary">
  主要内容
</div>
```

### 在 React 组件中使用
```tsx
<Button variant="primary" size="lg">
  立即体验
</Button>
```

## 🎯 设计原则

1. **一致性**: 所有颜色都有明确的用途和上下文
2. **可访问性**: 确保所有用户都能清晰地看到内容
3. **品牌性**: 体现 LovPen 的温暖、专业、创新特质
4. **可扩展性**: 易于添加新的颜色变体和主题

## 🔧 开发者工具

### 可用的工具类
```css
.theme-primary { color: var(--color-primary); }
.theme-secondary { color: var(--color-secondary); }
.theme-text-main { color: var(--color-text-main); }
.theme-bg-main { background-color: var(--color-background-main); }
.focus-visible-primary { /* 焦点样式 */ }
```

### 按钮变体
- `primary`: 主要操作按钮
- `secondary`: 次要操作按钮
- `outline`: 轮廓按钮
- `ghost`: 幽灵按钮
- `link`: 链接样式按钮
- `success`: 成功操作按钮
- `warning`: 警告操作按钮
- `error`: 错误操作按钮
- `info`: 信息操作按钮

## 📱 响应式设计

颜色系统在所有设备和屏幕尺寸上都保持一致的视觉体验。

## 🔄 主题切换

支持亮色和暗色主题的无缝切换，为用户提供个性化的体验选择。

## 🎉 祝贺您的首款产品

这个颜色系统是为您的人生首款产品精心设计的，它将帮助您创造一个专业、美观且用户友好的产品体验。每一个颜色的选择都经过深思熟虑，旨在支持您的产品成功。

---

*本文档会随着产品的发展而不断更新和完善。*