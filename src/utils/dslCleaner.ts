import type { DSLComponent } from '@/types/editor';

/**
 * RGB 转 Hex
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * RGBA 转 Hex (带透明度)
 */
const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
  if (a === 1) {
    return rgbToHex(r, g, b);
  }
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  const alphaHex = toHex(Math.round(a * 255));
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toUpperCase();
};

/**
 * 清理颜色值，将 antd ColorPicker 的对象格式转换为 #hex 字符串
 */
export const cleanColorValue = (value: any): any => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // antd ColorPicker 清除状态
    if ('cleared' in value && value.cleared === true) return undefined;
    
    // antd ColorPicker 返回的 Color 对象有 toHexString 方法
    if ('toHexString' in value && typeof value.toHexString === 'function') {
      return value.toHexString().toUpperCase();
    }
    
    // antd ColorPicker 返回的对象可能有 metaColor 属性
    if ('metaColor' in value && value.metaColor) {
      const meta = value.metaColor;
      if ('toHexString' in meta && typeof meta.toHexString === 'function') {
        return meta.toHexString().toUpperCase();
      }
      if ('r' in meta && 'g' in meta && 'b' in meta) {
        const r = Number(meta.r);
        const g = Number(meta.g);
        const b = Number(meta.b);
        const a = meta.a !== undefined ? Number(meta.a) : 1;
        return rgbaToHex(r, g, b, a);
      }
    }
    
    // 直接的 rgb 对象
    if ('r' in value && 'g' in value && 'b' in value) {
      const r = Number(value.r);
      const g = Number(value.g);
      const b = Number(value.b);
      const a = value.a !== undefined ? Number(value.a) : 1;
      return rgbaToHex(r, g, b, a);
    }
    
    if ('hex' in value && typeof value.hex === 'string') {
      return value.hex.toUpperCase();
    }
  }
  return value;
};

/**
 * 颜色相关的属性名
 */
const COLOR_PROPERTIES = ['backgroundColor', 'textColor', 'borderColor', 'color'];

/**
 * 清理对象中的颜色属性
 */
const cleanObjectColors = (obj: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (COLOR_PROPERTIES.includes(key)) {
      const cleanedValue = cleanColorValue(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    } else if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

/**
 * 递归清理整个组件树中的颜色值
 */
export const cleanComponentForExport = (component: DSLComponent): DSLComponent => {
  const cleaned: DSLComponent = {
    id: component.id,
    type: component.type,
    props: cleanObjectColors(component.props || {}),
    style: cleanObjectColors(component.style || {}),
  };

  if (component.children && component.children.length > 0) {
    cleaned.children = component.children.map(cleanComponentForExport);
  }

  return cleaned;
};
