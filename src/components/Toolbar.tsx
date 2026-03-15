import { Button, Modal, message, Tooltip } from 'antd';
import { DownloadOutlined, CodeOutlined, CopyOutlined } from '@ant-design/icons';
import { useState, useCallback, useEffect, useRef } from 'react';
import useEditorStore from '@/store/editorStore';
import { cleanComponentForExport } from '@/utils/dslCleaner';
import { generateId } from '@/utils/idGenerator';
import { JsonEditor } from './JsonEditor';
import type { DSLComponent } from '@/types/editor';

// 递归规范化导入的 JSON：确保每个节点都有 id，保留 bindings/events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeImportedComponent(raw: Record<string, any>): DSLComponent {
  const component: DSLComponent = {
    id: (typeof raw.id === 'string' && raw.id) ? raw.id : generateId(String(raw.type)),
    type: String(raw.type),
    props: (raw.props as Record<string, any>) ?? {},
    style: (raw.style as Record<string, any>) ?? {},
  };
  if (raw.bindings && typeof raw.bindings === 'object' && Object.keys(raw.bindings as object).length > 0) {
    component.bindings = raw.bindings as Record<string, string>;
  }
  if (raw.events && typeof raw.events === 'object' && Object.keys(raw.events as object).length > 0) {
    component.events = raw.events as Record<string, any>;
  }
  if (Array.isArray(raw.children)) {
    component.children = (raw.children as Record<string, any>[]).map(normalizeImportedComponent);
  }
  return component;
}

