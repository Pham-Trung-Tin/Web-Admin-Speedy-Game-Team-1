import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './page/Login/Login'
import SignUp from './page/Login/SignUp'
import ForgotPassword from './page/Login/ForgotPassword'
import Admin from './page/Admin/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLeaderBoard from './page/Admin/leaderboard/AdminLeaderBoard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/leaderboard" element={<AdminLeaderBoard />} />
        <Route path="/admin" element={
          
            <Admin />
          
        } />
        {/* <Route path="/admin/leaderboard" element={<AdminLeaderBoard />} /></Routes> */}
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
