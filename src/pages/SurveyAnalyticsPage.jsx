import { useEffect, useState } from "react";
import { Column, Pie } from "@ant-design/plots";
import {
  Empty,
  Flex,
  Space,
  Col,
  Row,
  InputNumber,
  Select,
  Button,
  Tag,
  FloatButton,
  Drawer,
  List,
  Segmented,
} from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";
import {
  FilterOutlined,
  LoadingOutlined,
  ManOutlined,
  WomanOutlined,
  QuestionOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const SurveyAnalytics = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const surveyId = queryParams.get("surveyId");

  const [analytics, setAnalytics] = useState([]);
  const [originalAnalytics, setOriginalAnalytics] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showingFilterDrawer, setShowingFilterDrawer] = useState(false);
  const [filterTags, setFilterTags] = useState([]);

  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);
  const [gender, setGender] = useState(null);
  const options = [
    {
      label: (
        <Space>
          <ManOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
          Male
        </Space>
      ),
      value: "Male",
    },
    {
      label: (
        <Space>
          <WomanOutlined style={{ color: "#ff4d4f", fontSize: "18px" }} />
          Female
        </Space>
      ),
      value: "Female",
    },
    {
      label: (
        <Space>
          <QuestionOutlined style={{ color: "#5e677d", fontSize: "18px" }} />
          Other
        </Space>
      ),
      value: "Other",
    },
  ];
  const [educationLevel, setEducationLevel] = useState(null);

  useEffect(() => {
    if (surveyId) {
      axiosInstance
        .get(`/Analytics?surveyId=${surveyId}`)
        .then((response) => {
          setAnalytics(response.data);
          setOriginalAnalytics(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          axiosInstance
            .get(`/Survey/GetSurvey?surveyId=${surveyId}`)
            .then((response) => {
              setSurvey(response.data);
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
        });
    }
  }, [surveyId]);

  const renderBarChart = (answers) => {
    const data = Object.entries(answers).map(([key, value]) => ({
      label: key,
      value,
    }));

    const config = {
      data,
      xField: "label",
      yField: "value",
      yAxis: {
        tickInterval: 1,
      },
      legend: { position: "top-left" },
    };

    return <Column {...config} />;
  };

  const renderPieChart = (answers) => {
    const data = Object.entries(answers).map(([key, value]) => ({
      type: key,
      value,
    }));

    const config = {
      data,
      angleField: "value",
      colorField: "type",
      radius: 0.8,
      label: {
        type: "spider",
        labelHeight: 28,
        content: "{name}: {percentage}%",
      },
    };

    return <Pie {...config} />;
  };

  const loadingScreen = () => {
    return (
      <Flex flex={1} align="center" justify="center">
        <Space direction="vertical" align="center">
          <LoadingOutlined spin style={{ fontSize: "32px" }} />
          Loading
        </Space>
      </Flex>
    );
  };

  const questions = () => {
    return (
      <Col span={24}>
        {analytics[0].answers.length === 0 && !loading ? (
          <Empty description="No answers yet" />
        ) : (
          analytics.map((item, index) => (
            <div
              key={item.id}
              style={{
                marginBottom:
                  index + 1 !== survey.questions.length ? "32px" : "0",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                {item.question.text}
              </div>
              {item.question.type === "OpenText" ? (
                item.answers.length > 0 ? (
                  <List
                    bordered
                    size="small"
                    dataSource={item.answers}
                    pagination={
                      item.answers.length > 5
                        ? {
                            position: "bottom",
                            align: "center",
                            hideOnSinglePage: true,
                            defaultPageSize: 5,
                          }
                        : false
                    }
                    renderItem={(answer) => <List.Item>{answer}</List.Item>}
                  />
                ) : (
                  <Empty description="No answers available" />
                )
              ) : item.question.type === "SingleChoice" ? (
                item.answers && Object.keys(item.answers).length > 0 ? (
                  renderPieChart(item.answers)
                ) : (
                  <Empty description="No answers available" />
                )
              ) : item.answers && Object.keys(item.answers).length > 0 ? (
                renderBarChart(item.answers)
              ) : (
                <Empty description="No answers available" />
              )}
            </div>
          ))
        )}
      </Col>
    );
  };

  const showFilterDrawer = () => {
    setShowingFilterDrawer(true);
  };

  const closeFilterDrawer = () => {
    setShowingFilterDrawer(false);
  };

  const clearFilters = () => {
    setMinAge(null);
    setMaxAge(null);
    setGender(null);
    setEducationLevel(null);
    setFilterTags([]);
    setAnalytics(originalAnalytics);
  };

  const buildAnalyticsUrl = () => {
    const educationMapping = {
      primary: "Primary School",
      high: "High School",
      associate: "Associate Degree",
      bachelor: "Bachelor's Degree",
      master: "Master's Degree",
      doctorate: "Doctorate",
    };

    const baseUrl = `/Analytics?surveyId=${surveyId}`;
    const params = new URLSearchParams();

    if (minAge !== null && minAge !== undefined) {
      params.append("minAge", minAge);
    }
    if (maxAge !== null && maxAge !== undefined) {
      params.append("maxAge", maxAge);
    }
    if (gender) {
      params.append("sex", gender.charAt(0).toUpperCase() + gender.slice(1));
    }
    if (educationLevel) {
      params.append("educationLevel", educationLevel);
    }

    return `${baseUrl}&${params.toString()}`;
  };

  const filterData = () => {
    const tags = [];

    if (minAge !== null && maxAge !== null) {
      tags.push(`Age: ${minAge} - ${maxAge}`);
    } else if (minAge !== null) {
      tags.push(`Min Age: ${minAge}`);
    } else if (maxAge !== null) {
      tags.push(`Max Age: ${maxAge}`);
    }

    if (gender) {
      tags.push(`Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)}`);
    }

    if (educationLevel) {
      const educationLabelMap = {
        primary: "Primary School",
        high: "High School",
        associate: "Associate Degree",
        bachelor: "Bachelor's Degree",
        master: "Master's Degree",
        doctorate: "Doctorate",
      };
      tags.push(`Education: ${educationLabelMap[educationLevel]}`);
    }

    console.log(buildAnalyticsUrl());

    axiosInstance
      .get(buildAnalyticsUrl())
      .then((response) => {
        setAnalytics(response.data);
        setFilterTags(tags);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        closeFilterDrawer();
      });
  };

  const filterDrawer = () => {
    return (
      <Drawer
        title="Filter options"
        open={showingFilterDrawer}
        onClose={closeFilterDrawer}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <label
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Age Range
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <InputNumber
                placeholder="Min Age"
                min={1}
                max={100}
                style={{ width: "100px", flex: 1 }}
                value={minAge}
                onChange={(value) => setMinAge(value)}
              />
              <span style={{ fontWeight: "bold" }}>to</span>
              <InputNumber
                placeholder="Max Age"
                min={1}
                max={100}
                value={maxAge}
                style={{ width: "100px", flex: 1 }}
                onChange={(value) => setMaxAge(value)}
              />
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                marginRight: "8px",
              }}
            >
              Gender
            </label>
            <Segmented
              options={options}
              value={gender}
              onChange={(value) => setGender(value)}
            />
            <Button
              block
              type="text"
              style={{ marginTop: "8px" }}
              icon={<CloseOutlined />}
              onClick={() => {
                setGender(null);
              }}
            >
              Clear
            </Button>
          </div>
          {/* Education Level Filter */}
          <div>
            <label style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Education Level:
            </label>
            <Select
              placeholder="Select Education Level"
              value={educationLevel}
              onChange={(value) => setEducationLevel(value)}
              style={{ width: "100%" }}
              allowClear
              onClear={() => {
                setEducationLevel(null);
              }}
              options={[
                { label: "Primary School", value: "primary" },
                { label: "High School", value: "high" },
                { label: "Associate Degree", value: "associate" },
                { label: "Bachelor's Degree", value: "bachelor" },
                { label: "Master's Degree", value: "master" },
                { label: "Doctorate", value: "doctorate" },
              ]}
            />
          </div>
          <Row gutter={8}>
            <Col span={12}>
              <Button type="primary" onClick={filterData} block>
                Filter
              </Button>
            </Col>

            <Col span={12}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                icon={<CloseOutlined />}
                block
              >
                Clear filters
              </Button>
            </Col>
          </Row>
        </Space>
      </Drawer>
    );
  };

  const tagStyle = {
    padding: "4px 8px",
  };

  const analyticsScreen = () => {
    return (
      <Flex flex={1} align="start" justify="center">
        {filterDrawer()}
        <Col span={14}>
          <Row
            gutter={8}
            align="middle"
            justify="space-between"
            style={{
              background: "#fff",
              padding: "16px 32px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              border: "1px solid #f0f0f0",
              marginBottom: "16px",
            }}
          >
            <Col>
              <Space
                direction="vertical"
                style={{
                  textAlign: "justify",
                }}
              >
                <div style={{ fontSize: "2.5em", fontWeight: "bold" }}>
                  {survey.title}
                </div>
                <div style={{ color: "#5e677d" }}>{survey.description}</div>
              </Space>
            </Col>
          </Row>

          <Row
            gutter={8}
            style={{
              background: "#fff",
              padding: "8px 16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              border: "1px solid #f0f0f0",
              marginBottom: "16px",
            }}
          >
            <Col>
              <Tag color="blue" style={tagStyle}>
                {analytics.length}{" "}
                {analytics.length === 1 ? "question" : "questions"}
              </Tag>
            </Col>
            <Col>
              <Tag color="green" style={tagStyle}>
                {analytics[0].answers.length}{" "}
                {analytics[0].answers.length === 1 ? "response" : "responses"}
              </Tag>
            </Col>

            {filterTags.map((tag, index) => (
              <Col key={index}>
                <Tag color="purple" style={tagStyle} onClick={showFilterDrawer}>
                  {tag}
                </Tag>
              </Col>
            ))}
          </Row>

          <Row
            gutter={8}
            style={{
              background: "#fff",
              padding: "16px 32px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              border: "1px solid #f0f0f0",
            }}
          >
            {questions()}
          </Row>
        </Col>
      </Flex>
    );
  };

  const filterButton = () => {
    return (
      <FloatButton
        type="primary"
        shape="square"
        tooltip="Filter"
        icon={<FilterOutlined />}
        style={{
          insetInlineEnd: 64,
        }}
        onClick={showFilterDrawer}
      />
    );
  };

  return (
    <Flex flex={1} style={{ marginTop: "16px" }}>
      {loading === true ? (
        loadingScreen()
      ) : (
        <>
          {filterButton()}
          {analyticsScreen()}
        </>
      )}
    </Flex>
  );
};

export default SurveyAnalytics;
