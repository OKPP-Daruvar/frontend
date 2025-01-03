import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import CreateSurveyPage from "./pages/CreateSurveyPage";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { listenForAuthChanges } from "./auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#f6f5fa", padding: "8px" }}
    >
      <Router>
        <Header user={user} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new/survey"
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
