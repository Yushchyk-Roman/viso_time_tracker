import React, { useState } from "react";
import { Layout, Typography, Space, Grid, Button, Divider } from "antd";
import { TimeEntryForm } from "./features/TimeEntryForm";
import { TimeEntryList } from "./features/TimeEntryList";
import { GithubOutlined, LinkedinOutlined, CodeOutlined} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title} = Typography;
const { useBreakpoint } = Grid;

const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const screens = useBreakpoint();

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ display: "flex", alignItems: "center", background: "#001529", padding: "0 24px" }}
      >
        <Space size="middle">
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            Viso Time Tracker
          </Title>
        </Space>
      </Header>

      <Content
        style={{
          padding: "24px 16px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <TimeEntryForm onSuccess={handleSuccess} />
          <TimeEntryList refreshTrigger={refreshTrigger} />
        </Space>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "#001529",
          color: "rgba(255, 255, 255, 0.65)",
          padding: "24px 16px",
        }}
      >
        <Space orientation="vertical" size="small" style={{ width: '100%' }}>
          <Space 
            orientation={screens.md ? "horizontal" : "vertical"} 
            size={screens.md ? "middle" : "small"}
            wrap
            style={{ fontSize: "16px", color: "#fff", justifyContent: 'center' }}
          >
            <span><CodeOutlined /> React</span>
            {screens.md && <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />}
            
            <span>NestJS</span>
            {screens.md && <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />}
            
            <span>Ant Design</span>
            {screens.md && <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />}
            
            <span>PostgreSQL</span>
          </Space>

          <Space size="large" style={{ marginTop: 10, marginBottom: 10 }} wrap>
            <Button
              type="link"
              icon={<GithubOutlined style={{ fontSize: "20px" }} />}
              href="https://github.com/Yushchyk-Roman"
              target="_blank"
              style={{ color: "#fff" }}
            >
              GitHub
            </Button>
            <Button
              type="link"
              icon={<LinkedinOutlined style={{ fontSize: "20px" }} />}
              href="https://www.linkedin.com/in/roman-yushchyk-038a03361"
              target="_blank"
              style={{ color: "#fff" }}
            >
              LinkedIn
            </Button>
          </Space>
        </Space>
      </Footer>
    </Layout>
  );
};

export default App;