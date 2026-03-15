/**
 * 轻量表达式解析器
 *
 * 支持：
 * 1. 路径取值：${item.title}  ${user.profile.name}
 * 2. 数组索引：${items[0].name}
 * 3. 简单三元：${item.isVip ? '#FF0000' : '#333'}
 * 4. 数学运算：${price * 100}
 * 5. 混合文本："Hello ${user.name}, age ${user.age}"
 *
 * 不支持（也不需要）：
 * - 内置函数调用（formatPrice 等，那是 iOS 端的事）
 * - 复杂嵌套表达式
 *
 * 实现策略：简单路径用手动取值，复杂表达式用 new Function() fallback。
 */

const EXPR_PATTERN = /\$\{([^}]+)\}/g;

/**
 * 从 data 中按路径取值
 * 支持 "a.b.c" 和 "a[0].b" 格式
 */
function getByPath(data: Record<string, any>, path: string): any {
  // 将 arr[0] 转换为 arr.0 以统一处理
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
  const keys = normalizedPath.split('.');

  let current: any = data;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
}

/**
 * 判断是否为简单路径表达式（只包含字母、数字、点、下划线、中括号）
 */
function isSimplePath(expr: string): boolean {
  return /^[a-zA-Z_$][\w$.[\]]*$/.test(expr.trim());
}

/**
 * 用 new Function 求值复杂表达式（三元、算术等）
 * 将 data 的顶层 key 作为局部变量注入
 */
function evalExpression(expr: string, data: Record<string, any>): any {
  try {
    const keys = Object.keys(data);
    const values = keys.map((k) => data[k]);
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `return (${expr});`);
    return fn(...values);
  } catch {
    return undefined;
  }
}

/**
 * 解析单个 ${...} 内的表达式
 */
function resolveExpression(expr: string, data: Record<string, any>): any {
  const trimmed = expr.trim();

  // 简单路径：直接取值，性能最好
  if (isSimplePath(trimmed)) {
    return getByPath(data, trimmed);
  }

  // 复杂表达式：fallback 到 new Function
  return evalExpression(trimmed, data);
}

/**
 * 解析一个可能包含 ${} 的字符串
 *
 * - 整个字符串就是一个 ${expr}：返回原始类型（number/boolean/object 等）
 * - 字符串中包含多个 ${expr} 或有混合文本：返回拼接后的字符串
 * - 不包含 ${}: 原样返回
 */
export function resolveString(template: string, data: Record<string, any>): any {
  if (!template || typeof template !== 'string') return template;

  // 快速检查：不包含 ${ 直接返回
  if (!template.includes('${')) return template;

  // 整个字符串是单个表达式：保留原始类型
  const fullMatch = template.match(/^\$\{([^}]+)\}$/);
  if (fullMatch) {
    const result = resolveExpression(fullMatch[1], data);
    return result !== undefined ? result : template;
  }

  // 混合文本：替换所有 ${} 为字符串
  const resolved = template.replace(EXPR_PATTERN, (_match, expr) => {
    const result = resolveExpression(expr, data);
    return result !== undefined ? String(result) : _match;
  });

  return resolved;
}

/**
 * 递归解析对象/数组中所有字符串值的 ${} 表达式
 */
export function resolveDeep(value: any, data: Record<string, any>): any {
  if (typeof value === 'string') {
    return resolveString(value, data);
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveDeep(item, data));
  }
  if (value && typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = resolveDeep(v, data);
    }
    return result;
  }
  return value;
}
