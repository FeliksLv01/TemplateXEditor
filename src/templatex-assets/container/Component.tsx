import { useProBuilderStore } from '@ant-design/pro-editor';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

export const ContainerComponent = memo(() => {
  const data = useProBuilderStore((s) => s.config, isEqual);
  const style = data.style || {};
  
  return (
    <div 
      className="templatex-container" 
      style={{
        ...style,
        position: 'relative',
        minHeight: 60,
      }}
    >
      <div 
        className="dropzone" 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        拖拽子组件到这里
      </div>
    </div>
  );
});
