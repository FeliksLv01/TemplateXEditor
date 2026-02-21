import { useProBuilderStore } from '@ant-design/pro-editor';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

export const ImageComponent = memo(() => {
  const data = useProBuilderStore((s) => s.config, isEqual);
  const style = data.style || {};
  const props = data.props || {};
  
  return (
    <img 
      className="templatex-image" 
      src={props.src || 'https://via.placeholder.com/150'} 
      style={style}
      alt=""
    />
  );
});
