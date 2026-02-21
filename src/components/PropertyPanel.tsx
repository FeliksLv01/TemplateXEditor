import { Empty, Form, Input, InputNumber, Select, ColorPicker, Switch, Radio, Collapse, Space } from 'antd';
import { Typography, Divider } from 'antd';
import type { CollapseProps } from 'antd';
import { useMemo, useEffect } from 'react';
import useEditorStore from '@/store/editorStore';
import { getComponentDefinition } from '@/config/componentRegistry';

const { Title } = Typography;

type SizeValue = {
  type: 'percent' | 'auto' | 'fixed';
  value: number | string;
};

interface SizeInputProps {
  name: string;
  label: string;
  value: SizeValue | any;
  onChange: (value: SizeValue) => void;
}

const SizeInput = ({ name, label, value, onChange }: SizeInputProps) => {
  const sizeType = (value && typeof value === 'object' && 'type' in value) ? value.type : 'fixed';
  const sizeValue = (value && typeof value === 'object') ? value.value : value;

  const handleTypeChange = (type: 'percent' | 'auto' | 'fixed') => {
    if (type === 'auto') {
      onChange({ type, value: 'auto' });
    } else if (type === 'percent') {
      onChange({ type, value: 100 });
    } else {
      onChange({ type, value: 100 });
    }
  };

  const handleValueChange = (newValue: number | null) => {
    if (newValue == null) return;
    onChange({ type: sizeType as 'fixed' | 'percent', value: newValue });
  };

  return (
    <Form.Item label={label} style={{ marginBottom: 0 }}>
      <Space.Compact style={{ width: '100%' }}>
        <Select
          value={sizeType}
          onChange={handleTypeChange}
          style={{ width: 100 }}
        >
          <Select.Option value="percent">百分比 %</Select.Option>
          <Select.Option value="auto">自适应</Select.Option>
          <Select.Option value="fixed">固定值 px</Select.Option>
        </Select>
        {sizeType === 'auto' ? (
          <Input
            disabled
            value="auto"
            placeholder="自适应"
            style={{ flex: 1 }}
          />
        ) : (
          <InputNumber
            value={typeof sizeValue === 'number' ? sizeValue : undefined}
            onChange={handleValueChange}
            disabled={sizeType === 'auto'}
            style={{ flex: 1 }}
            min={0}
          />
        )}
      </Space.Compact>
    </Form.Item>
  );
};

const convertSizeValue = (value: any): SizeValue | string => {
  if (value === 'auto' || value === '100%') {
    return { type: value === 'auto' ? 'auto' : 'percent', value: 100 };
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    const numValue = parseFloat(value);
    return { type: 'percent', value: isNaN(numValue) ? 100 : numValue };
  }
  if (typeof value === 'number') {
    return { type: 'fixed', value };
  }
  return value;
};

const getSizeActualValue = (value: any): string => {
  if (value === 'auto') return 'auto';
  if (value === '100%' || (typeof value === 'string' && value.endsWith('%'))) return value;
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') return value;
  return String(value);
};

