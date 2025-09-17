import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Call forgot password API
      await AuthService.forgotPassword(email)
      
      // Navigate directly to reset password page with email
      navigate('/reset-password', { state: { email } })
      
    } catch (error) {
      console.error('Forgot password error:', error)
      setError(error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = () => {
    setIsSubmitted(false)
    setEmail('')
  }

  const handleGoToReset = () => {
    navigate('/reset-password', { state: { email } })
  }

  // This component now primarily navigates to reset page
  // Success screen is kept as fallback in case navigation fails

  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
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
              <span>📧</span>
            </div>
            
            <div className="success-content">
              <h2>Check Your Email</h2>
              <p>We've sent a password reset link to:</p>
              <div className="email-display">{email}</div>
              <p className="instruction">
                Click the link in the email to reset your password. 
                If you don't see the email, check your spam folder.
                Or you can directly enter the OTP code you received.
              </p>
            </div>

            <div className="action-buttons">
              <button 
                type="button" 
                className="reset-button"
                onClick={handleGoToReset}
              >
                Enter OTP Code
              </button>
              
              <button 
                type="button" 
                className="resend-button"
                onClick={handleResendEmail}
              >
                Send to Different Email
              </button>
              
              <Link to="/login" className="back-to-login">
                Back to Login
              </Link>
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
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">SpeedyGame</span>
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="form-container">
          <div className="header-section">
            <h2>Forgot Password?</h2>
            <p>Don't worry! Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
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

export default ForgotPassword
