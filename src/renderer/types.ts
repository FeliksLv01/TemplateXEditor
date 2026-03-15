import type { DSLComponent } from '@/types/dsl';

/**
 * 渲染上下文 — 在组件树递归渲染时向下传递
 */
export interface RenderContext {
  /** 模拟数据，用于解析 ${expression} */
  data: Record<string, any>;
  /** 当前选中的组件 ID（编辑器用） */
  selectedId?: string | null;
  /** 组件点击回调（编辑器用） */
  onSelect?: (id: string) => void;
}

/**
 * 注册的组件渲染函数签名
 *
 * 每个组件类型注册一个 React 函数组件，接收：
 * - component: DSL 节点（已经过数据绑定解析）
 * - context: 渲染上下文
 * - children: 子节点已渲染的 React 元素数组
 */
export interface TXComponentProps {
  component: DSLComponent;
  context: RenderContext;
  resolvedProps: Record<string, any>;
  resolvedStyle: Record<string, any>;
  children?: React.ReactNode;
}

export type TXComponentRender = React.FC<TXComponentProps>;
