import { Layout, Typography, theme, App as AntdApp } from 'antd';
import ComponentPanel from './components/ComponentPanel';
import ComponentTree from './components/ComponentTree';
import PreviewCanvas from './components/PreviewCanvas';
import PropertyPanel from './components/PropertyPanel';
import Toolbar from './components/Toolbar';
import DragDropHandler from './components/DragDropHandler';
import useHotkeys from './hooks/useHotkeys';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function AppContent() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useHotkeys();

  return (
    <DragDropHandler>
      <Layout style={{ height: '100vh' }}>
          <Header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: colorBgContainer,
            borderBottom: '1px solid #e8e8e8',
          }}>
            <Title level={4} style={{ margin: 0 }}>
              TemplateX Editor
            </Title>
            <Toolbar />
          </Header>
          <Layout>
            <Sider width={240} style={{ background: colorBgContainer, borderRight: '1px solid #e8e8e8' }}>
              <ComponentPanel />
            </Sider>
            <Sider width={280} style={{ background: colorBgContainer, borderRight: '1px solid #e8e8e8' }}>
              <ComponentTree />
            </Sider>
            <Content style={{ background: '#f5f5f5', overflow: 'hidden' }}>
              <PreviewCanvas />
            </Content>
            <Sider width={320} style={{ background: colorBgContainer, borderLeft: '1px solid #e8e8e8' }}>
              <PropertyPanel />
            </Sider>
          </Layout>
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