export const PropertyPanel = () => {
  const { rootComponent, selectedComponentId, updateComponent } = useEditorStore();
  const [form] = Form.useForm();

  const component = useMemo(() => {
    if (!rootComponent || !selectedComponentId) return null;

    const findComponent = (targetComponent: any, id: string): any => {
      if (targetComponent.id === id) return targetComponent;
      if (targetComponent.children) {
        for (const child of targetComponent.children) {
          const found = findComponent(child, id);
          if (found) return found;
        }
      }
      return null;
    };

    return findComponent(rootComponent, selectedComponentId);
  }, [rootComponent, selectedComponentId]);

  useEffect(() => {
    if (component) {
      form.setFieldsValue({
        ...component.props,
        ...component.style,
      });
    } else {
      form.resetFields();
    }
  }, [component, form]);

  // 统一的颜色/ColorPicker 清理转换函数
  const cleanColorValue = (value: any): any => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if ('cleared' in value && value.cleared === true) return undefined;
      // Antd ColorPicker 可能返回 { r,g,b,a } 或者 { hex, ... }
      if ('r' in value && 'g' in value && 'b' in value) {
        const r = Number(value.r);
        const g = Number(value.g);
        const b = Number(value.b);
        const a = value.a !== undefined ? Number(value.a) : 1;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      if ('hex' in value && typeof value.hex === 'string') {
        return value.hex;
      }
    }
    return value;
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (!selectedComponentId) return;

    const props: Record<string, any> = {};
    const style: Record<string, any> = {};

    Object.keys(changedValues).forEach((key) => {
      const value = changedValues[key];

      // 跳过清除操作（ColorPicker 清除）
      if (value && typeof value === 'object' && 'cleared' in value && value.cleared === true) {
        // 将对应字段置为 undefined（或跳过，根据需求）
        const cleaned = cleanColorValue(value);
        if (['text', 'title', 'src', 'items'].includes(key)) {
          props[key] = cleaned;
        } else {
          style[key] = cleaned;
        }
        return;
      }

      const cleanedValue = cleanColorValue(value);
      if (['text', 'title', 'src', 'items'].includes(key)) {
        props[key] = cleanedValue;
      } else {
        style[key] = cleanedValue;
      }
    });

    updateComponent(selectedComponentId, { props, style });
  };

  if (!component) {
    return (
      <div style={{ height: '100%', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="请选择一个组件" />
      </div>
    );
  }

  const componentDef = getComponentDefinition(component.type);

  const getCollapseItems = (): CollapseProps['items'] => {
    const items: CollapseProps['items'] = [];

    switch (component.type) {
      case 'container':
        items.push(
          { key: 'layout', label: '布局', children: (
            <>
              <Form.Item name="flexDirection" label="Flex 方向">
                <Radio.Group>
                  <Radio.Button value="row">横向</Radio.Button>
                  <Radio.Button value="column">纵向</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="justifyContent" label="主轴对齐">
                <Select>
                  <Select.Option value="flex-start">起始</Select.Option>
                  <Select.Option value="flex-end">结束</Select.Option>
                  <Select.Option value="center">居中</Select.Option>
                  <Select.Option value="space-between">两端对齐</Select.Option>
                  <Select.Option value="space-around">分散对齐</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="alignItems" label="交叉轴对齐">
                <Select>
                  <Select.Option value="flex-start">起始</Select.Option>
                  <Select.Option value="flex-end">结束</Select.Option>
                  <Select.Option value="center">居中</Select.Option>
                  <Select.Option value="stretch">拉伸</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="flexWrap" label="换行">
                <Radio.Group>
                  <Radio.Button value="nowrap">不换行</Radio.Button>
                  <Radio.Button value="wrap">换行</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </>
          )},
          { key: 'spacing', label: '间距', children: (
            <>
              <Form.Item name="padding" label="内边距">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="margin" label="外边距">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </>
          )},
        );
        break;

      case 'text':
        items.push(
          { key: 'text', label: '文本', children: (
            <>
              <Form.Item name="text" label="文本内容">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item name="fontSize" label="字体大小">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="fontWeight" label="字重">
                <Select>
                  <Select.Option value="normal">normal</Select.Option>
                  <Select.Option value="bold">bold</Select.Option>
                  <Select.Option value="400">400</Select.Option>
                  <Select.Option value="500">500</Select.Option>
                  <Select.Option value="600">600</Select.Option>
                  <Select.Option value="700">700</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="textColor" label="文本颜色">
                <ColorPicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="textAlign" label="对齐方式">
                <Radio.Group>
                  <Radio.Button value="left">左对齐</Radio.Button>
                  <Radio.Button value="center">居中</Radio.Button>
                  <Radio.Button value="right">右对齐</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="lineHeight" label="行高">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </>
          )},
        );
        break;

      case 'image':
        items.push(
          { key: 'image', label: '图片', children: (
            <>
              <Form.Item name="src" label="图片地址">
                <Input />
              </Form.Item>
            </>
          )},
          { key: 'size', label: '尺寸', children: (
            <>
              <Form.Item name="width" label="宽度">
                <Input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="height" label="高度">
                <Input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="cornerRadius" label="圆角">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </>
          )},
        );
        break;

      case 'button':
        items.push(
          { key: 'button', label: '按钮', children: (
            <>
              <Form.Item name="title" label="按钮文本">
                <Input />
              </Form.Item>
            </>
          )},
             { key: 'style', label: '样式', children: (
              <>
                <Form.Item name="backgroundColor" label="背景颜色">
                  <ColorPicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="cornerRadius" label="圆角">
                  <InputNumber style={{ width: '100%' }} addonAfter="px" />
                </Form.Item>
                <Form.Item name="textColor" label="文本颜色">
                  <ColorPicker style={{ width: '100%' }} />
                </Form.Item>
              <Form.Item name="cornerRadius" label="圆角">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="textColor" label="文本颜色">
                <ColorPicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="fontWeight" label="字重">
                <Select>
                  <Select.Option value="normal">normal</Select.Option>
                  <Select.Option value="bold">bold</Select.Option>
                  <Select.Option value="400">400</Select.Option>
                  <Select.Option value="500">500</Select.Option>
                  <Select.Option value="600">600</Select.Option>
                  <Select.Option value="700">700</Select.Option>
                </Select>
              </Form.Item>
            </>
          )},
        );
        break;

      case 'list':
        items.push(
          { key: 'list', label: '列表', children: (
            <>
              <Form.Item name="direction" label="滚动方向">
                <Radio.Group>
                  <Radio.Button value="vertical">纵向</Radio.Button>
                  <Radio.Button value="horizontal">横向</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="columns" label="列数">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="rows" label="行数">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="rowSpacing" label="行间距">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="columnSpacing" label="列间距">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="showsIndicator" label="显示滚动条" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="bounces" label="弹性效果" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isPagingEnabled" label="分页滚动" valuePropName="checked">
                <Switch />
              </Form.Item>
            </>
          )},
          { key: 'size', label: '尺寸', children: (
            <>
              <Form.Item name="itemWidth" label="Item 宽度">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="itemHeight" label="Item 高度">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="width" label="宽度">
                <Input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="height" label="高度">
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </>
          )},
        );
        break;
    }

    items.push(
      { key: 'common', label: '通用', children: (
        <>
          <Form.Item name="width" label="宽度">
            <Input style={{ width: '100%' }} placeholder="例如: 100, 100%, auto" />
          </Form.Item>
          <Form.Item name="height" label="高度">
            <Input style={{ width: '100%' }} />
          </Form.Item>
               <Form.Item name="backgroundColor" label="背景颜色">
                <ColorPicker style={{ width: '100%' }} />
              </Form.Item>
          <Form.Item name="opacity" label="透明度">
            <InputNumber style={{ width: '100%' }} min={0} max={1} step={0.01} />
          </Form.Item>
        </>
      )},
    );

    return items;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={5} style={{ padding: '16px 16px 12px', margin: 0 }}>
        属性面板
      </Title>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {!component ? (
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Empty description="请选择一个组件" />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>{componentDef?.name}</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                ID: {component.id}
              </Typography.Text>
            </div>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleValuesChange}
            >
              <Collapse items={getCollapseItems()} defaultActiveKey={['layout', 'text', 'style']} ghost />
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;