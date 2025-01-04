import { useEffect, useState } from "react";
import { listenForAuthChanges } from "../auth";
import { Flex } from "antd";
import { Link } from "react-router-dom";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  const dashboardLink = () => {
    return (
      <Link to={"/dashboard"}>
        <UserOutlined style={{ marginRight: "8px" }} />
        Dashboard
      </Link>
    );
  };

  const loginLink = () => {
    return (
      <Link to={"/login"}>
        <LoginOutlined style={{ marginRight: "8px" }} />
        Login
      </Link>
    );
  };

  return (
    <Flex
      style={{
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      justify="space-between"
      align="center"
    >
      <Link
        to={"/"}
        style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "1rem" }}
      >
        OKPP Daruvar Projekt
      </Link>

      <div style={{ padding: "1rem" }}>
        {user ? dashboardLink() : loginLink()}
      </div>
    </Flex>
  );
};

export default Header;
