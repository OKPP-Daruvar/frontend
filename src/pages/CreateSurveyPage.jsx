import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Dropdown,
  Button,
  Card,
  Space,
  Checkbox,
  Flex,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

const CreateSurveyPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions([{ key: 1, text: "First question", type: "input" }]);
  }, []);

  const questionTypes = [
    { key: 1, type: "input" },
    { key: 2, type: "multipleChoice" },
  ];

  const getQuestionElement = (question) => {
    const handleMenuClick = (e, questionKey) => {
      const questionType = questionTypes.find(
        (q) => q.key === Number(e.key)
      )?.type;
      setQuestions((prev) =>
        prev.map((q) =>
          q.key === questionKey ? { ...q, type: questionType } : q
        )
      );
    };

    const items = [
      { label: "Input", key: 1 },
      { label: "Multiple choice", key: 2 },
    ];

    const menuProps = {
      items,
      onClick: (e) => handleMenuClick(e, question.key),
      selectable: true,
      defaultSelectedKeys: [
        question.type === "input"
          ? "1"
          : question.type === "multipleChoice"
          ? "2"
          : undefined,
      ],
    };

    return (
      <Card key={question.key}>
        <Row>
          <Form.Item
            label="Question Title"
            name={`questionTitle_${question.key}`}
            rules={[
              { required: true, message: "Please enter a question title!" },
            ]}
            style={{ width: "100%" }}
          >
            <Input placeholder="Enter question title" />
          </Form.Item>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Question Type"
              name={`questionType_${question.key}`}
              rules={[
                { required: true, message: "Please choose a question type!" },
              ]}
            >
              <Dropdown menu={menuProps} trigger={["click"]}>
                <Button>
                  <Space>
                    {question.type || "Choose a question type"}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Required" style={{ margin: "auto" }}>
              <Checkbox onChange={() => {}} />
            </Form.Item>
          </Col>
        </Row>
        <Flex align="end">
          <Button type="primary">Add</Button>
        </Flex>
      </Card>
    );
  };

  return (
    <Form>{questions.map((question) => getQuestionElement(question))}</Form>
  );
};

export default CreateSurveyPage;
