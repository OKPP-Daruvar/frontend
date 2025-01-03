import { Col, Form, Input, Flex, Button, Card, Alert } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getErrorMessage } from "../firebaseAuthUtils";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <Flex align="center" justify="center" flex={1}>
      <Col span={8}>
        <Card title="Login">
          <Form
            onFinish={handleLogin}
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

            <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Flex>
  );
};

export default LoginPage;
