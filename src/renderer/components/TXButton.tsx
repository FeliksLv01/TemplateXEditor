import React from 'react';
import type { TXComponentProps } from '../types';
import { mapStyle } from '../styleMapper';

export const TXButton: React.FC<TXComponentProps> = ({
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
    <button
      className="dsl-button"
      style={{
        ...mapStyle(resolvedStyle),
        outline: isSelected ? '2px solid #1890FF' : 'none',
        outlineOffset: '-2px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {resolvedProps.title || 'Button'}
    </button>
  );
};
