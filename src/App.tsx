import { Layout, theme, App as AntdApp } from 'antd';
import ComponentPanel from './components/ComponentPanel';
import ComponentTree from './components/ComponentTree';
import PreviewCanvas from './components/PreviewCanvas';
import PropertyPanel from './components/PropertyPanel';
import DragDropHandler from './components/DragDropHandler';
import ResizablePanel from './components/ResizablePanel';
import useHotkeys from './hooks/useHotkeys';

function AppContent() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  useHotkeys();

  return (
    <DragDropHandler>
      <Layout style={{ height: '100vh' }}>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <ResizablePanel
              defaultWidth={200}
              minWidth={140}
              maxWidth={360}
              handleSide="right"
              style={{
                background: colorBgContainer,
                borderRight: `1px solid ${colorBorderSecondary}`,
                overflow: 'hidden',
              }}
            >
              <ComponentPanel />
            </ResizablePanel>
            <ResizablePanel
              defaultWidth={220}
              minWidth={160}
              maxWidth={400}
              handleSide="right"
              style={{
                background: colorBgContainer,
                borderRight: `1px solid ${colorBorderSecondary}`,
                overflow: 'hidden',
              }}
            >
              <ComponentTree />
            </ResizablePanel>
            <Layout.Content style={{ background: '#f0f2f5', overflow: 'hidden', flex: 1 }}>
              <PreviewCanvas />
            </Layout.Content>
            <ResizablePanel
              defaultWidth={360}
              minWidth={280}
              maxWidth={560}
              handleSide="left"
              className="right-sider"
              style={{
                background: colorBgContainer,
                borderLeft: `1px solid ${colorBorderSecondary}`,
                overflow: 'hidden',
              }}
            >
              <PropertyPanel />
            </ResizablePanel>
          </div>
        </Layout>
      </DragDropHandler>
  );
}

function App() {
  return (
    <AntdApp>
      <AppContent />
    </AntdApp>
  );
}

export default App;
