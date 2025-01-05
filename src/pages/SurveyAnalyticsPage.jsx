import React, { useEffect, useState } from "react";
import { Column, Pie } from "@ant-design/plots";
import { Spin, Empty } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";

const SurveyAnalytics = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const surveyId = queryParams.get("surveyId");

  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (surveyId) {
      axiosInstance
        .get(`/Analytics?surveyId=${surveyId}`)
        .then((response) => {
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

  const renderBarChart = (answers) => {
    const data = Object.entries(answers).map(([key, value]) => ({
      label: key,
      value,
    }));

    const config = {
      data,
      xField: "label",
      yField: "value",
      yAxis: {
        tickInterval: 1,
      },
      legend: { position: "top-left" },
    };

    return <Column {...config} />;
  };

  const renderPieChart = (answers) => {
    const data = Object.entries(answers).map(([key, value]) => ({
      type: key,
      value,
    }));

    const config = {
      data,
      angleField: "value",
      colorField: "type",
      radius: 0.8,
      label: {
        type: "spider",
        labelHeight: 28,
        content: "{name}: {percentage}%",
      },
    };

    return <Pie {...config} />;
  };

  return (
    <Spin spinning={loading}>
      <div>
        {analytics.length === 0 && !loading ? (
          <Empty description="No data available" />
        ) : (
          analytics.map((item) => (
            <div key={item.id} style={{ marginBottom: "20px" }}>
              <h3>{item.question.text}</h3>
              {item.question.type === "OpenText" ? (
                item.answers.length > 0 ? (
                  <ul>
                    {item.answers.map((answer, index) => (
                      <li key={index}>{answer}</li>
                    ))}
                  </ul>
                ) : (
                  <Empty description="No answers available" />
                )
              ) : item.question.type === "SingleChoice" ? (
                item.answers && Object.keys(item.answers).length > 0 ? (
                  renderPieChart(item.answers)
                ) : (
                  <Empty description="No answers available" />
                )
              ) : item.answers && Object.keys(item.answers).length > 0 ? (
                renderBarChart(item.answers)
              ) : (
                <Empty description="No answers available" />
              )}
            </div>
          ))
        )}
      </div>
    </Spin>
  );
};

export default SurveyAnalytics;
