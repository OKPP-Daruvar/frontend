import { Col, Form, Input, Flex, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const RegisterPage = () => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const showPasswordHandler = () => {
    setIsShowingPassword(!isShowingPassword);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
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
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex align="center" justify="center">
      <Col span={8}>
        <Form
          style={{ margin: "auto" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
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

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Flex>
  );
};

export default RegisterPage;
