import { useDraggable } from '@dnd-kit/core';
import { COMPONENT_DEFINITIONS } from '@/config/componentRegistry';

interface DraggableComponentProps {
  type: string;
  name: string;
  icon: React.ReactNode;
}

const DraggableComponent = ({ type, name, icon }: DraggableComponentProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      className="comp-panel-item"
      style={{ opacity: isDragging ? 0.4 : 1 }}
      {...listeners}
      {...attributes}
    >
      <div className="comp-panel-icon">{icon}</div>
      <div className="comp-panel-name">{name}</div>
    </div>
  );
};

export const ComponentPanel = () => {
  return (
    <div className="comp-panel">
      <div className="comp-panel-brand">
        <div className="comp-panel-logo">T</div>
        <span className="comp-panel-brand-text">TemplateX Editor</span>
      </div>
      <div className="comp-panel-title">组件</div>
      <div className="comp-panel-grid">
        {COMPONENT_DEFINITIONS.map((component) => (
          <DraggableComponent
            key={component.type}
            type={component.type}
            name={component.name}
            icon={component.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ComponentPanel;
