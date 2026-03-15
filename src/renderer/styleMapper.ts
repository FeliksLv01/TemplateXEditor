/**
 * 样式映射 — DSL style → React CSSProperties
 *
 * 从原 ComponentRenderer.tsx 的 mapStyle / mapColor 抽出，
 * 作为渲染库的公共工具。
 */

/**
 * 将 DSL 颜色值转换为 CSS 颜色字符串
 */
export function mapColor(value: any): string {
  if (!value) return '#000000';
  if (typeof value === 'string') {
    if (value === 'transparent') return 'rgba(0,0,0,0)';
    if (value === 'auto') return '#000000';
    return value;
  }
  if (typeof value === 'object') {
    if (value.toHexString && typeof value.toHexString === 'function') {
      const hex = value.toHexString();
      return hex && hex.startsWith('#') ? hex : `#${hex}`;
    }
    if (value.cleared === true) return '#000000';
    if (value.metaColor && value.metaColor.r !== undefined) {
      const { r, g, b, a } = value.metaColor;
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      if (a !== undefined && a < 1) {
        return `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
      }
      return hex;
    }
    if (value.r !== undefined && value.g !== undefined && value.b !== undefined) {
      const r = value.r.toString(16).padStart(2, '0');
      const g = value.g.toString(16).padStart(2, '0');
      const b = value.b.toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }
  if (typeof value === 'number') {
    return `#${value.toString(16).padStart(6, '0')}`;
  }
  return String(value);
}

/**
 * 将尺寸类值转换为 CSS 值字符串
 */
function mapSizeValue(value: any, allowAuto = true): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') {
    if (allowAuto && value === 'auto') return value;
    if (value === '100%' || value.endsWith('%') || value.endsWith('px') || value.endsWith('vw') || value.endsWith('vh')) {
      return value;
    }
    return `${value}px`;
  }
  return undefined;
}

/**
 * 将 DSL style 映射为 React CSSProperties
 */
export function mapStyle(style: Record<string, any>): React.CSSProperties {
  if (!style) return {};

  const mapped: React.CSSProperties = {};

  Object.keys(style).forEach((key) => {
    const value = style[key];
    if (value === undefined || value === null) return;

    switch (key) {
      case 'flexDirection':
        mapped.display = 'flex';
        mapped.flexDirection = value;
        break;
      case 'justifyContent':
        mapped.justifyContent = value;
        break;
      case 'alignItems':
        mapped.alignItems = value;
        break;
      case 'flexWrap':
        mapped.flexWrap = value;
        break;
      case 'flexGrow':
        mapped.flexGrow = value;
        break;
      case 'flexShrink':
        mapped.flexShrink = value;
        break;
      case 'flexBasis':
        mapped.flexBasis = value;
        break;
      case 'width':
        if (typeof value === 'string' && value === 'auto') {
          mapped.width = 'fit-content';
        } else {
          const w = mapSizeValue(value, false);
          if (w) mapped.width = w;
        }
        break;
      case 'height':
        if (typeof value === 'string' && value === 'auto') {
          mapped.height = 'fit-content';
        } else {
          const h = mapSizeValue(value, false);
          if (h) mapped.height = h;
        }
        break;
      case 'minWidth':
      case 'minHeight':
      case 'maxWidth':
      case 'maxHeight':
      case 'padding':
      case 'paddingTop':
      case 'paddingLeft':
      case 'paddingBottom':
      case 'paddingRight':
      case 'margin':
      case 'marginTop':
      case 'marginLeft':
      case 'marginBottom':
      case 'marginRight':
      case 'fontSize':
      case 'letterSpacing':
      case 'borderWidth': {
        const sv = mapSizeValue(value);
        if (sv) (mapped as Record<string, unknown>)[key] = sv;
        break;
      }
      case 'shadowRadius':
        // handled with shadowColor
        break;
      case 'cornerRadius': {
        const cv = mapSizeValue(value);
        if (cv) mapped.borderRadius = cv;
        break;
      }
      case 'backgroundColor':
        mapped.backgroundColor = mapColor(value);
        break;
      case 'borderColor':
        mapped.borderColor = mapColor(value);
        break;
      case 'textColor':
      case 'color':
        mapped.color = mapColor(value);
        break;
      case 'shadowColor':
        mapped.boxShadow = `${style.shadowOffset?.width || 0}px ${style.shadowOffset?.height || 0}px ${style.shadowRadius || 0}px ${value}`;
        if (style.shadowOpacity !== undefined) {
          mapped.opacity = style.shadowOpacity;
        }
        break;
      case 'opacity':
        mapped.opacity = value;
        break;
      case 'display':
        mapped.display = value;
        break;
      case 'visibility':
        mapped.visibility = value;
        break;
      case 'overflow':
        mapped.overflow = value;
        break;
      case 'fontWeight':
        mapped.fontWeight = value;
        break;
      case 'textAlign':
        mapped.textAlign = value;
        break;
      case 'lineHeight':
        mapped.lineHeight = value;
        break;
      case 'aspectRatio':
        mapped.aspectRatio = value;
        break;
      case 'numberOfLines':
        if (value === 1) {
          mapped.overflow = 'hidden';
          mapped.textOverflow = 'ellipsis';
          mapped.whiteSpace = 'nowrap';
        }
        break;
      default:
        if (key in document.createElement('div').style || ['gap', 'alignContent', 'alignSelf'].includes(key)) {
          (mapped as Record<string, unknown>)[key] = value;
        }
    }
  });

  return mapped;
}
