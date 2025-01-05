import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import CreateSurveyPage from "./pages/CreateSurveyPage";
import SurveyAnalyticsPage from "./pages/SurveyAnalyticsPage";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { listenForAuthChanges } from "./auth";
import PublicRoute from "./PublicRoute";
import SurveyDisplayPage from "./pages/SurveyDisplayPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f6f5fa",
        padding: "8px",
      }}
    >
      <Router>
        {location.pathname !== "/survey" && <Header />}

        <Routes>
          <Route
            path="/survey"
            element={
              <PublicRoute>
                <SurveyDisplayPage />
              </PublicRoute>
            }
          />
          <Route
            path="/survey/analytics"
            element={
              <ProtectedRoute>
                <SurveyAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route
            path="/survey/new"
            element={
              <ProtectedRoute>
                <CreateSurveyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
