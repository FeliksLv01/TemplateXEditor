import React from 'react';
import type { TXComponentProps } from '../types';
import { mapStyle } from '../styleMapper';

export const TXList: React.FC<TXComponentProps> = ({
  component,
  resolvedProps,
  resolvedStyle,
  context,
}) => {
  const isSelected = context.selectedId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.onSelect?.(component.id);
  };

  return (
    <div
      className="dsl-list"
      style={{
        ...mapStyle(resolvedStyle),
        outline: isSelected ? '2px solid #1890FF' : 'none',
        outlineOffset: '-2px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div style={{ padding: '20px', color: '#999', textAlign: 'center', width: '100%' }}>
        List Component
        <br />
        <small>{resolvedProps.direction === 'horizontal' ? '横向' : '纵向'}列表</small>
      </div>
    </div>
  );
};
