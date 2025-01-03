import { Col, Form, Input, Flex, Button, Card, Alert } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setIsShowingPassword((prevState) => !prevState);
  };

  const handleLogin = async (values) => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      console.log("Token:", token);

      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);

      console.log("Login Successful:", user);
      alert("Login Successful!");
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidationFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  return (
    <Flex align="center" justify="center" flex={1}>
      <Col span={8}>
        <Card title="Login">
          <Form
            style={{ margin: "auto" }}
            onFinish={handleLogin}
            onFinishFailed={handleValidationFailed}
            autoComplete="off"
          >
            {error && (
              <Alert
                type="error"
                message={error}
                showIcon
                style={{ marginBottom: "16px" }}
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
            >
              <Input.Password
                type={isShowingPassword ? "text" : "password"}
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  )
                }
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Flex>
  );
};

export default LoginPage;
