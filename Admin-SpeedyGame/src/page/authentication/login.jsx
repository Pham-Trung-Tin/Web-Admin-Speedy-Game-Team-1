import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { authService } from "../../services/AuthService";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
    setSuccess("");

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
          alert("Bạn không có quyền truy cập Admin Leaderboard");
          // nếu trang login đang ở '/', đừng navigate('/') nữa vì trông như không chuyển
          // navigate('/'); // <- bỏ nếu login page đã là '/'
        }

        
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Đăng nhập thất bại");
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
            {/* Error Message */}
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
  );
};

export default Login;
