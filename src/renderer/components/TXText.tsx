import React from 'react';
import type { TXComponentProps } from '../types';
import { mapStyle } from '../styleMapper';

export const TXText: React.FC<TXComponentProps> = ({
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
      className="dsl-text"
      style={{
        ...mapStyle(resolvedStyle),
        outline: isSelected ? '2px solid #1890FF' : 'none',
        outlineOffset: '-2px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {resolvedProps.text || ''}
    </div>
  );
};
