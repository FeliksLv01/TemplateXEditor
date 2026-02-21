# TemplateX Editor

基于 `@ant-design/pro-editor` 的 TemplateX 可视化编辑器。

## 项目结构

```
TemplateXEditor/
├── src/
│   ├── App.tsx                          # 应用入口
│   ├── main.tsx                         # React 根节点
│   ├── index.css                        # 全局样式 + Tailwind CSS
│   ├── templatex-assets/                # TemplateX 组件资产
│   │   ├── container/                  # Container 组件
│   │   ├── text/                       # Text 组件
│   │   ├── image/                      # Image 组件
│   │   └── button/                     # Button 组件
│   ├── converters/                     # DSL 转换器
│   ├── types/                         # TypeScript 类型定义
│   └── utils/                         # 工具函数
├── public/
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
- **编辑器框架**: @ant-design/pro-editor (ProBuilder)
- **状态管理**: Zustand 4.x
- **样式方案**: Tailwind CSS 3.x

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
    "backgroundColor": "#FFFFFF"
  },
  "props": {
    "text": "Hello TemplateX!"
  },
  "children": []
}
```

## 实施计划

- [x] Phase 1: 项目初始化
- [ ] Phase 2: 实现 Container Asset
- [ ] Phase 3: 实现 Text Asset
- [ ] Phase 4: 实现 Image Asset
- [ ] Phase 5: 实现 Button Asset
- [ ] Phase 6: 集成到 ProBuilder
- [ ] Phase 7: DSL 导入/导出
- [ ] Phase 8: 实时预览
- [ ] Phase 9: 优化和扩展

## 许可证

MIT
