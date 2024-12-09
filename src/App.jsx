import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import CreateSurveyPage from "./pages/CreateSurveyPage";

function App() {
  return (
    <Router>
      <div className="min-h-full">
        <div className="bg-light-gray-gray text-black dark:bg-black dark:text-light-gray">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new/survey" element={<CreateSurveyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
