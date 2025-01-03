import { useEffect, useState } from "react";
import { listenForAuthChanges } from "../auth";
import { Button, Avatar, Row, Col } from "antd";
import { handleLogout } from "../auth";
import { LoadingOutlined, LogoutOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(true);

  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  useEffect(() => {
    if (user) {
      setSurveys([]);
      setLoadingSurveys(false);
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
      >
        {initials}
      </Avatar>
    );
  };

  return (
    <>
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
            <h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>
              Your surveys
            </h1>
            {loadingSurveys ? (
              <LoadingOutlined spin />
            ) : (
              surveys.map((survey) => (
                <div key={survey.id}>
                  <h2>{survey.title}</h2>
                  <p>{survey.description}</p>
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
