import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Radio,
  Checkbox,
  Button,
  Col,
  message,
  Row,
  Space,
  Form,
  Select,
  Segmented,
  Alert,
  Divider,
} from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";
import {
  ManOutlined,
  QuestionOutlined,
  WomanOutlined,
} from "@ant-design/icons";

const SurveyDisplayPage = () => {
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [age, setAge] = useState(null);

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
  const educationLevels = [
    "Primary School",
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
  ];

  const [submittingResponse, setSubmittingResponse] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const surveyId = queryParams.get("surveyId");

  useEffect(() => {
    axiosInstance
      .get(`/Survey/GetSurvey?surveyId=${surveyId}`)
      .then((res) => {
        setSurvey(res.data);
      })
      .catch((err) => {
        console.error("Error fetching survey: ", err);
      });
  }, [surveyId]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateInputs = () => {
    if (!age || isNaN(age) || age <= 0) {
      message.error("Please enter a valid age.");
      return false;
    }
    if (!gender) {
      message.error("Please select a gender.");
      return false;
    }
    if (!educationLevel) {
      message.error("Please enter your education level.");
      return false;
    }
    for (const question of survey.questions) {
      if (
        !responses[question.questionId] ||
        responses[question.questionId].length === 0
      ) {
        message.error(`Please answer the question: ${question.text}`);
        return false;
      }
    }
    return true;
  };

  const submitResponses = () => {
    if (!validateInputs()) {
      return;
    }

    const formattedResponses = Object.keys(responses).reduce((acc, key) => {
      acc[key] = Array.isArray(responses[key])
        ? responses[key]
        : [responses[key]];
      return acc;
    }, {});

    const formattedData = {
      respondent: {
        age: Number(age) || 0,
        gender,
        educationLevel,
      },
      answers: formattedResponses,
    };

    console.log("Formatted Data: ", JSON.stringify(formattedData, null, 2));

    setSubmittingResponse(true);

    axiosInstance
      .post("/Survey/SendAnswer?surveyId=" + surveyId, formattedData)
      .then((res) => {
        console.log("Responses submitted successfully: ", res.data);
        messageApi.success("Successfully submitted answers!");
        setResponses({});
        setAge(null);
        setGender(null);
        setEducationLevel(null);
      })
      .catch((err) => {
        console.error("Error submitting responses: ", err);
        messageApi.error("An error occured while submitting answers.");
      })
      .finally(() => {
        setSubmittingResponse(false);
      });
  };

  if (surveyId && !survey) {
    return <p>Loading survey...</p>;
  }

  const analyticsQuestions = () => {
    return (
      <Card style={{ width: "100%", marginBottom: "16px" }}>
        <Alert
          type="info"
          showIcon
          message={"These questions are used for survey data analysis."}
          style={{ marginBottom: "16px" }}
        />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Age" colon={false}>
              <Input
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Gender" colon={false}>
              <Segmented
                options={options}
                value={gender}
                onChange={(value) => setGender(value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Education Level"
          colon={false}
          style={{ marginBottom: "0" }}
        >
          <Select
            placeholder="Select your education level"
            value={educationLevel}
            onChange={(value) => setEducationLevel(value)}
            options={[
              { label: "Primary School", value: "primary" },
              { label: "High School", value: "high" },
              { label: "Associate Degree", value: "associate" },
              { label: "Bachelor's Degree", value: "bachelor" },
              { label: "Master's Degree", value: "master" },
              { label: "Doctorate", value: "doctorate" },
            ]}
          />
        </Form.Item>
      </Card>
    );
  };

  return surveyId ? (
    <>
      {contextHolder}
      <Row justify="center" align="middle" style={{ margin: "16px 0" }}>
        <Col span={14}>
          <Form
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <Card style={{ marginBottom: "16px" }}>
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                  textAlign: "justify",
                }}
              >
                <div style={{ fontSize: "2.5em", fontWeight: "bold" }}>
                  {survey.title}
                </div>
                <div style={{ color: "#5e677d" }}>{survey.description}</div>
              </Space>
            </Card>

            {analyticsQuestions()}

            <Card style={{ marginBottom: "16px" }}>
              <Col span={24}>
                {survey.questions && survey.questions.length > 0 ? (
                  survey.questions.map((question, index) => (
                    <>
                      <div
                        key={question.key}
                        style={{
                          marginBottom:
                            index + 1 !== survey.questions.length
                              ? "32px"
                              : "0",
                        }}
                      >
                        <div
                          style={{ fontSize: "1.5rem", marginBottom: "8px" }}
                        >
                          {question.text}
                        </div>
                        {question.type === "OpenText" && (
                          <Input
                            placeholder="Your answer"
                            value={responses[question.questionId] || ""}
                            onChange={(e) =>
                              handleResponseChange(
                                question.questionId,
                                e.target.value
                              )
                            }
                          />
                        )}
                        {question.type === "SingleChoice" && (
                          <Radio.Group
                            style={{ display: "flex", flexDirection: "column" }}
                            value={responses[question.questionId] || ""}
                            onChange={(e) =>
                              handleResponseChange(
                                question.questionId,
                                e.target.value
                              )
                            }
                          >
                            {question.options.map((option, index) => (
                              <Radio key={index} value={option}>
                                {option}
                              </Radio>
                            ))}
                          </Radio.Group>
                        )}
                        {question.type === "MultipleChoice" && (
                          <Checkbox.Group
                            style={{ display: "flex", flexDirection: "column" }}
                            options={question.options}
                            value={responses[question.questionId] || []}
                            onChange={(values) =>
                              handleResponseChange(question.questionId, values)
                            }
                          />
                        )}
                      </div>
                      {index + 1 !== survey.questions.length && <Divider />}
                    </>
                  ))
                ) : (
                  <p>No questions available.</p>
                )}
              </Col>
            </Card>

            <Button
              type="primary"
              onClick={submitResponses}
              block
              loading={submittingResponse}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  ) : (
    <p>Survey ID not provided.</p>
  );
};

export default SurveyDisplayPage;
