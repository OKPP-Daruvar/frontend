import { useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Dropdown,
  Button,
  Card,
  Flex,
  FloatButton,
  Divider,
  Modal,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CopyOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import axiosInstance from "../utils/axiosInstance";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const CreateSurveyPage = () => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestionKey = questions.length + 1;

    setQuestions((prev) => [
      ...prev,
      {
        key: newQuestionKey,
        questionTitle: "",
        type: "input",
        required: false,
      },
    ]);
  };

  const deleteQuestion = (questionKey) => {
    setQuestions((prev) => prev.filter((q) => q.key !== questionKey));

    setQuestions((prev) =>
      prev.map((q, index) => ({
        ...q,
        key: index + 1,
      }))
    );
  };

  const questionTypes = [
    { key: 1, type: "input" },
    { key: 2, type: "multipleChoice" },
    { key: 3, type: "singleChoice" },
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

      if (questionType === "input") {
        setQuestions((prev) =>
          prev.map((q) => (q.key === questionKey ? { ...q, choices: [] } : q))
        );
      }
    };

    const items = [
      { key: 1, label: "Input" },
      { key: 2, label: "Multiple choice" },
      { key: 3, label: "Single choice" },
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
          : question.type === "singleChoice"
          ? "3"
          : undefined,
      ],
    };

    const addChoice = () => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.key === question.key
            ? {
                ...q,
                choices: q.choices
                  ? [...q.choices, { key: q.choices.length + 1, value: "" }]
                  : [{ key: 1, value: "" }],
              }
            : q
        )
      );
    };

    const deleteChoice = (questionKey, choiceKey) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.key === questionKey
            ? {
                ...q,
                choices: q.choices.filter((o) => o.key !== choiceKey),
              }
            : q
        )
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.key === questionKey
            ? {
                ...q,
                choices: q.choices.map((o, index) => ({
                  ...o,
                  key: index + 1,
                })),
              }
            : q
        )
      );
    };

    const choices = (questionType) => {
      if (questionType === "input") return null;

      return (
        <>
          <Flex
            style={{ marginBottom: "16px", fontWeight: "bold" }}
            align="center"
            justify="space-between"
          >
            Choices
            <Button
              variant="outlined"
              icon={<PlusOutlined />}
              onClick={addChoice}
            >
              Add
            </Button>
          </Flex>

          <Row>
            {question.choices && question.choices.length > 0 ? (
              question.choices.map((choice) => (
                <Flex
                  key={choice.key}
                  style={{ marginBottom: "16px", width: "100%" }}
                  gap={8}
                  align="center"
                >
                  <span style={{ color: "#bbb" }}>{choice.key}.</span>
                  <Input
                    value={choice.value}
                    placeholder="Choice"
                    variant="outlined"
                    required
                    onChange={(e) => {
                      setQuestions((prev) =>
                        prev.map((q) =>
                          q.key === question.key
                            ? {
                                ...q,
                                choices: q.choices.map((o) =>
                                  o.key === choice.key
                                    ? { ...o, value: e.target.value }
                                    : o
                                ),
                              }
                            : q
                        )
                      );
                    }}
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteChoice(question.key, choice.key)}
                  />
                </Flex>
              ))
            ) : (
              <Flex
                align="center"
                justify="center"
                style={{
                  color: "#bbb",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  width: "100%",
                  padding: "16px",
                }}
              >
                There are no choices yet.
              </Flex>
            )}
          </Row>
        </>
      );
    };

    return (
      <div
        key={question.key}
        style={{
          marginBottom: question.key !== questions.length ? "32px" : "0",
        }}
      >
        <Form.Item
          rules={[
            { required: true, message: "Please enter a question title." },
          ]}
          style={{ width: "100%" }}
        >
          <Input
            value={question.questionTitle}
            placeholder="Question title"
            variant="outlined"
            size="large"
            style={{ fontWeight: "bold" }}
            required
            onChange={(e) => {
              setQuestions((prev) =>
                prev.map((q) =>
                  q.key === question.key
                    ? { ...q, questionTitle: e.target.value }
                    : q
                )
              );
            }}
          />
        </Form.Item>

        <Form.Item label="Question type" layout="horizontal">
          <Dropdown menu={menuProps} style={{ flex: 1 }}>
            <Button>
              {question.type === "input"
                ? "Input"
                : question.type === "multipleChoice"
                ? "Multiple choice"
                : question.type === "singleChoice"
                ? "Single choice"
                : "Select question type"}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>

        {choices(question.type)}

        <Flex direction="row" justify="end">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              deleteQuestion(question.key);
            }}
          >
            Delete Question
          </Button>
        </Flex>
        {question.key !== questions.length && <Divider />}
      </div>
    );
  };

  const newQuestionButton = () => (
    <FloatButton
      icon={<PlusOutlined />}
      tooltip="Add new question"
      onClick={addQuestion}
    />
  );

  const submitSurveyButton = () => (
    <FloatButton
      type="primary"
      icon={<CheckOutlined />}
      tooltip="Submit survey"
      onClick={submitSurvey}
    />
  );

  const surveyActionButtons = () => (
    <FloatButton.Group shape="square" style={{ insetInlineEnd: 48 }}>
      {newQuestionButton()}
      {submitSurveyButton()}
    </FloatButton.Group>
  );

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        message.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        message.error("Failed to copy.");
      });
  };

  const submitSurvey = () => {
    if (validateSurvey() === false) return;

    const formattedData = formatData();

    axiosInstance
      .post("/Survey/CreateSurvey", formattedData)
      .then((res) => {
        console.log("Survey created successfully: ", res.data);
        Modal.success({
          title: "Survey created successfully",
          content: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Row gutter={16} align="middle">
                <Col>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => {
                      copyToClipboard(
                        "http://localhost:5173/survey?surveyId=" + res.data
                      );
                    }}
                  >
                    Copy link
                  </Button>
                </Col>
                <Col>
                  <Button
                    icon={<ArrowRightOutlined />}
                    onClick={() => {
                      Modal.destroyAll();
                      navigate("/dashboard");
                    }}
                    type="primary"
                  >
                    Go to dashboard
                  </Button>
                </Col>
              </Row>
            </div>
          ),
          okButtonProps: { style: { display: "none" } },
          cancelButtonProps: { style: { display: "none" } },
        });
      })
      .catch((err) => {
        console.error("Error creating survey: ", err);
      });
  };

  const validateSurvey = () => {
    if (!surveyTitle) {
      alert("Please enter a survey title.");
      return false;
    }

    if (!surveyDescription) {
      alert("Please enter a survey description.");
      return false;
    }

    const invalidQuestions = questions.filter((q) => !q.questionTitle);

    if (invalidQuestions.length > 0) {
      alert("Please fill in all question titles.");
      return false;
    }

    const invalidChoices = questions.filter(
      (q) => q.type !== "input" && (!q.choices || q.choices.length < 2)
    );

    if (invalidChoices.length > 0) {
      alert(
        "Please add at least 2 choices for each single or multiple choice question."
      );
      return false;
    }

    const invalidChoiceValues = questions.filter((q) => {
      if (q.choices && q.choices.length > 0) {
        return q.choices.some((c) => c.value === "");
      }
      return false;
    });

    if (invalidChoiceValues.length > 0) {
      alert("Please fill in all choice values.");
      return false;
    }

    return true;
  };

  const formatData = () => {
    const getType = (type) => {
      switch (type) {
        case "input":
          return "OpenText";
        case "multipleChoice":
          return "multipleChoice";
        case "singleChoice":
          return "SingleChoice";
        default:
          return "";
      }
    };

    const formattedQuestions = questions.map((q) => {
      const formattedQuestion = {
        text: q.questionTitle,
        type: getType(q.type),
        options: q.choices ? q.choices.map((c) => c.value) : [],
      };

      return formattedQuestion;
    });

    const formattedData = {
      title: surveyTitle,
      description: surveyDescription,
      questions: formattedQuestions,
    };

    return formattedData;
  };

  return (
    <Flex direction="column" justify="center">
      <Col span={12} style={{ padding: "32px" }}>
        <Form layout="vertical" variant="filled">
          {surveyActionButtons()}

          <Card style={{ marginBottom: "16px" }}>
            <Input
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              name="surveyTitle"
              placeholder="Survey Title"
              size="large"
              variant="borderless"
              style={{ fontWeight: "bold", fontSize: "1.5em" }}
              required
            />

            <Input
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              name="surveyDescription"
              placeholder="Enter a short survey description."
              variant="borderless"
              required
            />
          </Card>

          <Card>
            {questions.length > 0 ? (
              questions.map((question) => getQuestionElement(question))
            ) : (
              <Flex
                align="center"
                justify="center"
                style={{
                  color: "#bbb",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  margin: "32px",
                }}
              >
                There are no questions yet.
              </Flex>
            )}
          </Card>
        </Form>
      </Col>
    </Flex>
  );
};

export default CreateSurveyPage;
