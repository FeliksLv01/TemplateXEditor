import { Empty, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import useEditorStore from '@/store/editorStore';
import { ComponentRenderer } from './ComponentRenderer';
import { findPathById } from '@/utils/treeHelper';
import { getComponentDefinition } from '@/config/componentRegistry';
import { Toolbar } from './Toolbar';

export const PreviewCanvas = () => {
  const { rootComponent, selectedComponentId, selectComponent, mockData } = useEditorStore();

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
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div className="canvas-topbar">
          <div />
          <Toolbar />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="暂无组件，请从左侧面板添加" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}
    >
      <div className="canvas-topbar">
        <Breadcrumb
          items={[
            { key: 'home', title: <HomeOutlined /> },
            ...selectedPath.map((item, index) => ({ title: item, key: `path-${index}` })),
          ]}
        />
        <Toolbar />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
        }}
        onClick={handleCanvasClick}
      >
        <ComponentRenderer component={rootComponent} selectedId={selectedComponentId} onSelect={selectComponent} mockData={mockData} />
      </div>
    </div>
  );
};

export default PreviewCanvas;
