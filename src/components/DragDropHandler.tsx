import { DndContext, DragOverlay, closestCenter, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import useEditorStore from '@/store/editorStore';
import { COMPONENT_DEFINITIONS } from '@/config/componentRegistry';
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

    const activeId = active.id as string;
    const overId = over.id as string;

    if (draggedComponentType && COMPONENT_DEFINITIONS.some(def => def.type === draggedComponentType)) {
      const componentDef = COMPONENT_DEFINITIONS.find(def => def.type === draggedComponentType);
      if (!componentDef) return;

      const newComponent = {
        id: generateId(draggedComponentType),
        type: draggedComponentType,
        props: { ...componentDef.defaultConfig },
        style: { ...componentDef.defaultConfig },
        children: componentDef.canHaveChildren ? [] : undefined,
      };

      addComponent(overId === 'tree-root' ? null : overId, newComponent);
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