export const Toolbar = () => {
  const { rootComponent, mockData, setMockData } = useEditorStore();

  // DSL 面板
  const [dslModalVisible, setDslModalVisible] = useState(false);
  const [dslText, setDslText] = useState('');
  const [dslError, setDslError] = useState<string | null>(null);
  // 追踪用户是否编辑过，区分「查看」和「编辑后应用」
  const [dslDirty, setDslDirty] = useState(false);
  const initialDslRef = useRef('');

  // Mock Data 面板
  const [mockDataModalVisible, setMockDataModalVisible] = useState(false);
  const [mockDataText, setMockDataText] = useState('');
  const [mockDataError, setMockDataError] = useState<string | null>(null);

  const hasMockData = Object.keys(mockData).length > 0;

  // 打开 DSL 面板时，用当前组件树填充
  useEffect(() => {
    if (dslModalVisible) {
      const json = rootComponent
        ? JSON.stringify(cleanComponentForExport(rootComponent), null, 2)
        : '';
      setDslText(json);
      setDslError(null);
      setDslDirty(false);
      initialDslRef.current = json;
    }
  }, [dslModalVisible, rootComponent]);

  // 打开 Mock Data 面板时填充
  useEffect(() => {
    if (mockDataModalVisible) {
      setMockDataText(JSON.stringify(mockData, null, 2));
      setMockDataError(null);
    }
  }, [mockDataModalVisible, mockData]);

  const handleDslChange = useCallback((text: string) => {
    setDslText(text);
    setDslDirty(text !== initialDslRef.current);

    if (text.trim() === '') {
      setDslError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setDslError('必须是一个 JSON 对象');
        return;
      }
      if (!parsed.type) {
        setDslError('缺少 "type" 字段');
        return;
      }
      setDslError(null);
    } catch {
      setDslError('JSON 格式错误');
    }
  }, []);

  const handleDslApply = useCallback(() => {
    if (dslError || !dslText.trim()) return;
    try {
      const raw = JSON.parse(dslText);
      const normalized = normalizeImportedComponent(raw);
      useEditorStore.getState().setRootComponent(normalized);
      setDslModalVisible(false);
      message.success('已应用');
    } catch {
      setDslError('JSON 格式错误');
    }
  }, [dslText, dslError]);

  const handleDslCopy = useCallback(() => {
    if (dslText) {
      navigator.clipboard.writeText(dslText);
      message.success('已复制到剪贴板');
    }
  }, [dslText]);

  const handleDslDownload = useCallback(() => {
    if (!dslText.trim()) return;
    const blob = new Blob([dslText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('下载成功');
  }, [dslText]);

  const handleMockDataChange = useCallback((text: string) => {
    setMockDataText(text);

    if (text.trim() === '' || text.trim() === '{}') {
      setMockDataError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setMockDataError('必须是一个 JSON 对象');
        return;
      }
      setMockDataError(null);
    } catch {
      setMockDataError('JSON 格式错误');
    }
  }, []);

  const handleApplyMockData = useCallback(() => {
    if (mockDataError) return;
    try {
      const parsed = mockDataText.trim() === '' ? {} : JSON.parse(mockDataText);
      setMockData(parsed);
      setMockDataModalVisible(false);
      if (Object.keys(parsed).length > 0) {
        message.success('模拟数据已应用');
      } else {
        message.info('已清除模拟数据');
      }
    } catch {
      setMockDataError('JSON 格式错误');
    }
  }, [mockDataText, mockDataError, setMockData]);

  return (
    <>
      <div className="toolbar-actions">
        <Button
          className="toolbar-btn-text"
          onClick={() => setMockDataModalVisible(true)}
          type={hasMockData ? 'primary' : 'text'}
          ghost={hasMockData}
          size="small"
        >
          Mock Data{hasMockData ? ' *' : ''}
        </Button>

        <div className="toolbar-divider" />

        <Tooltip title="DSL" mouseEnterDelay={0.4}>
          <Button
            className="toolbar-btn"
            icon={<CodeOutlined />}
            onClick={() => setDslModalVisible(true)}
            type="text"
          />
        </Tooltip>
      </div>

      {/* DSL 面板 */}
      <Modal
        title="DSL"
        open={dslModalVisible}
        onCancel={() => setDslModalVisible(false)}
        width={640}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={handleDslDownload} disabled={!dslText.trim()}>
            下载
          </Button>,
          <Button key="copy" icon={<CopyOutlined />} onClick={handleDslCopy} disabled={!dslText.trim()}>
            复制
          </Button>,
          <Button
            key="apply"
            type="primary"
            disabled={!dslDirty || !!dslError || !dslText.trim()}
            onClick={handleDslApply}
          >
            应用
          </Button>,
        ]}
      >
        {dslError && (
          <p style={{ color: '#ff4d4f', fontSize: 12, marginBottom: 8 }}>
            {dslError}
          </p>
        )}
        <JsonEditor
          value={dslText}
          onChange={handleDslChange}
          height="460px"
        />
      </Modal>

      {/* 模拟数据 Modal */}
      <Modal
        title="模拟数据"
        open={mockDataModalVisible}
        onCancel={() => setMockDataModalVisible(false)}
        footer={[
          <Button key="clear" danger onClick={() => { setMockDataText('{}'); }}>
            清空
          </Button>,
          <Button key="cancel" onClick={() => setMockDataModalVisible(false)}>
            取消
          </Button>,
          <Button key="apply" type="primary" disabled={!!mockDataError} onClick={handleApplyMockData}>
            应用
          </Button>,
        ]}
        width={640}
      >
        <p style={{ color: '#666', fontSize: 12, marginBottom: 12 }}>
          输入 JSON 格式的模拟数据，预览区域将使用此数据解析组件的 bindings 表达式。
        </p>
        <p style={{ color: '#999', fontSize: 11, marginBottom: 8 }}>
          示例：{`{ "item": { "title": "商品标题", "price": 99.9, "isVip": true } }`}
        </p>
        <JsonEditor
          value={mockDataText}
          onChange={handleMockDataChange}
          height="400px"
          placeholder={'{\n  "item": {\n    "title": "示例标题",\n    "imageUrl": "https://example.com/image.jpg"\n  }\n}'}
        />
      </Modal>
    </>
  );
};

export default Toolbar;
