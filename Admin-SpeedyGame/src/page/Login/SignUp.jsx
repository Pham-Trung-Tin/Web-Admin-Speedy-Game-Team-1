import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.css'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Handle sign up logic here
      console.log('Sign up attempt:', formData)
      
      // You can add your registration logic here
      // For example: await authService.register(formData)
      
      // Redirect to login page after successful registration
      alert('Account created successfully! Please log in.')
      navigate('/login')
      
    } catch (error) {
      console.error('Sign up failed:', error)
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">SpeedyGame</span>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="signup-form-container">
          <div className="welcome-section">
            <h2>Create Account</h2>
            <p>Join SpeedyGame admin community</p>
          </div>

          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSignUp}>
            {/* Name Fields */}
            <div className="name-group">
              <div className="form-group half-width">
                <label htmlFor="firstName">First Name</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={errors.firstName ? 'error' : ''}
                  />
                  <span className="input-icon">👤</span>
                </div>
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={errors.lastName ? 'error' : ''}
                  />
                  <span className="input-icon">👤</span>
                </div>
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.email ? 'error' : ''}
                />
                <span className="input-icon">📧</span>
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.username ? 'error' : ''}
                />
                <span className="input-icon">🆔</span>
              </div>
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.password ? 'error' : ''}
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
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            {/* Terms & Conditions */}
            <div className="terms-section">
              <p>
                By creating an account, you agree to our{' '}
                <a href="#terms" className="terms-link">Terms of Service</a>
                {' '}and{' '}
                <a href="#privacy" className="terms-link">Privacy Policy</a>
              </p>
            </div>

            <button 
              type="submit" 
              className={`signup-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <div className="login-section">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign In
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

export default SignUp