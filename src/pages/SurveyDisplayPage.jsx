import { useState, useEffect } from "react";
import { Card, Input, Radio, Checkbox, Button, Col, message } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";

const SurveyDisplayPage = () => {
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const surveyId = queryParams.get("surveyId");

  useEffect(() => {
    axiosInstance
      .get(`/Survey/GetSurvey?surveyId=${surveyId}`)
      .then((res) => {
        setSurvey(res.data);
      })
      .catch((err) => {
        console.error("Error fetching survey: ", err);
      });
  }, [surveyId]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateInputs = () => {
    if (!age || isNaN(age) || age <= 0) {
      message.error("Please enter a valid age.");
      return false;
    }
    if (!gender) {
      message.error("Please select a gender.");
      return false;
    }
    if (!educationLevel) {
      message.error("Please enter your education level.");
      return false;
    }
    for (const question of survey.questions) {
      if (
        !responses[question.questionId] ||
        responses[question.questionId].length === 0
      ) {
        message.error(`Please answer the question: ${question.text}`);
        return false;
      }
    }
    return true;
  };

  const submitResponses = () => {
    if (!validateInputs()) {
      return;
    }

    const formattedResponses = Object.keys(responses).reduce((acc, key) => {
      acc[key] = Array.isArray(responses[key])
        ? responses[key]
        : [responses[key]];
      return acc;
    }, {});

    const formattedData = {
      respondent: {
        age: Number(age) || 0,
        gender,
        educationLevel,
      },
      answers: formattedResponses,
    };

    console.log("Formatted Data: ", JSON.stringify(formattedData, null, 2));

    axiosInstance
      .post("/Survey/SendAnswer?surveyId=" + surveyId, formattedData)
      .then((res) => {
        console.log("Responses submitted successfully: ", res.data);
      })
      .catch((err) => {
        console.error("Error submitting responses: ", err);
      });
  };

  if (surveyId && !survey) {
    return <p>Loading survey...</p>;
  }

  return surveyId ? (
    <Col align="center" style={{ width: "100%" }}>
      <div style={{ width: "100%", textAlign: "center", marginBottom: "16px" }}>
        <h1>{survey.title}</h1>
        <p>{survey.description}</p>
      </div>

      <Card style={{ width: "100%", marginBottom: "16px" }}>
        <p style={{ fontWeight: "bold" }}>Age:</p>
        <Input
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </Card>

      <Card style={{ width: "100%", marginBottom: "16px" }}>
        <p style={{ fontWeight: "bold" }}>Gender:</p>
        <Radio.Group
          style={{ display: "flex", flexDirection: "column" }}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <Radio value="Male">Male</Radio>
          <Radio value="Female">Female</Radio>
          <Radio value="Other">Other</Radio>
        </Radio.Group>
      </Card>

      <Card style={{ width: "100%", marginBottom: "16px" }}>
        <p style={{ fontWeight: "bold" }}>Education Level:</p>
        <Input
          placeholder="Enter your education level"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
        />
      </Card>

      <Col direction="row" align="center" style={{ width: "100%" }}>
        {survey.questions && survey.questions.length > 0 ? (
          survey.questions.map((question) => (
            <Card
              key={question.questionId}
              style={{ width: "100%", marginBottom: "16px" }}
            >
              <p style={{ fontWeight: "bold" }}>{question.text}</p>

              {question.type === "OpenText" && (
                <Input
                  placeholder="Your answer"
                  value={responses[question.questionId] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.questionId, e.target.value)
                  }
                />
              )}

              {question.type === "SingleChoice" && (
                <Radio.Group
                  style={{ display: "flex", flexDirection: "column" }}
                  value={responses[question.questionId] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.questionId, e.target.value)
                  }
                >
                  {question.options.map((option, index) => (
                    <Radio
                      key={index}
                      value={option}
                      style={{ marginBottom: "8px" }}
                    >
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              )}

              {question.type === "MultipleChoice" && (
                <Checkbox.Group
                  style={{ display: "flex", flexDirection: "column" }}
                  options={question.options}
                  value={responses[question.questionId] || []}
                  onChange={(values) =>
                    handleResponseChange(question.questionId, values)
                  }
                />
              )}
            </Card>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </Col>

      <Button
        type="primary"
        onClick={submitResponses}
        style={{ marginTop: "16px" }}
      >
        Submit
      </Button>
    </Col>
  ) : (
    <p>Survey ID not provided.</p>
  );
};

export default SurveyDisplayPage;
