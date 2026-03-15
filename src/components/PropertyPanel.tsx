import { Empty, Form, Input, InputNumber, Select, ColorPicker, Switch, Collapse, Tooltip, Segmented, Tabs, Alert, Button } from 'antd';
import { Typography, Divider } from 'antd';
import type { CollapseProps } from 'antd';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { JsonEditor } from './JsonEditor';
import {
  ArrowRightOutlined,
  ArrowDownOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  BorderOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import useEditorStore from '@/store/editorStore';
import { getComponentDefinition } from '@/config/componentRegistry';
import { SizeInput, BoxModelInput } from './property-items';
import { cleanColorValue } from '@/utils/dslCleaner';

// Typography sub-components used inline

// ============================================================
// 数据绑定 Tab
// ============================================================
const DataBindingTab: React.FC<{
  component: any;
  selectedComponentId: string;
  updateComponent: (id: string, updates: any) => void;
}> = ({ component, selectedComponentId, updateComponent }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // 组件切换或 bindings 外部变化时，重置编辑器内容
  useEffect(() => {
    const bindings = component.bindings || {};
    setJsonText(JSON.stringify(bindings, null, 2));
    setError(null);
    setIsDirty(false);
  }, [component.id, component.bindings]);

  const handleChange = useCallback((text: string) => {
    setJsonText(text);
    setIsDirty(true);

    // 实时校验 JSON 格式
    if (text.trim() === '' || text.trim() === '{}') {
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('必须是一个 JSON 对象');
        return;
      }
      // 校验每个 value 必须是 string
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value !== 'string') {
          setError(`"${key}" 的值必须是字符串（表达式）`);
          return;
        }
      }
      setError(null);
    } catch {
      setError('JSON 格式错误');
    }
  }, []);

  const handleApply = useCallback(() => {
    if (error) return;
    try {
      const parsed = jsonText.trim() === '' ? {} : JSON.parse(jsonText);
      const bindings = Object.keys(parsed).length > 0 ? parsed : undefined;
      updateComponent(selectedComponentId, { bindings });
      setIsDirty(false);
    } catch {
      setError('JSON 格式错误');
    }
  }, [jsonText, error, selectedComponentId, updateComponent]);

  return (
    <div style={{ padding: '0 16px 16px' }}>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
        将组件的 props 或 style 属性绑定到数据表达式。key 为属性名，value 为 {'${expression}'} 表达式。
      </Typography.Paragraph>
      <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
        示例：{`{ "text": "\${item.title}", "textColor": "\${item.isVip ? '#FF0000' : '#333'}" }`}
      </Typography.Text>
      <JsonEditor
        value={jsonText}
        onChange={handleChange}
        minHeight="200px"
        maxHeight="400px"
        placeholder={'{\n  "text": "${item.title}"\n}'}
      />
      {error && (
        <Alert message={error} type="error" showIcon style={{ marginTop: 8 }} />
      )}
      <Button
        type="primary"
        size="small"
        block
        disabled={!!error || !isDirty}
        onClick={handleApply}
        style={{ marginTop: 8 }}
      >
        应用绑定
      </Button>
    </div>
  );
};

