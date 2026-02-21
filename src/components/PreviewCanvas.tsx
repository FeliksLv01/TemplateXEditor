import { Empty, Typography, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import useEditorStore from '@/store/editorStore';
import { ComponentRenderer } from './ComponentRenderer';
import { findPathById } from '@/utils/treeHelper';
import { getComponentDefinition } from '@/config/componentRegistry';

const { Title } = Typography;

export const PreviewCanvas = () => {
  const { rootComponent, selectedComponentId, selectComponent } = useEditorStore();

  const selectedPath = useMemo(() => {
    if (!rootComponent || !selectedComponentId) return [];
    const pathIds = findPathById(rootComponent, selectedComponentId);
    return pathIds.map((id) => {
      const component = id === rootComponent.id ? rootComponent : null;
      if (component) {
        const def = getComponentDefinition(component.type);
        return def?.name || component.type;
      }
      return id;
    });
  }, [rootComponent, selectedComponentId]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  if (!rootComponent) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Empty description="暂无组件，请从左侧面板添加" />
      </div>
    );
  }

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}
    >
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          预览
        </Title>
      </div>
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <Breadcrumb
          items={[
            { key: 'home', title: <HomeOutlined /> },
            ...selectedPath.map((item, index) => ({ title: item, key: `path-${index}` })),
          ]}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
        }}
        onClick={handleCanvasClick}
      >
        <div
          style={{
            minWidth: 320,
            maxWidth: '100%',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <ComponentRenderer component={rootComponent} selectedId={selectedComponentId} onSelect={selectComponent} />
        </div>
      </div>
    </div>
  );
};

export default PreviewCanvas;
