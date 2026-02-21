import { useProBuilderStore } from '@ant-design/pro-editor';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

export const ButtonComponent = memo(() => {
  const data = useProBuilderStore((s) => s.config, isEqual);
  const style = data.style || {};
  const props = data.props || {};
  
  return (
    <button 
      className="templatex-button"
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        padding: '0 20px',
        userSelect: 'none',
      }}
    >
      {props.title || 'Button'}
    </button>
  );
});
