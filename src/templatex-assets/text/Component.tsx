import { useProBuilderStore } from '@ant-design/pro-editor';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

export const TextComponent = memo(() => {
  const data = useProBuilderStore((s) => s.config, isEqual);
  const style = data.style || {};
  const props = data.props || {};
  
  return (
    <div 
      className="templatex-text" 
      style={style}
    >
      {props.text || '文本内容'}
    </div>
  );
});
