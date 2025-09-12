import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService'

const ProtectedRoute = ({ children }) => {
  // Kiểm tra xác thực từ localStorage
  const isAuthenticated = () => {
    // Kiểm tra token từ authService
    const token = authService.getToken()
    
    // Kiểm tra authData từ localStorage (được sử dụng trong login.jsx)
    const authData = localStorage.getItem('authData')
    
    // Nếu có token hoặc authData thì được coi là đã đăng nhập
    return !!(token || authData)
  }

  // Nếu chưa đăng nhập, redirect đến trang login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Nếu đã đăng nhập, hiển thị component được bảo vệ
  return children
}

export default ProtectedRoute
