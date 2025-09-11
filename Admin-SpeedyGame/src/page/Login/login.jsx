import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Handle login logic here
      console.log('Login attempt:', { username, password })
      
      // Simulate successful login
      if (username && password) {
        // Redirect to admin dashboard
        navigate('/admin')
      }
      
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // Handle forgot password logic
    alert('Forgot password functionality - to be implemented')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">SpeedyGame</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <div className="welcome-section">
            <h2>Welcome Back</h2>
            <p>Sign in to your admin dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">👤</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <Link
                to="/forgot-password"
                className="forgot-password-link"
              >
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                'Log In →'
              )}
            </button>
          </form>

          <div className="signup-section">
            <p>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="signup-link"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Dashboard Access */}
        <div className="admin-access">
          <span className="admin-icon">🔐</span>
          <span>Admin Dashboard Access</span>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>© 2024 SpeedyGame. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#support">Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login