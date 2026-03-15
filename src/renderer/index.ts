/**
 * TemplateX 前端轻量渲染库
 *
 * 用法：
 *   import { TemplateXRenderer, registry } from '@/renderer';
 *
 *   <TemplateXRenderer
 *     component={dslTree}
 *     context={{ data: mockData, selectedId, onSelect }}
 *   />
 */

// 核心渲染器
export { TemplateXRenderer } from './TemplateXRenderer';

// 组件注册表
export { registry } from './registry';

// 类型
export type { RenderContext, TXComponentProps, TXComponentRender } from './types';

// 数据绑定 & 表达式
export { resolveBindings } from './dataBinding';
export { resolveString, resolveDeep } from './expressionResolver';

// 样式映射
export { mapStyle, mapColor } from './styleMapper';

// ---------- 注册内置组件 ----------
import { registry } from './registry';
import { TXContainer } from './components/TXContainer';
import { TXText } from './components/TXText';
import { TXImage } from './components/TXImage';
import { TXButton } from './components/TXButton';
import { TXList } from './components/TXList';

registry.register('container', TXContainer);
registry.register('text', TXText);
registry.register('image', TXImage);
registry.register('button', TXButton);
registry.register('list', TXList);
