import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import './ResetPassword.css'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  // Get email from navigation state (from ForgotPassword page)
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }))
    }
  }, [location.state])

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // OTP validation
    if (!formData.otp) {
      newErrors.otp = 'OTP is required'
    } else if (formData.otp.length !== 6 || !/^\d+$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be 6 digits'
    }

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      await AuthService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      })
      
      setIsSuccess(true)
      
    } catch (error) {
      console.error('Reset password error:', error)
      setError(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">🎮</span>
              <span className="logo-text">SpeedyGame</span>
            </div>
          </div>

          {/* Success Message */}
          <div className="success-container">
            <div className="success-icon">
              <span>✅</span>
            </div>
            
            <div className="success-content">
              <h2>Password Reset Successful!</h2>
              <p>Your password has been successfully updated.</p>
              <p className="instruction">
                You can now log in with your new password.
              </p>
            </div>

            <div className="action-buttons">
              <button 
                type="button" 
                className="login-button"
                onClick={handleBackToLogin}
              >
                Go to Login
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>© 2024 SpeedyGame. All rights reserved.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">SpeedyGame</span>
          </div>
        </div>

        {/* Reset Password Form */}
        <div className="form-container">
          <div className="header-section">
            <h2>Reset Your Password</h2>
            <p>Enter the OTP sent to your email and create a new password.</p>
          </div>

          <form className="reset-password-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={errors.email ? 'error' : ''}
                />
                <span className="input-icon">📧</span>
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="otp">OTP Code</label>
              <div className="input-container">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  maxLength={6}
                  className={errors.otp ? 'error' : ''}
                />
                <span className="input-icon">🔢</span>
              </div>
              {errors.otp && <span className="field-error">{errors.otp}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={errors.newPassword ? 'error' : ''}
                />
                <span className="input-icon">🔒</span>
              </div>
              {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="back-to-login-section">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="login-link">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>© 2024 SpeedyGame. All rights reserved.</p>
          <div className="footer-links">
            <a href="#support">Contact Support</a>
            <span>•</span>
            <a href="#help">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword