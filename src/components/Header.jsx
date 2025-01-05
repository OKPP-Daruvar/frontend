import { useEffect, useState } from "react";
import { listenForAuthChanges } from "../auth";
import { Dropdown, Flex, Row, Space } from "antd";
import { Link } from "react-router-dom";
import {
  DownOutlined,
  LoginOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

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

  const items = [
    {
      key: "1",
      label: (
        <Link to={"/login"}>
          <Row justify={"space-between"}>
            <div style={{ marginRight: "8px" }}>Login</div> <LoginOutlined />
          </Row>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to={"/register"}>
          <Row justify={"space-between"}>
            <div style={{ marginRight: "8px" }}>Register</div>{" "}
            <UserAddOutlined />
          </Row>
        </Link>
      ),
    },
  ];

  const loginLink = () => {
    return (
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Account
            <UserOutlined />
          </Space>
        </a>
      </Dropdown>
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
