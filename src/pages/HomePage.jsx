import { Card, Carousel, Col, Row, Typography, Button, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const HomePage = () => {
  const contentStyle = {
    color: "#ffffff",
    background: "#5e677d",
    height: "160px",
    lineHeight: "160px",
    textAlign: "center",
    borderRadius: "8px",
  };

  return (
    <Row justify="center" align="top" style={{ marginTop: "16px" }}>
      <Col span={24}>
        <Card>
          <Typography.Title
            level={1}
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            OKPP Daruvar Project
          </Typography.Title>

          <Typography.Paragraph
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Welcome to the OKPP Daruvar Project! This platform empowers users to
            create surveys, collect responses, and analyze insights
            effortlessly. Build engaging surveys with our user-friendly tools
            and explore detailed analytics for informed decisions.
          </Typography.Paragraph>

          <Carousel
            autoplay
            autoplaySpeed={3000}
            arrows
            infinite
            draggable
            dotPosition={"bottom"}
            style={{ width: "100%", marginBottom: "2rem" }}
          >
            <div>
              <h3 style={contentStyle}>Effortless Survey Creation</h3>
            </div>
            <div>
              <h3 style={contentStyle}>Powerful Analytics</h3>
            </div>
            <div>
              <h3 style={contentStyle}>Share and Collect Responses</h3>
            </div>
            <div>
              <h3 style={contentStyle}>User-Friendly Interface</h3>
            </div>
          </Carousel>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="center" gutter={[16, 16]}>
              <Col>
                <Link to={"/survey/new"}>
                  <Button type="primary" icon={<EditOutlined />} size="large">
                    Create Survey
                  </Button>
                </Link>
              </Col>
            </Row>

            <Row
              justify="center"
              gutter={[16, 16]}
              style={{ marginTop: "16px" }}
            >
              <Col span={24}>
                <Card
                  bordered={false}
                  style={{ backgroundColor: "#f6f5fa", textAlign: "center" }}
                >
                  <Typography.Title level={3}>
                    Why Choose OKPP Daruvar?
                  </Typography.Title>
                  <Typography.Paragraph>
                    - Create surveys in minutes with our intuitive builder.
                    <br />
                    - Dive deep into response trends with analytics.
                    <br />
                    - Share your surveys easily and collect responses
                    seamlessly.
                    <br />- Make data-driven decisions with actionable insights.
                  </Typography.Paragraph>
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default HomePage;
