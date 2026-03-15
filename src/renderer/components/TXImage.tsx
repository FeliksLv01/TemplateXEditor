import React from 'react';
import type { TXComponentProps } from '../types';
import { mapStyle } from '../styleMapper';

const contentModeToObjectFit: Record<string, string> = {
  scaleAspectFit: 'contain',
  scaleAspectFill: 'cover',
  scaleToFill: 'fill',
};

export const TXImage: React.FC<TXComponentProps> = ({
  component,
  resolvedProps,
  resolvedStyle,
  context,
}) => {
  const isSelected = context.selectedId === component.id;
  const contentMode = resolvedProps.contentMode || 'scaleAspectFill';
  const objectFit = contentModeToObjectFit[contentMode] || 'cover';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.onSelect?.(component.id);
  };

  return (
    <img
      className="dsl-image"
      src={resolvedProps.src || ''}
      alt="DSL Image"
      style={{
        ...mapStyle(resolvedStyle),
        objectFit: objectFit as React.CSSProperties['objectFit'],
        outline: isSelected ? '2px solid #1890FF' : 'none',
        outlineOffset: '-2px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};
