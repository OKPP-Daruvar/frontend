import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Flex, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const SurveyAnalyticsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const surveyId = queryParams.get("surveyId");

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (surveyId) {
      axiosInstance
        .get(`/Analytics?surveyId=${surveyId}`)
        .then((response) => {
          console.log(response);
          setAnalytics(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [surveyId]);

  const loadingScreen = () => {
    return (
      <Flex
        vertical
        style={{ flex: 1 }}
        justify="center"
        align="center"
        gap={16}
      >
        <LoadingOutlined style={{ fontSize: "3rem", color: "#5e677d" }} spin />
        <div
          style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5e677d" }}
        >
          Loading
        </div>
      </Flex>
    );
  };

  const analyticsScreen = () => {
    return <div>Analytics</div>;
  };

  const noDataScreen = () => {
    return <div>No data found</div>;
  };

  return (
    <>
      {loading
        ? loadingScreen()
        : analytics
        ? analyticsScreen()
        : noDataScreen()}
    </>
  );
};

export default SurveyAnalyticsPage;
