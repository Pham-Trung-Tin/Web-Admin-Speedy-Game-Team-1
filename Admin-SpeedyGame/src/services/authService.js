// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Auth Service
export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Để gửi cookies nếu cần
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      // Lưu token vào localStorage nếu API trả về
      if (data.token) {
        localStorage.setItem('access_token', data.token)
      }

      // Lưu thông tin user nếu có
      if (data.user) {
        localStorage.setItem('user_profile', JSON.stringify(data.user))
      }

      return data
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_profile')
  },

  // Kiểm tra token có hợp lệ không
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token')
    return !!token
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('access_token')
  },

  // Lấy thông tin user
  getUser: () => {
    const user = localStorage.getItem('user_profile')
    return user ? JSON.parse(user) : null
  }
}

export default authService
