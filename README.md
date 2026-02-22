# TemplateX Editor

基于 React + TypeScript 的 TemplateX 可视化编辑器，支持拖拽式组件搭建、实时预览和 DSL 导入/导出。

## 效果展示

![TemplateX Editor](docs/20260222232030654.png)

## 功能特性

- **组件面板**: 提供 Container、Text、Image、Button、List 等基础组件，支持拖拽添加
- **组件树**: 可视化展示组件层级结构，支持嵌套和拖拽排序
- **实时预览**: 所见即所得的画布预览，支持组件选中和高亮
- **属性面板**: 丰富的属性配置项，包括尺寸、间距、Flexbox 布局、样式等
- **DSL 导入/导出**: 支持导出为 JSON DSL 格式，以及从 JSON 导入
- **撤销/重做**: 完整的操作历史记录

## 项目结构

```
TemplateXEditor/
├── src/
│   ├── App.tsx                          # 应用入口
│   ├── main.tsx                         # React 根节点
│   ├── index.css                        # 全局样式 + Tailwind CSS
│   ├── components/                      # 编辑器核心组件
│   │   ├── ComponentPanel.tsx           # 组件面板 (左侧拖拽源)
│   │   ├── ComponentTree.tsx            # 组件树 (层级展示)
│   │   ├── PreviewCanvas.tsx            # 预览画布
│   │   ├── PropertyPanel.tsx            # 属性面板 (右侧配置)
│   │   ├── ComponentRenderer.tsx        # 组件渲染器
│   │   ├── DragDropHandler.tsx          # 拖拽处理
│   │   ├── Toolbar.tsx                  # 顶部工具栏
│   │   └── property-items/              # 属性配置组件
│   ├── templatex-assets/                # TemplateX 组件资产
│   │   ├── container/                   # Container 组件
│   │   ├── text/                        # Text 组件
│   │   ├── image/                       # Image 组件
│   │   ├── button/                      # Button 组件
│   │   └── list/                        # List 组件
│   ├── converters/                      # DSL 转换器
│   ├── store/                           # Zustand 状态管理
│   ├── hooks/                           # 自定义 Hooks
│   ├── config/                          # 配置文件
│   ├── types/                           # TypeScript 类型定义
│   └── utils/                           # 工具函数
├── docs/                                # 文档和截图
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Ant Design 5.x
- **拖拽库**: @dnd-kit/core + @dnd-kit/sortable
- **状态管理**: Zustand 4.x
- **样式方案**: Tailwind CSS 3.x + antd-style

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## TemplateX DSL 格式

```json
{
  "type": "container",
  "id": "unique-id",
  "style": {
    "width": "100%",
    "height": "auto",
    "padding": 16,
    "backgroundColor": "#FFFFFF",
    "flexDirection": "column",
    "justifyContent": "flex-start",
    "alignItems": "stretch"
  },
  "props": {
    "text": "Hello TemplateX!"
  },
  "children": [
    {
      "type": "text",
      "id": "text-id",
      "style": { "fontSize": 16, "color": "#333333" },
      "props": { "text": "Hello World" }
    }
  ]
}
```

## 实施进度

- [x] Phase 1: 项目初始化
- [x] Phase 2: 实现 Container Asset
- [x] Phase 3: 实现 Text Asset
- [x] Phase 4: 实现 Image Asset
- [x] Phase 5: 实现 Button Asset
- [x] Phase 6: 实现 List Asset
- [x] Phase 7: 编辑器核心组件 (组件面板、组件树、预览画布、属性面板)
- [x] Phase 8: 拖拽功能 (@dnd-kit 集成)
- [x] Phase 9: DSL 导入/导出
- [x] Phase 10: 撤销/重做功能
- [ ] Phase 11: 更多组件和属性支持
- [ ] Phase 12: 优化和扩展

## 许可证

MIT
