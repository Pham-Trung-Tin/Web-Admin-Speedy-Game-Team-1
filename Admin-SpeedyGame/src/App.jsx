import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './page/Login/Login'
import SignUp from './page/Login/SignUp'
import ForgotPassword from './page/Login/ForgotPassword'
import Admin from './page/Admin/Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
