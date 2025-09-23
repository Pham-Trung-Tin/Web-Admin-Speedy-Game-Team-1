import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Helper function to parse duplicate errors
  const parseDuplicateError = (errorMessage) => {
    const message = errorMessage.toLowerCase();
    if (message.includes('email') && message.includes('username')) {
      return { general: "Email and Username already exist" };
    } else if (message.includes('email')) {
      return { email: "Email already exists" };
    } else if (message.includes('username')) {
      return { username: "Username already exists" };
    } else {
      return { general: "Email or Username already exists" };
    }
  };
  
  // Debounced validation function
  const validateField = useCallback(async (field, value) => {
    if (!value || value.trim() === '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
      return;
    }

    setIsValidating(true);
    try {
      const validationData = { [field]: value };
      const result = await AuthService.validateSignUpData(validationData);
      
      if (!result.isValid && result.errors[field]) {
        setErrors(prev => ({ ...prev, [field]: result.errors[field] }));
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } catch (error) {
      console.error('Validation error:', error);
      // Keep client-side validation as fallback
      if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Email format is invalid' }));
      } else if (field === 'password' && value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      }
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Client-side validation first (fallback)
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Validate with backend first (nếu available)
      const validationResult = await AuthService.validateSignUpData(formData);
      
      if (!validationResult.isValid) {
        setErrors(validationResult.errors);
        return;
      }

      // If validation passes, proceed with registration
      const data = await AuthService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Registration successful:", data);
      alert("Account created successfully! Please check your email for OTP.");
      navigate("/verify-email", { state: { email: formData.email } });

    } catch (error) {
      console.error("Sign up failed:", error);
      
      // Handle specific duplicate field errors
      if (error.status === 409) {
        if (error.field && error.message) {
          // Từ authService đã parse sẵn
          if (error.field === 'email') {
            setErrors({ email: error.message });
          } else if (error.field === 'username') {
            setErrors({ username: error.message });
          } else {
            setErrors({ general: error.message });
          }
        } else {
          // Parse từ raw error message
          const errorMessage = error.data?.message || error.message || "Conflict error";
          const parsedErrors = parseDuplicateError(errorMessage);
          setErrors(parsedErrors);
        }
      } 
      // Handle validation errors from backend
      else if (error.status === 400 && error.errors) {
        setErrors(error.errors);
      }
      // Handle other backend errors
      else if (error.status >= 400 && error.status < 500) {
        const message = error.data?.message || error.message || "Registration failed. Please try again.";
        setErrors({ general: message });
      }
      // Handle network/server errors
      else {
        setErrors({ general: "Registration failed. Please check your connection and try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };


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
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <span className="input-icon">🆔</span>
                {isValidating && formData.username && (
                  <span className="validation-spinner">⏳</span>
                )}
              </div>
              {errors.username && (
                <p className="field-error">{errors.username}</p>
              )}
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
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <span className="input-icon">📧</span>
                {isValidating && formData.email && (
                  <span className="validation-spinner">⏳</span>
                )}
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
                  onBlur={handleBlur}
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
                {isValidating && formData.password && (
                  <span className="validation-spinner">⏳</span>
                )}
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="terms-section">
              <p>
                By creating an account, you agree to our{" "}
                <a href="#terms" className="terms-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="terms-link">
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              type="submit"
              className={`signup-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div className="login-section">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Dashboard Access */}
        {/* <div className="admin-access">
          <span className="admin-icon">🔐</span>
          <span>Admin Dashboard Access</span>
        </div> */}

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
  );
};

export default SignUp;
