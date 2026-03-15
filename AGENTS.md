# TemplateX Editor - AI 代码助手指南

## 项目概述

TemplateX Editor 是一个可视化拖拽编辑器（React + TypeScript + Ant Design），用于构建 [TemplateX](../TemplateX/) iOS DSL 动态渲染引擎的 JSON 模板。用户通过拖拽组件、配置属性、绑定数据、配置事件来搭建界面，最终导出为 JSON DSL 供 iOS 端渲染。

**关联项目**：iOS 渲染引擎位于 `/Users/felikslv/Desktop/TemplateX`，编辑器的属性面板、默认值、组件类型必须与 iOS 端保持一致。

---

## 技术栈

| 领域 | 技术选型 |
|------|---------|
| 框架 | React 18 + TypeScript（strict 模式） |
| 构建 | Vite 6 |
| 状态管理 | Zustand 4（persist + devtools 中间件） |
| UI 组件库 | Ant Design 5 |
| 样式 | Tailwind CSS 3 |
| 拖拽 | @dnd-kit/core + @dnd-kit/sortable |
| 代码编辑器 | @uiw/react-codemirror + @codemirror/lang-json + @codemirror/lint |
| 包管理器 | **pnpm**（禁止使用 npm / yarn） |

---

## 目录结构

```
src/
├── App.tsx                          # 根组件，三栏布局
├── main.tsx                         # 入口
├── index.css                        # 全局样式（Tailwind）
├── components/                      # 编辑器 UI 组件
│   ├── ComponentPanel.tsx           # 左侧组件面板（拖拽源）
│   ├── ComponentTree.tsx            # 左侧组件层级树
│   ├── PreviewCanvas.tsx            # 中间预览画布（传 mockData 给渲染器）
│   ├── ComponentRenderer.tsx        # 递归渲染入口（薄封装，委托给 TemplateXRenderer）
│   ├── PropertyPanel.tsx            # 右侧属性面板（3 个 Tab：属性/数据绑定/事件）
│   ├── Toolbar.tsx                  # 顶部工具栏（导入/导出/撤销/重做/模拟数据）
│   ├── JsonEditor.tsx               # CodeMirror JSON 编辑器封装
│   ├── DragDropHandler.tsx          # 拖拽逻辑处理
│   ├── IOSPreview.tsx               # iOS 预览（预留）
│   └── property-items/              # 属性编辑器子组件
│       ├── SizeInput.tsx            # 尺寸输入（支持 px/% / auto）
│       ├── BoxModelInput.tsx        # 盒模型输入（margin / padding）
│       └── index.ts
├── renderer/                        # 轻量前端渲染库
│   ├── index.ts                     # 统一导出 + 注册内置组件
│   ├── types.ts                     # RenderContext, TXComponentProps, TXComponentRender
│   ├── registry.ts                  # ComponentRegistry（注册表模式）
│   ├── expressionResolver.ts        # ${expression} 表达式解析器
│   ├── dataBinding.ts               # 数据绑定解析（bindings → props/style 覆盖）
│   ├── styleMapper.ts               # iOS DSL style → CSS style 映射
│   ├── TemplateXRenderer.tsx         # 核心递归渲染器
│   └── components/                  # 注册的渲染组件
│       ├── TXContainer.tsx
│       ├── TXText.tsx
│       ├── TXImage.tsx
│       ├── TXButton.tsx
│       └── TXList.tsx
├── store/
│   └── editorStore.ts               # Zustand store（组件树 + 选中 + 历史 + mockData）
├── types/
│   ├── dsl.ts                       # DSLComponent, TemplateXDSL 类型
│   ├── editor.ts                    # EditorState, ComponentDefinition 类型
│   ├── component.ts                 # 组件相关类型
│   └── index.ts
├── config/
│   └── componentRegistry.tsx        # COMPONENT_DEFINITIONS（组件元数据 + 默认值）
├── converters/
│   ├── DSLGenerator.ts              # 组件树 → JSON DSL 导出
│   ├── DSLParser.ts                 # JSON DSL → 组件树 导入
│   └── index.ts
├── templatex-assets/                # 组件资产定义（每个组件一个目录）
│   ├── container/
│   ├── text/
│   ├── image/
│   ├── button/
│   └── list/
├── utils/
│   ├── treeHelper.ts                # 不可变组件树操作（find / add / remove / update / move / clone）
│   ├── dslCleaner.ts                # 导出清理（颜色对象 → hex、保留 bindings/events）
│   ├── idGenerator.ts               # 组件 ID 生成
│   └── fileUtils.ts                 # 文件读写工具
└── hooks/                           # 自定义 Hooks
```

---

## 核心架构

### DSL 数据模型

```typescript
interface DSLComponent {
  id: string;                        // 编辑器内部 ID
  type: string;                      // 组件类型：container / text / image / button / list
  props?: Record<string, any>;       // 组件属性（text, src, contentMode 等）
  style?: Record<string, any>;       // 样式属性（Flexbox 布局 + 视觉样式）
  bindings?: Record<string, string>; // 数据绑定（key → "${expression}"）
  events?: Record<string, any>;      // 事件配置（onTap → url / params）
  children?: DSLComponent[];         // 子组件
}
```

### 状态管理（Zustand）

Store 位于 `src/store/editorStore.ts`：

- **rootComponent** — 组件树根节点
- **selectedComponentId** — 当前选中的组件 ID
- **mockData** — 模拟数据（用于预览时解析 `${expression}`）
- **history** — past/present/future 三段式历史（撤销/重做）
- **clipboard** — 剪贴板（复制/粘贴）
- **expandedKeys** — 组件树展开状态

