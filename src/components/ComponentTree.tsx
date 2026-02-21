import { Tree, Typography, Empty, Dropdown, Menu } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { useMemo, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import useEditorStore from '@/store/editorStore';
import { convertToTreeData } from '@/utils/treeHelper';
import { getComponentDefinition } from '@/config/componentRegistry';
import type { DataNode } from 'antd/es/tree';

const { Title } = Typography;

const DroppableWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'tree-root',
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        height: '100%',
        backgroundColor: isOver ? '#e6f7ff' : undefined,
        transition: 'background-color 0.2s',
      }}
    >
      {children}
    </div>
  );
};

export const ComponentTree = () => {
  const { rootComponent, selectedComponentId, expandedKeys, selectComponent, removeComponent, copyComponent, pasteComponent, duplicateComponent, setExpandedKeys } = useEditorStore();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuComponentId, setContextMenuComponentId] = useState<string | null>(null);

  useEffect(() => {
    if (rootComponent) {
      setTreeData([convertToTreeData(rootComponent)]);
    } else {
      setTreeData([]);
    }
  }, [rootComponent]);

  const handleContextMenu = (e: any, node: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuComponentId(node.data.id);
  };

  const handleContextMenuClose = () => {
    setContextMenuPosition(null);
    setContextMenuComponentId(null);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (!contextMenuComponentId) return;
    
    switch (key) {
      case 'copy':
        copyComponent(contextMenuComponentId);
        break;
      case 'paste':
        const parent = useEditorStore.getState().rootComponent;
        if (parent) {
          pasteComponent(contextMenuComponentId);
        }
        break;
      case 'duplicate':
        duplicateComponent(contextMenuComponentId);
        break;
      case 'delete':
        removeComponent(contextMenuComponentId);
        break;
    }
    handleContextMenuClose();
  };

  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys as string[]);
  };

  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      selectComponent(selectedKeys[0] as string);
    } else {
      selectComponent(null);
    }
  };

  const contextMenu = contextMenuPosition ? (
    <Dropdown
      open={!!contextMenuPosition}
      onOpenChange={handleContextMenuClose}
      placement="bottomLeft"
      trigger={['contextMenu']}
    >
      <Menu
        style={{
          position: 'fixed',
          left: contextMenuPosition.x,
          top: contextMenuPosition.y,
        }}
        onClick={handleMenuClick}
        items={[
          { key: 'copy', label: '复制' },
          { key: 'paste', label: '粘贴' },
          { key: 'duplicate', label: '复制并添加' },
          { type: 'divider' },
          { key: 'delete', label: '删除', danger: true },
        ]}
      />
    </Dropdown>
  ) : null;

  if (!rootComponent) {
    return (
      <div style={{ height: '100%', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="从左侧拖拽组件到此处" />
      </div>
    );
  }

  return (
    <DroppableWrapper>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Title level={5} style={{ padding: '16px 16px 12px', margin: 0 }}>
          组件树
        </Title>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
          <Tree
            showIcon
            defaultExpandAll
            expandedKeys={expandedKeys}
            selectedKeys={selectedComponentId ? [selectedComponentId] : []}
            onSelect={onSelect}
            onExpand={onExpand}
            onRightClick={handleContextMenu}
            treeData={treeData}
            icon={({ data }) => {
              const def = getComponentDefinition(data.type);
              const canHaveChildren = def?.canHaveChildren;
              return canHaveChildren ? <FolderOutlined /> : <FileOutlined />;
            }}
          />
        </div>
        {contextMenu}
      </div>
    </DroppableWrapper>
  );
};

export default ComponentTree;
