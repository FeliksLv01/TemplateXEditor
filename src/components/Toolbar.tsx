import { Button, Space, Modal, message } from 'antd';
import { DownloadOutlined, ImportOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import useEditorStore from '@/store/editorStore';
import { cleanComponentForExport } from '@/utils/dslCleaner';

export const Toolbar = () => {
  const { rootComponent, undo, redo, history } = useEditorStore();
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

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
        <pre style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto', maxHeight: 400 }}>
          {exportJson}
        </pre>
      </Modal>
    </>
  );
};

export default Toolbar;
