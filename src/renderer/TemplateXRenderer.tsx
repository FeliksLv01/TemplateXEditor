import React from 'react';
import type { DSLComponent } from '@/types/dsl';
import type { RenderContext } from './types';
import { registry } from './registry';
import { resolveBindings } from './dataBinding';

interface TemplateXRendererProps {
  /** DSL 组件树根节点 */
  component: DSLComponent;
  /** 渲染上下文 */
  context: RenderContext;
}

/**
 * TemplateXRenderer — 通用递归渲染器
 *
 * 职责：
 * 1. 从 registry 查找组件类型对应的 React 渲染函数
 * 2. 解析数据绑定（bindings + context.data → resolved props/style）
 * 3. 递归渲染子节点
 * 4. 未知类型显示 fallback
 */
export const TemplateXRenderer: React.FC<TemplateXRendererProps> = ({
  component,
  context,
}) => {
  // 1. 解析数据绑定
  const { props: resolvedProps, style: resolvedStyle } = resolveBindings(component, context.data);

  // 2. 递归渲染子节点
  const childElements = component.children?.map((child, index) => (
    <TemplateXRenderer
      key={`${child.id}-${index}`}
      component={child}
      context={context}
    />
  ));

  // 3. 查找注册的渲染组件
  const Render = registry.get(component.type);
  if (!Render) {
    return <div style={{ color: 'red', padding: 4 }}>Unknown: {component.type}</div>;
  }

  // 4. 渲染
  return (
    <Render
      component={component}
      context={context}
      resolvedProps={resolvedProps}
      resolvedStyle={resolvedStyle}
    >
      {childElements}
    </Render>
  );
};