// ============================================================
// 事件 Tab
// ============================================================
const EventTab: React.FC<{
  component: any;
  selectedComponentId: string;
  updateComponent: (id: string, updates: any) => void;
}> = ({ component, selectedComponentId, updateComponent }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const events = component.events || {};
    setJsonText(JSON.stringify(events, null, 2));
    setError(null);
    setIsDirty(false);
  }, [component.id, component.events]);

  const handleChange = useCallback((text: string) => {
    setJsonText(text);
    setIsDirty(true);

    if (text.trim() === '' || text.trim() === '{}') {
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('必须是一个 JSON 对象');
        return;
      }
      setError(null);
    } catch {
      setError('JSON 格式错误');
    }
  }, []);

  const handleApply = useCallback(() => {
    if (error) return;
    try {
      const parsed = jsonText.trim() === '' ? {} : JSON.parse(jsonText);
      const events = Object.keys(parsed).length > 0 ? parsed : undefined;
      updateComponent(selectedComponentId, { events });
      setIsDirty(false);
    } catch {
      setError('JSON 格式错误');
    }
  }, [jsonText, error, selectedComponentId, updateComponent]);

  return (
    <div style={{ padding: '0 16px 16px' }}>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
        配置组件事件。key 为事件名（如 onTap），value 为 URL 字符串或事件配置对象。
      </Typography.Paragraph>
      <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
        简写：{`{ "onTap": "app://detail?id=123" }`}
      </Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
        完整：{`{ "onTap": { "url": "app://follow", "params": { "userId": "\${user.id}" } } }`}
      </Typography.Text>
      <JsonEditor
        value={jsonText}
        onChange={handleChange}
        minHeight="200px"
        maxHeight="400px"
        placeholder={'{\n  "onTap": "app://detail?id=123"\n}'}
      />
      {error && (
        <Alert message={error} type="error" showIcon style={{ marginTop: 8 }} />
      )}
      <Button
        type="primary"
        size="small"
        block
        disabled={!!error || !isDirty}
        onClick={handleApply}
        style={{ marginTop: 8 }}
      >
        应用事件
      </Button>
    </div>
  );
};

