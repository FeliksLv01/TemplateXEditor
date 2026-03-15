import { Empty, Form, Input, InputNumber, Select, ColorPicker, Switch, Tooltip, Segmented, Tabs, Alert, Button } from 'antd';
import { Typography } from 'antd';
import { Fragment, useMemo, useEffect, useState, useCallback } from 'react';
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
  DownOutlined,
} from '@ant-design/icons';
import useEditorStore from '@/store/editorStore';
import { getComponentDefinition } from '@/config/componentRegistry';
import { CompactSizeInput, CompactSpacingInput } from './property-items';
import { cleanColorValue } from '@/utils/dslCleaner';

// ============================================================
// 可折叠分区组件
// ============================================================
const PanelSection: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="panel-section">
      <div className="panel-section-header" onClick={() => setOpen(!open)}>
        <span className="panel-section-title">{title}</span>
        <DownOutlined className={`panel-section-toggle ${open ? '' : 'collapsed'}`} />
      </div>
      {open && <div className="panel-section-body">{children}</div>}
    </div>
  );
};

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

  useEffect(() => {
    const bindings = component.bindings || {};
    setJsonText(JSON.stringify(bindings, null, 2));
    setError(null);
    setIsDirty(false);
  }, [component.id, component.bindings]);

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

  // ============================================================
  // 各分区渲染函数
  // ============================================================

  // 尺寸分区 — 双列紧凑布局
  const renderSizeSection = () => (
    <PanelSection title="Size">
      <div className="size-row">
        <Form.Item name="width" noStyle>
          <CompactSizeInput label="W" />
        </Form.Item>
        <Form.Item name="height" noStyle>
          <CompactSizeInput label="H" />
        </Form.Item>
      </div>
      <div className="size-row">
        <Form.Item name="minWidth" noStyle>
          <CompactSizeInput label="Min W" placeholder="--" />
        </Form.Item>
        <Form.Item name="minHeight" noStyle>
          <CompactSizeInput label="Min H" placeholder="--" />
        </Form.Item>
      </div>
      <div className="size-row">
        <Form.Item name="maxWidth" noStyle>
          <CompactSizeInput label="Max W" placeholder="--" />
        </Form.Item>
        <Form.Item name="maxHeight" noStyle>
          <CompactSizeInput label="Max H" placeholder="--" />
        </Form.Item>
      </div>
    </PanelSection>
  );

  // Flexbox 布局分区
  const renderFlexboxSection = () => (
    <PanelSection title="Layout">
      <Form.Item name="flexDirection" label="方向" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: <Tooltip title="横向"><ArrowRightOutlined /></Tooltip>, value: 'row' },
            { label: <Tooltip title="纵向"><ArrowDownOutlined /></Tooltip>, value: 'column' },
            { label: <Tooltip title="横向反转"><ArrowRightOutlined style={{ transform: 'scaleX(-1)' }} /></Tooltip>, value: 'row-reverse' },
            { label: <Tooltip title="纵向反转"><ArrowDownOutlined style={{ transform: 'scaleY(-1)' }} /></Tooltip>, value: 'column-reverse' },
          ]}
        />
      </Form.Item>
      <Form.Item name="justifyContent" label="主轴对齐" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: <Tooltip title="起始"><AlignLeftOutlined /></Tooltip>, value: 'flex-start' },
            { label: <Tooltip title="居中"><AlignCenterOutlined /></Tooltip>, value: 'center' },
            { label: <Tooltip title="结束"><AlignRightOutlined /></Tooltip>, value: 'flex-end' },
            { label: <Tooltip title="两端对齐"><ColumnWidthOutlined /></Tooltip>, value: 'space-between' },
            { label: <Tooltip title="分散对齐"><MenuOutlined /></Tooltip>, value: 'space-around' },
          ]}
        />
      </Form.Item>
      <Form.Item name="alignItems" label="交叉轴对齐" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: <Tooltip title="起始"><VerticalAlignTopOutlined /></Tooltip>, value: 'flex-start' },
            { label: <Tooltip title="居中"><VerticalAlignMiddleOutlined /></Tooltip>, value: 'center' },
            { label: <Tooltip title="结束"><VerticalAlignBottomOutlined /></Tooltip>, value: 'flex-end' },
            { label: <Tooltip title="拉伸"><ColumnHeightOutlined /></Tooltip>, value: 'stretch' },
            { label: <Tooltip title="基线"><BorderOutlined /></Tooltip>, value: 'baseline' },
          ]}
        />
      </Form.Item>
      <Form.Item name="flexWrap" label="换行" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: '不换行', value: 'nowrap' },
            { label: '换行', value: 'wrap' },
            { label: '反向', value: 'wrap-reverse' },
          ]}
        />
      </Form.Item>
      <Form.Item name="alignContent" label="多行对齐" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: <Tooltip title="起始"><AlignLeftOutlined /></Tooltip>, value: 'flex-start' },
            { label: <Tooltip title="居中"><AlignCenterOutlined /></Tooltip>, value: 'center' },
            { label: <Tooltip title="结束"><AlignRightOutlined /></Tooltip>, value: 'flex-end' },
            { label: <Tooltip title="拉伸"><ColumnHeightOutlined /></Tooltip>, value: 'stretch' },
            { label: <Tooltip title="两端对齐"><ColumnWidthOutlined /></Tooltip>, value: 'space-between' },
            { label: <Tooltip title="分散对齐"><MenuOutlined /></Tooltip>, value: 'space-around' },
          ]}
        />
      </Form.Item>
    </PanelSection>
  );

  // Flex 子元素分区
  const renderFlexItemSection = () => (
    <PanelSection title="Flex Item" defaultOpen={false}>
      <div className="size-row">
        <Form.Item name="flexGrow" label="Grow" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="flexShrink" label="Shrink" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
      </div>
      <Form.Item name="flexBasis" noStyle>
        <CompactSizeInput label="Basis" />
      </Form.Item>
      <Form.Item name="alignSelf" label="自身对齐" style={{ marginBottom: 0 }}>
        <Select size="small">
          <Select.Option value="auto">自动</Select.Option>
          <Select.Option value="flex-start">起始</Select.Option>
          <Select.Option value="center">居中</Select.Option>
          <Select.Option value="flex-end">结束</Select.Option>
          <Select.Option value="stretch">拉伸</Select.Option>
          <Select.Option value="baseline">基线</Select.Option>
        </Select>
      </Form.Item>
    </PanelSection>
  );

  // 间距分区
  const renderSpacingSection = () => (
    <PanelSection title="Spacing">
      <CompactSpacingInput />
    </PanelSection>
  );

  // 样式分区
  const renderStyleSection = () => (
    <PanelSection title="Fill & Stroke">
      <Form.Item name="backgroundColor" label="背景" style={{ marginBottom: 0 }}>
        <ColorPicker size="small" showText />
      </Form.Item>
      <div className="size-row">
        <Form.Item name="cornerRadius" label="圆角" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} addonAfter="px" />
        </Form.Item>
        <Form.Item name="opacity" label="透明度" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} max={1} step={0.1} />
        </Form.Item>
      </div>
      <div className="size-row">
        <Form.Item name="borderWidth" label="边框" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} addonAfter="px" />
        </Form.Item>
        <Form.Item name="borderColor" label="边框色" style={{ marginBottom: 0, flex: 1 }}>
          <ColorPicker size="small" showText />
        </Form.Item>
      </div>
      <Form.Item name="overflow" label="溢出" style={{ marginBottom: 0 }}>
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
    </PanelSection>
  );

  // 文本分区
  const renderTextSection = () => (
    <PanelSection title="Text">
      <Form.Item name="text" label="内容" style={{ marginBottom: 0 }}>
        <Input.TextArea rows={2} style={{ fontSize: 12 }} />
      </Form.Item>
      <div className="size-row">
        <Form.Item name="fontSize" label="字号" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} addonAfter="px" />
        </Form.Item>
        <Form.Item name="fontWeight" label="字重" style={{ marginBottom: 0, flex: 1 }}>
          <Segmented
            size="small"
            options={[
              { label: 'R', value: 'normal' },
              { label: 'M', value: '500' },
              { label: 'B', value: 'bold' },
            ]}
          />
        </Form.Item>
      </div>
      <Form.Item name="textColor" label="颜色" style={{ marginBottom: 0 }}>
        <ColorPicker size="small" showText />
      </Form.Item>
      <Form.Item name="textAlign" label="对齐" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: <Tooltip title="左对齐"><AlignLeftOutlined /></Tooltip>, value: 'left' },
            { label: <Tooltip title="居中"><AlignCenterOutlined /></Tooltip>, value: 'center' },
            { label: <Tooltip title="右对齐"><AlignRightOutlined /></Tooltip>, value: 'right' },
          ]}
        />
      </Form.Item>
      <div className="size-row">
        <Form.Item name="lineHeight" label="行高" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} step={0.1} />
        </Form.Item>
        <Form.Item name="numberOfLines" label="行数" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} placeholder="0=不限" />
        </Form.Item>
      </div>
    </PanelSection>
  );

  // 图片分区
  const renderImageSection = () => (
    <PanelSection title="Image">
      <Form.Item name="src" label="URL" style={{ marginBottom: 0 }}>
        <Input size="small" placeholder="输入图片地址" />
      </Form.Item>
      <Form.Item name="contentMode" label="模式" style={{ marginBottom: 0 }}>
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
      <Form.Item name="aspectRatio" label="宽高比" style={{ marginBottom: 0 }}>
        <InputNumber size="small" style={{ width: '100%' }} min={0} step={0.1} placeholder="例如: 1.5" />
      </Form.Item>
    </PanelSection>
  );

  // 按钮分区
  const renderButtonSection = () => (
    <PanelSection title="Button">
      <Form.Item name="title" label="文本" style={{ marginBottom: 0 }}>
        <Input size="small" />
      </Form.Item>
      <div className="size-row">
        <Form.Item name="fontSize" label="字号" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} addonAfter="px" />
        </Form.Item>
        <Form.Item name="fontWeight" label="字重" style={{ marginBottom: 0, flex: 1 }}>
          <Segmented
            size="small"
            options={[
              { label: 'R', value: 'normal' },
              { label: 'M', value: '500' },
              { label: 'B', value: 'bold' },
            ]}
          />
        </Form.Item>
      </div>
      <Form.Item name="textColor" label="颜色" style={{ marginBottom: 0 }}>
        <ColorPicker size="small" showText />
      </Form.Item>
    </PanelSection>
  );

  // 列表分区
  const renderListSection = () => (
    <PanelSection title="List">
      <Form.Item name="direction" label="方向" style={{ marginBottom: 0 }}>
        <Segmented
          block
          size="small"
          options={[
            { label: <Tooltip title="纵向"><ArrowDownOutlined /></Tooltip>, value: 'vertical' },
            { label: <Tooltip title="横向"><ArrowRightOutlined /></Tooltip>, value: 'horizontal' },
          ]}
        />
      </Form.Item>
      <div className="size-row">
        <Form.Item name="columns" label="列数" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item name="rows" label="行数" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={1} />
        </Form.Item>
      </div>
      <div className="size-row">
        <Form.Item name="rowSpacing" label="行距" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="columnSpacing" label="列距" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
      </div>
      <div className="size-row">
        <Form.Item name="itemWidth" label="宽" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="itemHeight" label="高" style={{ marginBottom: 0, flex: 1 }}>
          <InputNumber size="small" style={{ width: '100%' }} min={0} />
        </Form.Item>
      </div>
      <div className="size-row">
        <Form.Item name="showsIndicator" label="滚动条" valuePropName="checked" style={{ marginBottom: 0, flex: 1 }}>
          <Switch size="small" />
        </Form.Item>
        <Form.Item name="bounces" label="弹性" valuePropName="checked" style={{ marginBottom: 0, flex: 1 }}>
          <Switch size="small" />
        </Form.Item>
      </div>
      <Form.Item name="isPagingEnabled" label="分页" valuePropName="checked" style={{ marginBottom: 0 }}>
        <Switch size="small" />
      </Form.Item>
    </PanelSection>
  );

  // 根据组件类型组装分区
  const renderSections = () => {
    const sections: React.ReactNode[] = [];

    // 所有组件都有尺寸
    sections.push(<Fragment key="size">{renderSizeSection()}</Fragment>);

    switch (component.type) {
      case 'container':
        sections.push(<Fragment key="layout">{renderFlexboxSection()}</Fragment>);
        sections.push(<Fragment key="spacing">{renderSpacingSection()}</Fragment>);
        sections.push(<Fragment key="style">{renderStyleSection()}</Fragment>);
        break;

      case 'text':
        sections.push(<Fragment key="text">{renderTextSection()}</Fragment>);
        sections.push(<Fragment key="flexItem">{renderFlexItemSection()}</Fragment>);
        sections.push(<Fragment key="spacing">{renderSpacingSection()}</Fragment>);
        sections.push(<Fragment key="style">{renderStyleSection()}</Fragment>);
        break;

      case 'image':
        sections.push(<Fragment key="image">{renderImageSection()}</Fragment>);
        sections.push(<Fragment key="flexItem">{renderFlexItemSection()}</Fragment>);
        sections.push(<Fragment key="spacing">{renderSpacingSection()}</Fragment>);
        sections.push(<Fragment key="style">{renderStyleSection()}</Fragment>);
        break;

      case 'button':
        sections.push(<Fragment key="button">{renderButtonSection()}</Fragment>);
        sections.push(<Fragment key="flexItem">{renderFlexItemSection()}</Fragment>);
        sections.push(<Fragment key="spacing">{renderSpacingSection()}</Fragment>);
        sections.push(<Fragment key="style">{renderStyleSection()}</Fragment>);
        break;

      case 'list':
        sections.push(<Fragment key="list">{renderListSection()}</Fragment>);
        sections.push(<Fragment key="layout">{renderFlexboxSection()}</Fragment>);
        sections.push(<Fragment key="spacing">{renderSpacingSection()}</Fragment>);
        sections.push(<Fragment key="style">{renderStyleSection()}</Fragment>);
        break;
    }

    return sections;
  };

  // 属性 Tab 内容
  const propsTabContent = (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Form
        form={form}
        layout="vertical"
        size="small"
        onValuesChange={handleValuesChange}
      >
        {renderSections()}
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
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Typography.Text strong style={{ fontSize: 13 }}>{componentDef?.name}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          {component.id}
        </Typography.Text>
      </div>
      {/* Tabs */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Tabs
          items={tabItems}
          defaultActiveKey="props"
          size="small"
          className="property-panel-tabs"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
          tabBarStyle={{ paddingLeft: 16, paddingRight: 16, marginBottom: 0 }}
        />
      </div>
    </div>
  );
};

export default PropertyPanel;
