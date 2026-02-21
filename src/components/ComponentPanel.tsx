import { Card, Col, Row, Typography } from 'antd';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { COMPONENT_DEFINITIONS } from '@/config/componentRegistry';

const { Title } = Typography;

interface DraggableComponentProps {
  type: string;
  name: string;
  icon: React.ReactNode;
}

const DraggableComponent = ({ type, name, icon }: DraggableComponentProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: type,
    data: { type },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        hoverable
        style={{ textAlign: 'center', marginBottom: 12, cursor: 'grab' }}
        styles={{ body: { padding: '16px' } }}
      >
        <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{name}</div>
      </Card>
    </div>
  );
};

export const ComponentPanel = () => {
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        组件面板
      </Title>
      <Row gutter={[12, 12]}>
        {COMPONENT_DEFINITIONS.map((component) => (
          <Col span={12} key={component.type}>
            <DraggableComponent
              type={component.type}
              name={component.name}
              icon={component.icon}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ComponentPanel;
