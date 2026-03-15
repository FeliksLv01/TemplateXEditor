import React from 'react';
import type { TXComponentProps } from '../types';
import { mapStyle } from '../styleMapper';

export const TXContainer: React.FC<TXComponentProps> = ({
  component,
  resolvedStyle,
  context,
  children,
}) => {
  const isSelected = context.selectedId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.onSelect?.(component.id);
  };

  return (
    <div
      className="dsl-container"
      style={{
        ...mapStyle(resolvedStyle),
        outline: isSelected ? '2px solid #1890FF' : 'none',
        outlineOffset: '-2px',
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
