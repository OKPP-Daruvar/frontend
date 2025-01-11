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
  message,
  Tabs,
  Alert,
  Space,
  Affix,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  MinusOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CreateSurveyPage = () => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showingShareModal, setShowingShareModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [surveyId, setSurveyId] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
                  <span style={{ color: "#bbbbbb" }}>{choice.key}.</span>
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
                    icon={<MinusOutlined />}
                    onClick={() => deleteChoice(question.key, choice.key)}
                  />
                </Flex>
              ))
            ) : (
              <Flex
                align="center"
                justify="center"
                style={{
                  color: "#bbbbbb",
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

  const submitSurveyButton = () => (
    <Button
      type="primary"
      icon={<CheckOutlined />}
      iconPosition="end"
      onClick={submitSurvey}
      size="large"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 1000,
      }}
    >
      Submit survey
    </Button>
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
        showMessage("success", "Successfully created survey.");
        setSurveyId(res.data);
        showShareModal();
      })
      .catch((err) => {
        console.error("Error creating survey: ", err);
      });
  };

  const showMessage = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };

  const validateSurvey = () => {
    if (!surveyTitle) {
      showMessage("warning", "Please enter a survey title.");
      return false;
    }

    if (!surveyDescription) {
      showMessage("warning", "Please enter a survey description.");
      return false;
    }

    if (questions.length === 0) {
      showMessage("warning", "Please add at least one question.");
      return false;
    }

    const invalidQuestions = questions.filter((q) => !q.questionTitle);

    if (invalidQuestions.length > 0) {
      showMessage("warning", "Please fill in all question titles.");
      return false;
    }

    const invalidChoices = questions.filter(
      (q) => q.type !== "input" && (!q.choices || q.choices.length < 2)
    );

    if (invalidChoices.length > 0) {
      showMessage(
        "warning",
        "Please add at least two choices for multiple or single choice questions."
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
      showMessage("warning", "Please fill in all choice values.");
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

  const showShareModal = () => {
    setShowingShareModal(true);
  };

  const closeShareModal = () => {
    setShowingShareModal(false);
  };

  const copyLinkSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Successfully copied survey link",
    });
  };

  const copySurveyLink = () => {
    const surveyLink = `${window.location.origin}/survey?surveyId=${surveyId}`;
    navigator.clipboard.writeText(surveyLink);
    copyLinkSuccess();
  };

  const handleModalClose = () => {
    setEmailList([]);
  };

  const copyLinkShareTabContent = () => (
    <Col>
      <Col
        align="middle"
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
        }}
      >
        <InfoCircleOutlined
          style={{ fontSize: "1.2rem", color: "#1890ff", marginRight: "16px" }}
        />
        <div style={{ textAlign: "justify" }}>
          Click on the button below to copy the link to your clipboard. The
          survey can be filled out by anyone with the link.
        </div>
      </Col>
      <Button
        block
        type="primary"
        icon={<LinkOutlined />}
        onClick={copySurveyLink}
      >
        Copy link
      </Button>
    </Col>
  );

  const isEmailInvalid = !email.match(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  );

  const duplicateEmail = emailList.includes(email);

  const addEmailDisabled = isEmailInvalid || duplicateEmail;

  const getEmailRequestData = () => ({
    emails: emailList,
    surveyLink: `${window.location.origin}/survey?surveyId=${surveyId}`,
  });

  const sendEmail = () => {
    setSendingEmail(true);
    const emailRequestData = getEmailRequestData();
    axiosInstance
      .post("/EmailService/SendEmail", emailRequestData)
      .then((response) => {
        console.log(response);
        setEmailList([]);
        setEmail("");
        messageApi.open({
          type: "success",
          content: "Email(s) sent successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        messageApi.open({
          type: "error",
          content: "Failed to send email(s)",
        });
      })
      .finally(() => {
        setSendingEmail(false);
      });
  };

  const emailShareTabContent = () => (
    <Col>
      <Col
        align="middle"
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
        }}
      >
        <InfoCircleOutlined
          style={{ fontSize: "1.2rem", color: "#1890ff", marginRight: "16px" }}
        />
        <div style={{ textAlign: "justify" }}>
          Enter the email addresses of the people you want to share the survey
          with. They will receive an email with a link to the survey.
        </div>
      </Col>

      <Row gutter={4} align="middle" style={{ marginBottom: "16px" }}>
        <Col flex="1">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setEmailList((prev) => [...prev, email]);
              setEmail("");
            }}
            disabled={addEmailDisabled}
          >
            Add
          </Button>
        </Col>
      </Row>

      {emailList.length > 0 && (
        <Col style={{ marginBottom: "16px" }}>
          {emailList.map((email, index) => (
            <Row
              key={index}
              align="middle"
              justify="space-between"
              style={{
                padding: "4px 12px",
                marginBottom: "8px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
                border: "1px solid #d9d9d9",
              }}
            >
              <Col
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ fontSize: "1rem", color: "#5e677d" }}>
                  {email}
                </span>
              </Col>
              <Col>
                <Button
                  type="text"
                  danger
                  icon={<MinusOutlined />}
                  onClick={() => {
                    setEmailList((prev) => {
                      const newList = [...prev];
                      newList.splice(index, 1);
                      return newList;
                    });
                  }}
                />
              </Col>
            </Row>
          ))}
        </Col>
      )}

      <Button
        block
        type="primary"
        icon={<LinkOutlined />}
        disabled={!emailList.length}
        onClick={sendEmail}
        loading={sendingEmail}
      >
        Share via email
      </Button>
    </Col>
  );

  const items = [
    {
      key: "1",
      label: "Link",
      children: copyLinkShareTabContent(),
    },
    {
      key: "2",
      label: "Email",
      children: emailShareTabContent(),
    },
  ];

  return (
    <>
      {contextHolder}
      {submitSurveyButton()}

      <Modal
        centered
        open={showingShareModal}
        onCancel={closeShareModal}
        onClose={handleModalClose}
        footer={null}
        title={
          surveyTitle ? (
            <div style={{ textAlign: "center", fontWeight: "normal" }}>
              Share{" "}
              <span style={{ fontWeight: "bold", color: "#6f79f7" }}>
                {surveyTitle}
              </span>
            </div>
          ) : (
            "Loading..."
          )
        }
      >
        <Tabs defaultActiveKey="1" items={items} centered />
        <Button
          style={{ marginTop: "16px" }}
          block
          icon={<ArrowRightOutlined />}
          onClick={() => {
            closeShareModal();
            navigate("/dashboard");
          }}
        >
          Go to dashboard
        </Button>
      </Modal>

      <Row justify="center" align="top">
        <Col span={14}>
          <Form
            layout="vertical"
            variant="filled"
            style={{ marginTop: "16px" }}
          >
            <Card style={{ marginBottom: "16px" }}>
              <Input
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                name="surveyTitle"
                placeholder="Survey Title"
                size="large"
                variant="outlined"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5em",
                  marginBottom: "8px",
                }}
                required
              />

              <Input
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                name="surveyDescription"
                placeholder="Enter a short survey description."
                variant="outlined"
                required
              />
            </Card>

            <Alert
              type="info"
              showIcon
              message={
                "Each survey has three required questions, age, gender and education level, used for analysis about the respondent."
              }
              style={{ marginBottom: "16px" }}
            />

            {questions.length > 0 ? (
              <>
                <Card>
                  {questions.map((question) => getQuestionElement(question))}
                </Card>
                <Button
                  onClick={addQuestion}
                  style={{ marginTop: "16px", marginBottom: "32px" }}
                  icon={<PlusOutlined />}
                  block
                >
                  Add new question
                </Button>
              </>
            ) : (
              <Flex
                align="center"
                justify="center"
                flex={1}
                gap={16}
                vertical
                style={{
                  color: "#bbbbbb",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  margin: "32px",
                }}
              >
                There are no questions yet.
                <Button onClick={addQuestion} icon={<PlusOutlined />}>
                  Add new question
                </Button>
              </Flex>
            )}
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default CreateSurveyPage;
