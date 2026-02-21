import { useProBuilderStore } from '@ant-design/pro-editor';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

export const ListComponent = memo(() => {
  const data = useProBuilderStore((s) => s.config, isEqual);
  const style = data.style || {};
  
  return (
    <div
      className="templatex-list"
      style={{
        ...style,
        display: 'flex',
        overflow: style.direction === 'horizontal' ? 'auto' : 'auto',
        gap: style.direction === 'horizontal' ? style.columnSpacing : style.rowSpacing,
        flexWrap: style.direction === 'vertical' && style.columns > 1 ? 'wrap' : 'nowrap',
        flexDirection: style.direction === 'vertical' ? 'column' : 'row',
      }}
    >
      <div style={{ padding: '20px', color: '#999', textAlign: 'center', width: '100%' }}>
        List Component
        <br />
        <small>{style.direction === 'vertical' ? '纵向' : '横向'}列表</small>
      </div>
    </div>
  );
});
