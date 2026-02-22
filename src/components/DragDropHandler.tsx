import { DndContext, DragOverlay, closestCenter, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { message } from 'antd';
import useEditorStore from '@/store/editorStore';
import { COMPONENT_DEFINITIONS, getComponentDefinition } from '@/config/componentRegistry';
import { generateId } from '@/utils/idGenerator';

export const DragDropHandler = ({ children }: { children: React.ReactNode }) => {
  const { addComponent, rootComponent } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedComponentType, setDraggedComponentType] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    if (typeof active.id === 'string' && COMPONENT_DEFINITIONS.some(def => def.type === active.id)) {
      setDraggedComponentType(active.id);
    } else {
      setDraggedComponentType(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedComponentType(null);

    if (!over || !active) return;

    const overId = over.id as string;

    if (draggedComponentType && COMPONENT_DEFINITIONS.some(def => def.type === draggedComponentType)) {
      const componentDef = COMPONENT_DEFINITIONS.find(def => def.type === draggedComponentType);
      if (!componentDef) return;

      // defaultConfig 现在包含 { props, style } 结构
      const defaultConfig = componentDef.defaultConfig as { props?: Record<string, any>; style?: Record<string, any> };
      
      const newComponent = {
        id: generateId(draggedComponentType),
        type: draggedComponentType,
        props: { ...defaultConfig.props },
        style: { ...defaultConfig.style },
        children: componentDef.canHaveChildren ? [] : undefined,
      };

      // 当拖拽到 tree-root 时
      if (overId === 'tree-root') {
        if (!rootComponent) {
          // 没有根组件，创建新的根组件
          addComponent(null, newComponent);
        } else {
          // 已有根组件，检查是否是容器
          const rootDef = getComponentDefinition(rootComponent.type);
          if (rootDef?.canHaveChildren) {
            // 根组件是容器，添加到根组件中
            addComponent(rootComponent.id, newComponent);
          } else {
            // 根组件不是容器，给出提示
            message.warning('当前根组件不是容器，请先删除后再添加新组件，或先添加一个容器作为根组件');
          }
        }
      } else {
        // 拖拽到具体的组件上
        addComponent(overId, newComponent);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay
        dropAnimation={{
          duration: 0,
        }}
      >
        {activeId && draggedComponentType ? (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#1890FF',
            color: '#fff',
            borderRadius: 4,
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}>
            {COMPONENT_DEFINITIONS.find(def => def.type === draggedComponentType)?.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropHandler;
