import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.css'

const SignUp = () => {
  const [formData, setFormData] = useState({
    
    email: '',
    username: '',
    password: '',
    
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  const handleSignUp = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
     try {
      const response = await fetch(
        "https://speedycount-staging.amazingtech.cc/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        }
      )

      if (!response.ok) throw new Error("Failed to register")
      const data = await response.json()
      console.log("API response:", data)

      alert("Account created successfully! Please check your email for OTP.")
      navigate("/verify-email", { state: { email: formData.email } })
    } catch (error) {
      console.error("Sign up failed:", error)
      setErrors({ general: "Registration failed. Please try again." })
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

           {errors.general && <p className="field-error">{errors.general}</p>}

          <form className="signup-form" onSubmit={handleSignUp}>
           
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <input
                  type="text"
                  
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  
                 
                />
                <span className="input-icon">🆔</span>
              </div>
             {errors.username && <p className="field-error">{errors.username}</p>}
            </div>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <input
                  type="text"
                  
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  
                />
                <span className="input-icon">📧</span>
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                 
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                 
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