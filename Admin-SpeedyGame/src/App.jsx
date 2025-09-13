import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/authentication/login";
import SignUp from "./page/authentication/SignUp";
import ForgotPassword from "./page/authentication/ForgotPassword";
import VerifyEmail from "./page/authentication/VerifyEmail";
import Admin from "./page/Admin/Admin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />       
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
