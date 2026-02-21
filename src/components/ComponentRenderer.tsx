import React, { useCallback } from 'react';
import type { DSLComponent } from '@/types/dsl';

interface ComponentRendererProps {
  component: DSLComponent;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, selectedId, onSelect }) => {
  const isSelected = selectedId === component.id;

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(component.id);
    }
  }, [component.id, onSelect]);
  const renderContainer = () => {
    return (
      <div
        className="dsl-container"
        style={{
          ...mapStyle(component.style),
          outline: isSelected ? '2px solid #1890FF' : 'none',
          outlineOffset: '-2px',
        }}
        onClick={handleClick}
      >
        {component.children && component.children.length > 0 ? (
          component.children.map((child, index) => (
            <ComponentRenderer
              key={`${child.id}-${index}`}
              component={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        ) : null}
      </div>
    );
  };
  
  const renderText = () => {
    return (
      <div
        className="dsl-text"
        style={{
          ...mapStyle(component.style),
          outline: isSelected ? '2px solid #1890FF' : 'none',
          outlineOffset: '-2px',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        {component.props.text || ''}
      </div>
    );
  };
  
  const renderImage = () => {
    return (
      <img
        className="dsl-image"
        src={component.props.src || ''}
        alt="DSL Image"
        style={{
          ...mapStyle(component.style),
          outline: isSelected ? '2px solid #1890FF' : 'none',
          outlineOffset: '-2px',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      />
    );
  };
  
  const renderButton = () => {
    return (
      <button
        className="dsl-button"
        style={{
          ...mapStyle(component.style),
          outline: isSelected ? '2px solid #1890FF' : 'none',
          outlineOffset: '-2px',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        {component.props.title || 'Button'}
      </button>
    );
  };
  
  const renderList = () => {
    return (
      <div
        className="dsl-list"
        style={{
          ...mapStyle(component.style),
          outline: isSelected ? '2px solid #1890FF' : 'none',
          outlineOffset: '-2px',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <div style={{ padding: '20px', color: '#999', textAlign: 'center', width: '100%' }}>
          List Component
          <br />
          <small>{component.style.direction === 'vertical' ? '纵向' : '横向'}列表</small>
        </div>
      </div>
    );
  };
  
  const mapColor = (value: any): string => {
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
  };

  const mapStyle = (style: any) => {
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
        case 'height':
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
        case 'cornerRadius':
        case 'borderWidth':
        case 'shadowRadius':
          if (typeof value === 'number') {
            mapped[key] = `${value}px`;
          } else if (typeof value === 'string') {
            if (value === 'auto' || value === '100%' || value.endsWith('%') || value.endsWith('px') || value.endsWith('vw') || value.endsWith('vh')) {
              mapped[key] = value;
            } else {
              mapped[key] = `${value}px`;
            }
          }
          break;
        case 'backgroundColor':
          mapped.backgroundColor = value;
          break;
        case 'borderColor':
          mapped.borderColor = value;
          break;
        case 'textColor':
        case 'color':
          mapped.color = value;
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
          mapped.lineHeight = typeof value === 'number' ? value : value;
          break;
        case 'objectFit':
          mapped.objectFit = value;
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
          mapped[key] = value;
      }
    });
    
    return mapped;
  };
  
  const renderComponent = () => {
    switch (component.type) {
      case 'container':
        return renderContainer();
      case 'text':
        return renderText();
      case 'image':
        return renderImage();
      case 'button':
        return renderButton();
      case 'list':
        return renderList();
      default:
        return <div>Unknown component type: {component.type}</div>;
    }
  };
  
  return renderComponent();
};
