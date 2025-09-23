import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { authService } from "../../services/authService";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // Field-specific errors
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì redirect đến admin
  useEffect(() => {
    const token = authService.getToken();
    const authData = localStorage.getItem("authData");

    if (token || authData) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  // API Base URL
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get headers function
  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setErrors({});
    setSuccess("");

    // Basic client-side validation
    const newErrors = {};
    if (!username.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      newErrors.email = "Email format is invalid";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: username,
        password: password,
      });

      console.log("Login response:", response.data);

      const { accessToken, refreshToken, profile } = response.data;

      if (accessToken && refreshToken && profile) {
        // Lưu token + profile
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user_profile", JSON.stringify(profile));

        // Lấy role từ profile
        const rolesUpper = (profile.role || profile.roles || []).map((r) =>
          String(r).toUpperCase()
        );
        const canAdmin =
          rolesUpper.includes("ADMIN") || rolesUpper.includes("STAFF");

        if (canAdmin) {
          // chuyển NGAY, không setTimeout
          navigate("/admin", { replace: true });
        } else {
          setError("You don't have permission to access Admin Dashboard");
        }

        
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrors({ 
          password: "Invalid email or password"
        });
      } else if (error.response?.status === 404) {
        setErrors({ 
          email: "Email not found"
        });
      } else if (error.response?.status === 400) {
        const backendErrors = error.response?.data?.errors;
        if (backendErrors) {
          setErrors(backendErrors);
        } else {
          setError(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
      } else {
        setError(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            {/* General Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Email</label>
              <div className="input-container">
                <input
                  type="email"
                  id="username"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className={errors.email ? "error" : ""}
                />
                <span className="input-icon">👤</span>
              </div>
              {errors.email && (
                <p className="field-error">{errors.email}</p>
              )}
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
                  className={errors.password ? "error" : ""}
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
              {errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                "Log In →"
              )}
            </button>
          </form>

          <div className="signup-section">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign Up
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

export default Login;
