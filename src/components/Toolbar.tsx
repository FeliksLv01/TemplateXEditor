import { Button, Space, Modal, message } from 'antd';
import { DownloadOutlined, ImportOutlined, UndoOutlined, RedoOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useState, useMemo, useCallback, useEffect } from 'react';
import useEditorStore from '@/store/editorStore';
import { cleanComponentForExport } from '@/utils/dslCleaner';
import { JsonEditor } from './JsonEditor';

export const Toolbar = () => {
  const { rootComponent, undo, redo, history, mockData, setMockData } = useEditorStore();
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [mockDataModalVisible, setMockDataModalVisible] = useState(false);
  const [mockDataText, setMockDataText] = useState('');
  const [mockDataError, setMockDataError] = useState<string | null>(null);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const hasMockData = Object.keys(mockData).length > 0;

  // 打开 Modal 时，用当前 store 中的 mockData 填充
  useEffect(() => {
    if (mockDataModalVisible) {
      setMockDataText(JSON.stringify(mockData, null, 2));
      setMockDataError(null);
    }
  }, [mockDataModalVisible, mockData]);

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

  const handleExport = () => {
    if (!rootComponent) {
      message.warning('请先创建组件');
      return;
    }
    setExportModalVisible(true);
  };

  const handleDownload = () => {
    if (!rootComponent) {
      message.warning('请先创建组件');
      return;
    }
    const cleanedDsl = cleanComponentForExport(rootComponent);
    const json = JSON.stringify(cleanedDsl, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('下载成功');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          useEditorStore.getState().setRootComponent(json);
          message.success('导入成功');
        } catch (error) {
          message.error('导入失败：JSON 格式错误');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportJson = useMemo(() => {
    if (!rootComponent) return '';
    const cleanedDsl = cleanComponentForExport(rootComponent);
    return JSON.stringify(cleanedDsl, null, 2);
  }, [rootComponent]);

  const handleCopy = () => {
    if (exportJson) {
      navigator.clipboard.writeText(exportJson);
      message.success('已复制到剪贴板');
    }
  };

  return (
    <>
      <Space>
        <Button icon={<UndoOutlined />} onClick={undo} disabled={!canUndo}>
          撤销 (Ctrl+Z)
        </Button>
        <Button icon={<RedoOutlined />} onClick={redo} disabled={!canRedo}>
          重做 (Ctrl+Y)
        </Button>
        <Button
          icon={<DatabaseOutlined />}
          onClick={() => setMockDataModalVisible(true)}
          type={hasMockData ? 'primary' : 'default'}
          ghost={hasMockData}
        >
          模拟数据{hasMockData ? ' (已配置)' : ''}
        </Button>
        <Button type="primary" onClick={handleExport}>
          导出 DSL
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>
          下载 JSON
        </Button>
        <Button icon={<ImportOutlined />} onClick={handleImport}>
          导入 JSON
        </Button>
      </Space>

      {/* 导出 DSL Modal */}
      <Modal
        title="导出 DSL"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setExportModalVisible(false)}>
            关闭
          </Button>,
          <Button key="copy" type="primary" onClick={handleCopy}>
            复制 JSON
          </Button>,
        ]}
        width={600}
      >
        <JsonEditor
          value={exportJson}
          readOnly
          height="400px"
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
