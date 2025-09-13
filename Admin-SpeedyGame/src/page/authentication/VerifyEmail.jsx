import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './VerifyEmail.css'

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [resendCooldown, setResendCooldown] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRefs = useRef([])

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://speedycount-staging.amazingtech.cc/api"
  // Lấy email từ state được truyền từ SignUp
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    }
  }, [location.state])

  // Countdown cho nút resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (index, value) => {
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setErrors({})

    // Tự động focus sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const pastedOtp = pastedData.replace(/\D/g, '').slice(0, 6).split('')
    
    const newOtp = [...otp]
    pastedOtp.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit
    })
    
    setOtp(newOtp)
    
    // Focus vào ô cuối cùng có giá trị hoặc ô tiếp theo
    const lastFilledIndex = Math.min(pastedOtp.length - 1, 5)
    inputRefs.current[lastFilledIndex]?.focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()

    const newErrors = {}
    
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    const otpString = otp.join('')
    if (otpString.length !== 6) {
      newErrors.otp = "Please enter complete 6-digit OTP"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

     try {
      const response = await fetch(`${API_BASE}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Verification failed")
      }

      const data = await response.json()
      console.log("✅ Verification successful:", data)

      alert("Email verified successfully! 🎉")
      navigate("/login")
    } catch (error) {
      console.error("❌ Verification failed:", error)
      setErrors({ general: error.message || "Verification failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }


  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      if (!response.ok) throw new Error("Failed to resend OTP")

      alert("OTP sent successfully! 📩")
      setResendCooldown(60) // cooldown 60 giây
    } catch (error) {
      console.error("Resend failed:", error)
      setErrors({ general: "Failed to resend OTP. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className="verify-page">
      <div className="verify-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">SpeedyGame</span>
          </div>
        </div>

        {/* Verify Form */}
        <div className="verify-form-container">
          <div className="welcome-section">
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit code to your email</p>
            {email && (
              <div className="email-display">
                <span className="email-text">{email}</span>
              </div>
            )}
          </div>

          {errors.general && <p className="field-error general-error">{errors.general}</p>}

          <form className="verify-form" onSubmit={handleVerify}>
            {/* Email Input (nếu chưa có email) */}
            {!email && (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <span className="input-icon">📧</span>
                </div>
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
            )}

            {/* OTP Input */}
            <div className="form-group">
              <label htmlFor="otp">Enter 6-Digit Code</label>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`otp-input ${errors.otp ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {errors.otp && <p className="field-error">{errors.otp}</p>}
            </div>

            <button 
              type="submit" 
              className={`verify-button ${isLoading ? 'loading' : ''} ${!isOtpComplete ? 'disabled' : ''}`}
              disabled={isLoading || !isOtpComplete}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify Email →'
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button 
              type="button" 
              className={`resend-button ${resendCooldown > 0 ? 'disabled' : ''}`}
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isLoading || !email}
            >
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend Code'
              }
            </button>
          </div>

          <div className="back-section">
            <p>
              Need to change email?{' '}
              <Link to="/signup" className="back-link">
                Back to Sign Up
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

export default VerifyEmail
