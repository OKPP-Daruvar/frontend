import { Col, Form, Input, Flex, Button, Card, Alert } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const RegisterPage = () => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showPasswordHandler = () => {
    setIsShowingPassword(!isShowingPassword);
  };

  const handleRegister = (values) => {
    console.log("Success:", values);
    setLoading(true);
    axiosInstance
      .post("/Auth/RegisterUserAsync", {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to register");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex align="center" justify="center" flex={1}>
      <Col span={8}>
        <Card title="Register">
          <Form
            onFinish={handleRegister}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 6 }}
            labelAlign="left"
            colon={false}
            requiredMark={false}
          >
            {error && (
              <Alert
                type="error"
                description={error}
                showIcon
                closable
                style={{
                  marginBottom: "16px",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              />
            )}

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long!",
                },
              ]}
              type={isShowingPassword ? "text" : "password"}
              suffix={
                isShowingPassword ? (
                  <EyeOutlined
                    onClick={showPasswordHandler}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    onClick={showPasswordHandler}
                    style={{ cursor: "pointer" }}
                  />
                )
              }
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Flex>
  );
};

export default RegisterPage;
