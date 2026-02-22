# AGENTS.md - AI 代码助手指南

本文档为 AI 代码助手提供项目上下文和开发规范。

## 项目概述

TemplateX Editor 是一个可视化 UI 编辑器，用于搭建 TemplateX DSL 模板。用户可以通过拖拽组件、配置属性来构建界面，并导出为 JSON DSL 格式。

## 核心架构

### 状态管理

- 使用 Zustand 进行状态管理
- Store 位于 `src/store/`
- 主要状态: 组件树 (nodes)、选中组件 (selectedId)、历史记录 (用于撤销/重做)

### 组件系统

每个 TemplateX 组件资产位于 `src/templatex-assets/{component}/`，包含:

- `types.ts` - 组件配置类型定义
- `schema.ts` - 属性 schema
- `Component.tsx` - 渲染组件
- `index.ts` - 导出

支持的组件: Container, Text, Image, Button, List

### 编辑器组件

位于 `src/components/`:

- `ComponentPanel.tsx` - 左侧组件面板，拖拽源
- `ComponentTree.tsx` - 组件层级树
- `PreviewCanvas.tsx` - 中间预览画布
- `PropertyPanel.tsx` - 右侧属性配置面板
- `ComponentRenderer.tsx` - 递归渲染组件树
- `property-items/` - 属性编辑器组件 (尺寸、间距、Flexbox 等)

### DSL 转换

- `src/converters/` - DSL 导入/导出逻辑
- 格式: JSON，包含 type, id, style, props, children

## 开发规范

### 代码风格

- 使用 TypeScript，严格类型
- React 函数组件 + Hooks
- 使用 Tailwind CSS 进行样式开发
- Ant Design 组件库用于 UI

### 新增组件

1. 在 `src/templatex-assets/` 下创建组件目录
2. 定义 types.ts、schema.ts、Component.tsx
3. 在 ComponentPanel 和 ComponentRenderer 中注册
4. 在 PropertyPanel 中添加属性配置

### 属性面板

- 属性编辑器组件位于 `src/components/property-items/`
- 使用折叠面板 (Collapse) 分组属性
- 支持: 尺寸、间距、Flexbox 布局、背景、边框、文字样式等

## 常用命令

```bash
npm run dev      # 启动开发服务器 (localhost:3000)
npm run build    # 构建生产版本
npm run preview  # 预览构建产物
```

## 注意事项

- 组件嵌套: 只有 Container 和 List 支持 children
- 拖拽使用 @dnd-kit 库
- 样式值支持数字 (px) 和字符串 (百分比等)
