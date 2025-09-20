import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/authentication/login";
import SignUp from "./page/authentication/SignUp";
import ForgotPassword from "./page/authentication/ForgotPassword";
import ResetPassword from "./page/authentication/ResetPassword";
import VerifyEmail from "./page/authentication/VerifyEmail";
import Admin from "./page/Admin/Admin";
import Profile from "./page/Admin/profileAdmin/Profile";
import UserDetail from "./page/Admin/user/UserDetail";
import EditUser from "./page/Admin/user/EditUser";
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
        <Route path="/reset-password" element={<ResetPassword />} />       
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/user/:id" element={<UserDetail />} />
        <Route path="/admin/user/:id/edit" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
