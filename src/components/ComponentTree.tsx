import { Tree, Typography, Empty, Menu, message } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import useEditorStore from '@/store/editorStore';
import { convertToTreeData, findComponentById, findParentById } from '@/utils/treeHelper';
import { getComponentDefinition } from '@/config/componentRegistry';
import type { DataNode, TreeProps } from 'antd/es/tree';

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
  const { rootComponent, selectedComponentId, expandedKeys, selectComponent, removeComponent, copyComponent, pasteComponent, duplicateComponent, setExpandedKeys, moveComponent } = useEditorStore();
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

  const handleContextMenu = ({ event, node }: { event: React.MouseEvent; node: any }) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuComponentId(node.key as string);
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

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dragKey = info.dragNode.key as string;
    const dropKey = info.node.key as string;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // 不能拖到自己身上
    if (dragKey === dropKey) return;

    // 检查目标是否是容器
    const dropComponent = findComponentById(rootComponent, dropKey);
    if (!dropComponent) return;

    const dropDef = getComponentDefinition(dropComponent.type);
    
    // dropToGap 为 true 表示拖到节点之间（同级排序）
    // dropToGap 为 false 表示拖到节点内部（作为子节点）
    if (info.dropToGap) {
      // 拖到节点之间，需要找到目标节点的父节点
      const dropParent = findParentById(rootComponent, dropKey);
      if (!dropParent) {
        // 目标节点是根节点，不允许在根节点同级排序
        message.warning('无法在根节点同级放置');
        return;
      }
      
      const parentDef = getComponentDefinition(dropParent.type);
      if (!parentDef?.canHaveChildren) {
        message.warning('目标容器不支持子组件');
        return;
      }
      
      // 计算新的索引位置
      const siblings = dropParent.children || [];
      let newIndex = siblings.findIndex(child => child.id === dropKey);
      if (dropPosition === 1) {
        // 放在目标节点后面
        newIndex += 1;
      }
      
      moveComponent(dragKey, dropParent.id, newIndex);
    } else {
      // 拖到节点内部，作为子节点
      if (!dropDef?.canHaveChildren) {
        message.warning('该组件不支持子组件');
        return;
      }
      
      moveComponent(dragKey, dropKey);
      
      // 展开目标节点
      if (!expandedKeys.includes(dropKey)) {
        setExpandedKeys([...expandedKeys, dropKey]);
      }
    }
  };

  const contextMenu = contextMenuPosition ? (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
      onClick={handleContextMenuClose}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenuClose();
      }}
    >
      <Menu
        style={{
          position: 'fixed',
          left: contextMenuPosition.x,
          top: contextMenuPosition.y,
          boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)',
          borderRadius: 8,
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
    </div>
  ) : null;

  if (!rootComponent) {
    return (
      <DroppableWrapper>
        <div style={{ height: '100%', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="从左侧拖拽组件到此处" />
        </div>
      </DroppableWrapper>
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
            draggable
            blockNode
            defaultExpandAll
            expandedKeys={expandedKeys}
            selectedKeys={selectedComponentId ? [selectedComponentId] : []}
            onSelect={onSelect}
            onExpand={onExpand}
            onRightClick={handleContextMenu}
            onDrop={onDrop}
            treeData={treeData}
            icon={(props: any) => {
              const data = props.data;
              const def = getComponentDefinition(data?.type);
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
