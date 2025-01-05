import { useEffect, useState } from "react";
import { listenForAuthChanges } from "../auth";
import {
  Button,
  Avatar,
  Row,
  Col,
  List,
  Modal,
  message,
  Tabs,
  Input,
} from "antd";
import { handleLogout } from "../auth";
import {
  BarChartOutlined,
  DeleteOutlined,
  FormOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(false);
  const [disabledItems, setDisabledItems] = useState([]);
  const [modalSurvey, setModalSurvey] = useState(null);
  const [showingShareModal, setShowingShareModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  useEffect(() => {
    if (surveys.length > 5) {
      setPagination({
        position: "bottom",
        align: "center",
        hideOnSinglePage: true,
        defaultPageSize: 5,
      });
    }
  }, [surveys]);

  useEffect(() => {
    if (user) {
      axiosInstance
        .get("/Survey/GetSurveys")
        .then((response) => {
          console.log(response);
          const sortedSurveys = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setSurveys(sortedSurveys);
          setDisabledItems(new Array(sortedSurveys.length).fill(false));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${(hash & 0x00ffffff).toString(16).padStart(6, "0")}`;
    return color;
  };

  const generateInitials = (email) => {
    const name = email.split("@")[0];
    const parts = name.split(/[.\-_]/);
    const initials = parts.slice(0, 2).map((part) => part[0].toUpperCase());
    return initials.join("");
  };

  const UserAvatar = ({ user }) => {
    if (user === null) {
      return (
        <Avatar
          style={{
            backgroundColor: "#5e677d",
            color: "#f6f5fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          size="large"
          shape="square"
        >
          <LoadingOutlined spin color="#f6f5fa" />
        </Avatar>
      );
    }

    const initials = generateInitials(user.email);
    const backgroundColor = stringToColor(user.email);

    return (
      <Avatar
        style={{
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
        size="large"
        shape="square"
      >
        {initials}
      </Avatar>
    );
  };

  const deleteSurvey = (survey, index) => () => {
    console.log(disabledItems);
    setDisabledItems((prev) => {
      const newDisabledItems = [...prev];
      newDisabledItems[index] = true;
      return newDisabledItems;
    });

    console.log(disabledItems);

    axiosInstance
      .delete(`/Survey/DeleteSurvey?surveyId=${survey.id}`)
      .then((response) => {
        console.log(response);
        const newSurveys = surveys.filter(
          (survey) => survey.id !== response.data.id
        );
        setSurveys(newSurveys);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setDisabledItems((prev) => {
          const newDisabledItems = [...prev];
          newDisabledItems[index] = false;
          return newDisabledItems;
        });
      });
  };

  const showShareModal = (survey) => {
    setShowingShareModal(true);
    setModalSurvey(survey);
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
    const surveyLink = `${window.location.origin}/survey?surveyId=${modalSurvey.id}`;
    navigator.clipboard.writeText(surveyLink);
    copyLinkSuccess();
  };

  const handleModalClose = () => {
    setEmailList([]);
    setModalSurvey(null);
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
    surveyLink: `${window.location.origin}/survey?surveyId=${modalSurvey.id}`,
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
      <Modal
        centered
        open={showingShareModal}
        onCancel={closeShareModal}
        onClose={handleModalClose}
        footer={null}
        title={
          modalSurvey ? (
            <div style={{ textAlign: "center", fontWeight: "normal" }}>
              Share{" "}
              <span style={{ fontWeight: "bold", color: "#6f79f7" }}>
                {modalSurvey.title}
              </span>
            </div>
          ) : (
            "Loading..."
          )
        }
      >
        <Tabs defaultActiveKey="1" items={items} centered />
      </Modal>
      <Row justify="center" align="middle">
        <Col span={14}>
          <div
            style={{
              marginTop: "16px",
              backgroundColor: "white",
              padding: "32px",
              minHeight: "100%",
              borderRadius: "8px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Row align="middle">
                <UserAvatar user={user} />
                <span style={{ marginLeft: "16px", fontSize: "1.5rem" }}>
                  {user ? user.email : "Loading..."}
                </span>
              </Row>
              <Button onClick={handleLogout} icon={<LogoutOutlined />}>
                Logout
              </Button>
            </Row>
          </div>
        </Col>
      </Row>

      <Row justify="center" align="middle" style={{ marginTop: "16px" }}>
        <Col span={14}>
          <div
            style={{
              backgroundColor: "white",
              padding: "16px 32px",
              minHeight: "100%",
              borderRadius: "8px",
            }}
          >
            <Row justify="space-between" align="middle">
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Your Surveys
              </h1>
              <Link to="/survey/new">New survey</Link>
            </Row>
            <List
              itemLayout="horizontal"
              split={surveys.length > 1}
              dataSource={surveys}
              loading={
                loading
                  ? {
                      indicator: (
                        <LoadingOutlined spin style={{ color: "#5e677d" }} />
                      ),
                      spinning: true,
                    }
                  : false
              }
              renderItem={(item, index) => (
                <List.Item>
                  <Row align="middle" style={{ width: "100%" }}>
                    <Col>
                      <Avatar
                        size={48}
                        icon={<FormOutlined />}
                        shape="square"
                      />
                    </Col>

                    <Col style={{ paddingLeft: "16px", flex: 1 }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                        {item.title}
                      </div>
                      <div style={{ color: "#5e677d" }}>{item.description}</div>
                    </Col>

                    <Row
                      align="middle"
                      justify="space-evenly"
                      style={{ flex: 1 }}
                    >
                      <Button
                        type="text"
                        style={{
                          color: "#32a67b",
                        }}
                        icon={<LinkOutlined />}
                        onClick={() => {
                          showShareModal(item);
                        }}
                      >
                        Share
                      </Button>

                      <Link to={`/survey/analytics?surveyId=${item.id}`}>
                        <Button
                          type="text"
                          style={{ color: "#6f79f7" }}
                          icon={<BarChartOutlined />}
                        >
                          Analytics
                        </Button>
                      </Link>

                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={deleteSurvey(item, index)}
                        loading={disabledItems[index]}
                      >
                        Delete
                      </Button>
                    </Row>
                  </Row>
                </List.Item>
              )}
              pagination={pagination}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