Store 使用 `persist` 中间件持久化到 localStorage（包括 rootComponent、history、mockData）。

**不可变更新**：所有树操作（add / remove / update / move）通过 `treeHelper.ts` 返回新树，不修改原对象。`updateComponentById` 对 props 和 style 做 merge，对 bindings 和 events 做 replace。

### 右侧属性面板（PropertyPanel）

3 个 Tab：

| Tab | 内容 | 编辑器 |
|-----|------|--------|
| 属性 | style + props | Ant Design 表单控件 |
| 数据绑定 | bindings（JSON） | CodeMirror JsonEditor |
| 事件 | events（JSON） | CodeMirror JsonEditor |

### 渲染库（src/renderer/）

轻量前端渲染库，**不追求 iOS 完整还原**，仅用于编辑器预览。

**设计决策**：
- **注册表模式**：`registry.register('container', TXContainer)` — 新增组件只需注册，渲染器无需修改
- **表达式求值**：简单路径 `${item.title}` 用手动路径取值（高性能），复杂表达式用 `new Function()` fallback。不引入 ANTLR4
- **数据绑定流程**：`resolveBindings()` 遍历 `component.bindings`，用 mockData 求值，根据 key 属于 props 还是 style（通过 `PROPS_KEYS` Set 判断）覆盖对应值，返回新对象不修改组件树
- **样式映射**：`styleMapper.ts` 将 iOS DSL style（flexDirection, justifyContent, alignItems 等）映射为 CSS style

**关键同步点**：`dataBinding.ts` 中的 `PROPS_KEYS` Set 必须与 `PropertyPanel.tsx` 中的 `PROPS_KEYS` 数组保持一致。

---

## 支持的组件

| 类型 | 组件 | 支持 children | 说明 |
|------|------|:---:|------|
| container | ContainerComponent | Y | Flexbox 布局容器 |
| text | TextComponent | N | 文本组件 |
| image | ImageComponent | N | 图片组件，`contentMode` 在 props 中 |
| button | ButtonComponent | N | 按钮组件 |
| list | ListComponent | N | 列表组件（编辑器预览简化，跳过复杂实现） |

### iOS 对齐注意事项

- **image 的 contentMode**：属于 `props`（不是 style），值为 iOS 原生枚举：`scaleAspectFill` / `scaleAspectFit` / `scaleToFill`。渲染库的 `TXImage` 负责映射到 CSS `objectFit`
- **gap 属性**：iOS `StyleParser` 不解析 `gap`，编辑器已移除
- **事件 key**：模板中使用 `onTap`（不是 onClick）
- **默认值**：必须与 iOS 端一致（container 宽度默认 auto、text 颜色默认 #000000 等）

---

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (localhost:3000)
pnpm build        # tsc + vite build
pnpm preview      # 预览构建产物
```

### 验证命令

```bash
npx tsc --noEmit                    # TypeScript 类型检查（必须零错误）
npx vite build --logLevel error     # 生产构建验证
```

**重要**：每次修改代码后，必须运行 `npx tsc --noEmit` 确认零错误。tsconfig 开启了 `strict`、`noUnusedLocals`、`noUnusedParameters`。

---

## 开发规范

### 代码风格

- TypeScript strict 模式，所有类型必须显式声明
- React 函数组件 + Hooks，禁止 class 组件
- Tailwind CSS 用于布局样式，Ant Design 用于 UI 控件
- 路径别名：`@/` → `src/`（配置在 tsconfig.json 和 vite.config.ts）
- 中文注释（解释 why，不解释 what）
- 禁止 emojis 除非用户明确要求

### 新增组件流程

1. 在 `src/templatex-assets/{component}/` 下创建组件目录
2. 在 `src/config/componentRegistry.tsx` 的 `COMPONENT_DEFINITIONS` 中注册元数据和默认值
3. 在 `src/components/PropertyPanel.tsx` 中添加属性编辑面板
4. 在 `src/renderer/components/` 下创建 `TX{Component}.tsx` 渲染组件
5. 在 `src/renderer/index.ts` 中注册：`registry.register('type', TXComponent)`
6. 如果组件有新的 props key，更新 `dataBinding.ts` 和 `PropertyPanel.tsx` 中的 `PROPS_KEYS`

### 修改属性面板时

- props 和 style 的分类必须与 iOS 端 `ComponentStyle` / 各组件 `Props` 保持一致
- 默认值必须与 iOS 端默认值对齐（参考 iOS 项目的 AGENTS.md）
- 颜色值使用 `#RRGGBB` 或 `#RRGGBBAA` 格式

### 导出清理

`dslCleaner.ts` 的 `cleanComponentForExport()` 负责：
- 将 Ant Design ColorPicker 的颜色对象转为 `#hex` 字符串
- 保留非空的 `bindings` 和 `events`
- 递归处理子组件

---

## 注意事项

- **组件嵌套**：只有 `container` 支持任意 children。`list` 不在编辑器中支持拖入子组件（iOS 端的 list 通过 `itemTemplate` + `items` 数据驱动）
- **拖拽**：使用 @dnd-kit 库，DragDropHandler.tsx 处理拖拽逻辑
- **样式值**：支持数字（px）和字符串（百分比 `"50%"`、auto `"auto"`）
- **localStorage 持久化**：编辑器状态自动保存，恢复时会通过 `cleanStoredComponent` 清理颜色格式
- **List 组件**：编辑器预览为简化实现，复杂的 iOS List 功能（Cell 复用、GapWorker 预取等）不在编辑器中体现
- **不要编译 iOS 项目**：iOS 端由用户手动在 Xcode 中编译
