import React from 'react';
import type { DSLComponent } from '@/types/dsl';
import { TemplateXRenderer } from '@/renderer';
import type { RenderContext } from '@/renderer';

interface ComponentRendererProps {
  component: DSLComponent;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** 模拟数据，用于解析 bindings 中的 ${expression} */
  mockData?: Record<string, any>;
}

/**
 * ComponentRenderer — 编辑器预览组件
 *
 * 薄包装层：将编辑器的 props 转换为 RenderContext，
 * 然后委托给 TemplateXRenderer 做实际渲染。
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  selectedId,
  onSelect,
  mockData = {},
}) => {
  const context: RenderContext = {
    data: mockData,
    selectedId,
    onSelect,
  };

  return <TemplateXRenderer component={component} context={context} />;
};