// ============================================================
// 属性面板主组件
// ============================================================
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
      form.resetFields();
      
      // 清理颜色值，避免 ColorPicker 崩溃
      const cleanedProps = { ...component.props };
      const cleanedStyle = { ...component.style };
      
      const colorKeys = ['backgroundColor', 'textColor', 'borderColor', 'color'];
      colorKeys.forEach((key) => {
        if (cleanedProps[key]) {
          cleanedProps[key] = cleanColorValue(cleanedProps[key]);
        }
        if (cleanedStyle[key]) {
          cleanedStyle[key] = cleanColorValue(cleanedStyle[key]);
        }
      });
      
      form.setFieldsValue({
        ...cleanedProps,
        ...cleanedStyle,
      });
    }
  }, [component, form]);

  // Props 属性列表 - 这些属性存储在 props 中，其他的存储在 style 中
  const PROPS_KEYS = [
    // 通用
    'text', 'title', 'src', 'contentMode', 'items',
    // List 特有
    'direction', 'columns', 'rows', 'rowSpacing', 'columnSpacing',
    'showsIndicator', 'bounces', 'isPagingEnabled',
    'itemWidth', 'itemHeight', 'estimatedItemHeight', 'autoAdjustHeight',
  ];

  const handleValuesChange = (changedValues: any) => {
    if (!selectedComponentId) return;

    const props: Record<string, any> = {};
    const style: Record<string, any> = {};

    Object.keys(changedValues).forEach((key) => {
      const value = changedValues[key];
      const cleanedValue = cleanColorValue(value);
      
      if (PROPS_KEYS.includes(key)) {
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

  // 尺寸面板
  const sizePanel = {
    key: 'size',
    label: '尺寸',
    children: (
      <>
        <Form.Item name="width" label="宽度" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
        <Form.Item name="height" label="高度" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
        <Form.Item name="minWidth" label="最小宽度" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
        <Form.Item name="minHeight" label="最小高度" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
        <Form.Item name="maxWidth" label="最大宽度" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
        <Form.Item name="maxHeight" label="最大高度" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
      </>
    ),
  };

  // Flexbox 布局面板
  const flexboxPanel = {
    key: 'flexbox',
    label: 'Flexbox 布局',
    children: (
      <>
        <Form.Item name="flexDirection" label="方向" style={{ marginBottom: 12 }}>
          <Segmented
            block
            options={[
              { label: <Tooltip title="横向"><ArrowRightOutlined /></Tooltip>, value: 'row' },
              { label: <Tooltip title="纵向"><ArrowDownOutlined /></Tooltip>, value: 'column' },
              { label: <Tooltip title="横向反转"><ArrowRightOutlined style={{ transform: 'scaleX(-1)' }} /></Tooltip>, value: 'row-reverse' },
              { label: <Tooltip title="纵向反转"><ArrowDownOutlined style={{ transform: 'scaleY(-1)' }} /></Tooltip>, value: 'column-reverse' },
            ]}
          />
        </Form.Item>
        <Form.Item name="justifyContent" label="主轴对齐" style={{ marginBottom: 12 }}>
          <Segmented
            block
            options={[
              { label: <Tooltip title="起始"><AlignLeftOutlined /></Tooltip>, value: 'flex-start' },
              { label: <Tooltip title="居中"><AlignCenterOutlined /></Tooltip>, value: 'center' },
              { label: <Tooltip title="结束"><AlignRightOutlined /></Tooltip>, value: 'flex-end' },
              { label: <Tooltip title="两端对齐"><ColumnWidthOutlined /></Tooltip>, value: 'space-between' },
              { label: <Tooltip title="分散对齐"><MenuOutlined /></Tooltip>, value: 'space-around' },
            ]}
          />
        </Form.Item>
        <Form.Item name="alignItems" label="交叉轴对齐" style={{ marginBottom: 12 }}>
          <Segmented
            block
            options={[
              { label: <Tooltip title="起始"><VerticalAlignTopOutlined /></Tooltip>, value: 'flex-start' },
              { label: <Tooltip title="居中"><VerticalAlignMiddleOutlined /></Tooltip>, value: 'center' },
              { label: <Tooltip title="结束"><VerticalAlignBottomOutlined /></Tooltip>, value: 'flex-end' },
              { label: <Tooltip title="拉伸"><ColumnHeightOutlined /></Tooltip>, value: 'stretch' },
              { label: <Tooltip title="基线"><BorderOutlined /></Tooltip>, value: 'baseline' },
            ]}
          />
        </Form.Item>
        <Form.Item name="flexWrap" label="换行" style={{ marginBottom: 12 }}>
          <Segmented
            block
            options={[
              { label: '不换行', value: 'nowrap' },
              { label: '换行', value: 'wrap' },
              { label: '反向换行', value: 'wrap-reverse' },
            ]}
          />
        </Form.Item>
        <Form.Item name="alignContent" label="多行对齐" style={{ marginBottom: 12 }}>
          <Select size="small">
            <Select.Option value="flex-start">起始</Select.Option>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="flex-end">结束</Select.Option>
            <Select.Option value="stretch">拉伸</Select.Option>
            <Select.Option value="space-between">两端对齐</Select.Option>
            <Select.Option value="space-around">分散对齐</Select.Option>
          </Select>
        </Form.Item>
      </>
    ),
  };

  // Flex 子元素属性面板
  const flexItemPanel = {
    key: 'flexItem',
    label: 'Flex 子元素',
    children: (
      <>
        <Form.Item name="flexGrow" label="放大比例 (grow)" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="flexShrink" label="缩小比例 (shrink)" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="flexBasis" label="基础尺寸 (basis)" style={{ marginBottom: 12 }}>
          <SizeInput />
        </Form.Item>
        <Form.Item name="alignSelf" label="自身对齐" style={{ marginBottom: 12 }}>
          <Select size="small">
            <Select.Option value="auto">自动</Select.Option>
            <Select.Option value="flex-start">起始</Select.Option>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="flex-end">结束</Select.Option>
            <Select.Option value="stretch">拉伸</Select.Option>
            <Select.Option value="baseline">基线</Select.Option>
          </Select>
        </Form.Item>
      </>
    ),
  };

  // 间距面板 - Chrome DevTools 风格盒子模型
  const spacingPanel = {
    key: 'spacing',
    label: '间距',
    children: <BoxModelInput />,
  };

  // 样式面板
  const stylePanel = {
    key: 'style',
    label: '样式',
    children: (
      <>
        <Form.Item name="backgroundColor" label="背景颜色" style={{ marginBottom: 12 }}>
          <ColorPicker size="small" showText />
        </Form.Item>
        <Form.Item name="cornerRadius" label="圆角" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} addonAfter="px" />
        </Form.Item>
        <Form.Item name="borderWidth" label="边框宽度" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} addonAfter="px" />
        </Form.Item>
        <Form.Item name="borderColor" label="边框颜色" style={{ marginBottom: 12 }}>
          <ColorPicker size="small" showText />
        </Form.Item>
        <Form.Item name="opacity" label="透明度" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} max={1} step={0.1} />
        </Form.Item>
        <Form.Item name="overflow" label="溢出处理" style={{ marginBottom: 12 }}>
          <Segmented
            block
            size="small"
            options={[
              { label: '显示', value: 'visible' },
              { label: '隐藏', value: 'hidden' },
              { label: '滚动', value: 'scroll' },
            ]}
          />
        </Form.Item>
      </>
    ),
  };

  // 文本属性面板
  const textPanel = {
    key: 'text',
    label: '文本',
    children: (
      <>
        <Form.Item name="text" label="文本内容" style={{ marginBottom: 12 }}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="fontSize" label="字体大小" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} addonAfter="px" />
        </Form.Item>
        <Form.Item name="fontWeight" label="字重" style={{ marginBottom: 12 }}>
          <Segmented
            block
            size="small"
            options={[
              { label: '常规', value: 'normal' },
              { label: '中等', value: '500' },
              { label: '粗体', value: 'bold' },
            ]}
          />
        </Form.Item>
        <Form.Item name="textColor" label="文本颜色" style={{ marginBottom: 12 }}>
          <ColorPicker size="small" showText />
        </Form.Item>
        <Form.Item name="textAlign" label="对齐方式" style={{ marginBottom: 12 }}>
          <Segmented
            block
            options={[
              { label: <Tooltip title="左对齐"><AlignLeftOutlined /></Tooltip>, value: 'left' },
              { label: <Tooltip title="居中"><AlignCenterOutlined /></Tooltip>, value: 'center' },
              { label: <Tooltip title="右对齐"><AlignRightOutlined /></Tooltip>, value: 'right' },
            ]}
          />
        </Form.Item>
        <Form.Item name="lineHeight" label="行高" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} step={0.1} />
        </Form.Item>
        <Form.Item name="numberOfLines" label="最大行数" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} placeholder="0 表示不限制" />
        </Form.Item>
      </>
    ),
  };

  // 图片属性面板
  const imagePanel = {
    key: 'image',
    label: '图片',
    children: (
      <>
        <Form.Item name="src" label="图片地址" style={{ marginBottom: 12 }}>
          <Input size="small" placeholder="输入图片URL" />
        </Form.Item>
        <Form.Item name="contentMode" label="填充模式" style={{ marginBottom: 12 }}>
          <Segmented
            block
            size="small"
            options={[
              { label: '包含', value: 'scaleAspectFit' },
              { label: '覆盖', value: 'scaleAspectFill' },
              { label: '填充', value: 'scaleToFill' },
            ]}
          />
        </Form.Item>
        <Form.Item name="aspectRatio" label="宽高比" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} step={0.1} placeholder="例如: 1.5" />
        </Form.Item>
      </>
    ),
  };

  // 按钮属性面板
  const buttonPanel = {
    key: 'button',
    label: '按钮',
    children: (
      <>
        <Form.Item name="title" label="按钮文本" style={{ marginBottom: 12 }}>
          <Input size="small" />
        </Form.Item>
        <Form.Item name="fontSize" label="字体大小" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} addonAfter="px" />
        </Form.Item>
        <Form.Item name="fontWeight" label="字重" style={{ marginBottom: 12 }}>
          <Segmented
            block
            size="small"
            options={[
              { label: '常规', value: 'normal' },
              { label: '中等', value: '500' },
              { label: '粗体', value: 'bold' },
            ]}
          />
        </Form.Item>
        <Form.Item name="textColor" label="文本颜色" style={{ marginBottom: 12 }}>
          <ColorPicker size="small" showText />
        </Form.Item>
      </>
    ),
  };

  // 列表属性面板
  const listPanel = {
    key: 'list',
    label: '列表',
    children: (
      <>
        <Form.Item name="direction" label="滚动方向" style={{ marginBottom: 12 }}>
          <Segmented
            block
            options={[
              { label: <Tooltip title="纵向"><ArrowDownOutlined /></Tooltip>, value: 'vertical' },
              { label: <Tooltip title="横向"><ArrowRightOutlined /></Tooltip>, value: 'horizontal' },
            ]}
          />
        </Form.Item>
        <Form.Item name="columns" label="列数" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item name="rows" label="行数" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item name="rowSpacing" label="行间距" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="columnSpacing" label="列间距" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="itemWidth" label="Item 宽度" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="itemHeight" label="Item 高度" style={{ marginBottom: 12 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="showsIndicator" label="显示滚动条" valuePropName="checked" style={{ marginBottom: 12 }}>
          <Switch size="small" />
        </Form.Item>
        <Form.Item name="bounces" label="弹性效果" valuePropName="checked" style={{ marginBottom: 12 }}>
          <Switch size="small" />
        </Form.Item>
        <Form.Item name="isPagingEnabled" label="分页滚动" valuePropName="checked" style={{ marginBottom: 12 }}>
          <Switch size="small" />
        </Form.Item>
      </>
    ),
  };

  const getCollapseItems = (): CollapseProps['items'] => {
    const items: CollapseProps['items'] = [];

    items.push(sizePanel);

    switch (component.type) {
      case 'container':
        items.push(flexboxPanel);
        items.push(spacingPanel);
        items.push(stylePanel);
        break;

      case 'text':
        items.push(textPanel);
        items.push(flexItemPanel);
        items.push(spacingPanel);
        items.push(stylePanel);
        break;

      case 'image':
        items.push(imagePanel);
        items.push(flexItemPanel);
        items.push(spacingPanel);
        items.push(stylePanel);
        break;

      case 'button':
        items.push(buttonPanel);
        items.push(flexItemPanel);
        items.push(spacingPanel);
        items.push(stylePanel);
        break;

      case 'list':
        items.push(listPanel);
        items.push(flexboxPanel);
        items.push(spacingPanel);
        items.push(stylePanel);
        break;
    }

    return items;
  };

  // 属性 Tab 内容
  const propsTabContent = (
    <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
      <Form
        form={form}
        layout="vertical"
        size="small"
        onValuesChange={handleValuesChange}
      >
        <Collapse 
          items={getCollapseItems()} 
          defaultActiveKey={['size', 'flexbox', 'text', 'image', 'button', 'list']} 
          ghost 
          size="small"
        />
      </Form>
    </div>
  );

  const tabItems = [
    {
      key: 'props',
      label: '属性',
      children: propsTabContent,
    },
    {
      key: 'bindings',
      label: '数据绑定',
      children: (
        <DataBindingTab
          component={component}
          selectedComponentId={selectedComponentId!}
          updateComponent={updateComponent}
        />
      ),
    },
    {
      key: 'events',
      label: '事件',
      children: (
        <EventTab
          component={component}
          selectedComponentId={selectedComponentId!}
          updateComponent={updateComponent}
        />
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 组件信息头部 */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ marginBottom: 8 }}>
          <Typography.Text strong>{componentDef?.name}</Typography.Text>
          <Divider style={{ margin: '8px 0' }} />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            ID: {component.id}
          </Typography.Text>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Tabs
          items={tabItems}
          defaultActiveKey="props"
          size="small"
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          tabBarStyle={{ paddingLeft: 16, paddingRight: 16, marginBottom: 0 }}
        />
      </div>
    </div>
  );
};

export default PropertyPanel;
