import type { DSLComponent } from '@/types/dsl';
import { resolveString } from './expressionResolver';

/**
 * Props 属性列表 — 这些 key 属于 props，其余属于 style
 * 与 PropertyPanel 中的 PROPS_KEYS 保持一致
 */
const PROPS_KEYS = new Set([
  // 通用
  'text', 'title', 'src', 'contentMode', 'items',
  // List 特有
  'direction', 'columns', 'rows', 'rowSpacing', 'columnSpacing',
  'showsIndicator', 'bounces', 'isPagingEnabled',
  'itemWidth', 'itemHeight', 'estimatedItemHeight', 'autoAdjustHeight',
]);

export interface ResolvedComponent {
  props: Record<string, any>;
  style: Record<string, any>;
}

/**
 * 解析组件的数据绑定
 *
 * 流程：
 * 1. 以 component.props 和 component.style 为基础
 * 2. 遍历 component.bindings，对每个 key 用 mockData 求值
 * 3. 根据 key 是 props 还是 style，覆盖对应的值
 * 4. 返回解析后的 props 和 style（不修改原组件树）
 */
export function resolveBindings(
  component: DSLComponent,
  data: Record<string, any>,
): ResolvedComponent {
  const resolvedProps = { ...(component.props || {}) };
  const resolvedStyle = { ...(component.style || {}) };

  const bindings = component.bindings;
  if (!bindings || Object.keys(bindings).length === 0 || Object.keys(data).length === 0) {
    return { props: resolvedProps, style: resolvedStyle };
  }

  for (const [key, expression] of Object.entries(bindings)) {
    if (typeof expression !== 'string') continue;

    const resolved = resolveString(expression, data);
    // 解析失败（返回原始表达式字符串）时跳过覆盖
    if (resolved === expression && expression.includes('${')) continue;

    if (PROPS_KEYS.has(key)) {
      resolvedProps[key] = resolved;
    } else {
      resolvedStyle[key] = resolved;
    }
  }

  return { props: resolvedProps, style: resolvedStyle };
}
