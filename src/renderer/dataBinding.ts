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
 * 解析值中的 ${} 内联表达式
 * 只处理字符串类型，且包含 ${ 的值
 */
function resolveInlineExpressions(
  obj: Record<string, any>,
  data: Record<string, any>,
): Record<string, any> {
  const result = { ...obj };
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && value.includes('${')) {
      const resolved = resolveString(value, data);
      // 解析成功才覆盖（不等于原始表达式字符串）
      if (resolved !== value) {
        result[key] = resolved;
      }
    }
  }
  return result;
}

/**
 * 解析组件的数据绑定
 *
 * 流程：
 * 1. 以 component.props 和 component.style 为基础
 * 2. 扫描 props/style 值中的 ${} 内联表达式，用 mockData 求值（兼容 iOS 写法）
 * 3. 遍历 component.bindings，对每个 key 用 mockData 求值（编辑器标准写法）
 * 4. bindings 的优先级高于内联表达式
 * 5. 返回解析后的 props 和 style（不修改原组件树）
 */
export function resolveBindings(
  component: DSLComponent,
  data: Record<string, any>,
): ResolvedComponent {
  const hasData = Object.keys(data).length > 0;

  // 先解析 props/style 中的内联 ${} 表达式
  let resolvedProps = { ...(component.props || {}) };
  let resolvedStyle = { ...(component.style || {}) };

  if (hasData) {
    resolvedProps = resolveInlineExpressions(resolvedProps, data);
    resolvedStyle = resolveInlineExpressions(resolvedStyle, data);
  }

  // 再用 bindings 覆盖（优先级更高）
  const bindings = component.bindings;
  if (!bindings || Object.keys(bindings).length === 0 || !hasData) {
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
