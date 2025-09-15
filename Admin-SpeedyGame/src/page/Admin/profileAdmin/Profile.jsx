import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/AuthService";
import "./Profile.css";
import "../Admin.css";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleBackToAdmin = () => {
    navigate("/admin");
  };

  // Fetch /user/me on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await AuthService.getMyProfile();

        // Map BE fields -> UI fields safely
        const mapped = {
          id: data._id || data.id || "",
          username: data.username || "",
          email: data.email || "",
          fullName: data.fullName || data.username || "",
          phone: data.phone || "",
          role:
            (Array.isArray(data.roles) && data.roles[0]) || data.role || "USER",
          department: data.department || "",
          joinDate: data.createdAt || "",
          lastLogin: data.lastLogin || "",
          status: data.status || "active",
          avatar: data.avatar || null,
          bio: data.bio || "",
          location: data.location || "",
          timezone: data.timezone || "UTC+7 (Asia/Ho_Chi_Minh)",
          level: data.level || "",
          totalscore: data.totalscore || 0,
        };

        if (!mounted) return;
        setProfileData(mapped);
        setEditData(mapped);
      } catch (e) {
        if (e.status === 401) return handleLogout();
        setError(e.message || "Không thể tải hồ sơ.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveProfile = async () => {
    if (!editData) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        fullName: editData.fullName,
        email: editData.email,
        phone: editData.phone,
        bio: editData.bio,
        location: editData.location,
        timezone: editData.timezone,
        // Optional: if backend accepts avatar as URL/base64
        ...(typeof editData.avatar === "string"
          ? { avatar: editData.avatar }
          : {}),
      };

      const updated = await AuthService.updateMyProfile(payload);

      const mapped = {
        ...editData,
        fullName: updated.fullName ?? editData.fullName,
        email: updated.email ?? editData.email,
        phone: updated.phone ?? editData.phone,
        bio: updated.bio ?? editData.bio,
        location: updated.location ?? editData.location,
        timezone: updated.timezone ?? editData.timezone,
        avatar: updated.avatar ?? editData.avatar,
      };

      setProfileData(mapped);
      setEditData(mapped);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (e) {
      if (e.status === 401) return handleLogout();
      setError(e.message || "Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({ ...(profileData || {}) });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      await AuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (e) {
      if (e.status === 401) return handleLogout();
      alert(e.message || "Đổi mật khẩu thất bại!");
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Try upload to server first
    try {
      const uploaded = await AuthService.uploadAvatar(file); // { avatar: 'url' } or 'url'
      const avatarUrl = uploaded?.avatar || uploaded;
      setEditData((prev) => ({ ...prev, avatar: avatarUrl }));
    } catch {
      // Fallback: preview base64 (if server upload not available)
      const reader = new FileReader();
      reader.onload = (e) =>
        setEditData((prev) => ({ ...prev, avatar: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  // Mock activity & stats (unchanged)
  const recentActivities = [
    {
      id: 1,
      action: "Tạo phòng game mới",
      target: "Speed Championship",
      time: "2 giờ trước",
      type: "create",
    },
    {
      id: 2,
      action: "Cập nhật thông tin user",
      target: "User #1234",
      time: "4 giờ trước",
      type: "update",
    },
    {
      id: 3,
      action: "Xóa phòng game",
      target: "Old Tournament",
      time: "1 ngày trước",
      type: "delete",
    },
    {
      id: 4,
      action: "Đăng nhập hệ thống",
      target: "Admin Panel",
      time: "2 ngày trước",
      type: "login",
    },
  ];

  const adminStats = [
    { label: "Phòng đã tạo", value: "145", icon: "🏠", color: "blue" },
    { label: "Users đã quản lý", value: "2,847", icon: "👥", color: "green" },
    {
      label: "Sessions đã theo dõi",
      value: "15,692",
      icon: "🎮",
      color: "purple",
    },
    { label: "Ngày làm việc", value: "248", icon: "📅", color: "orange" },
  ];

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Thông tin cá nhân</h3>
        <button
          className={`btn ${isEditing ? "btn-secondary" : "btn-primary"}`}
          onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
          disabled={saving}
        >
          {isEditing ? "❌ Hủy" : "✏️ Chỉnh sửa"}
        </button>
      </div>

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-container">
            {editData?.avatar ? (
              <img
                src={editData.avatar}
                alt="Avatar"
                className="profile-avatar-large"
              />
            ) : (
              <div className="profile-avatar-large placeholder">
                <span>{editData?.fullName?.charAt(0) || "A"}</span>
              </div>
            )}
            {isEditing && (
              <div className="avatar-upload">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  hidden
                />
                <label htmlFor="avatar-upload" className="upload-btn">
                  📷 Đổi ảnh
                </label>
              </div>
            )}
          </div>
          <div className="profile-status">
            <span
              className={`status-indicator ${profileData?.status || "active"}`}
            ></span>
            <span className="status-text">
              {(profileData?.status || "active") === "active"
                ? "Đang hoạt động"
                : "Không hoạt động"}
            </span>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-group">
            <label>Username</label>
            {isEditing ? (
              <input
                type="text"
                value={editData?.username || ""}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
                className="form-input"
              />
            ) : (
              <span className="info-value">{profileData?.username}</span>
            )}
          </div>

          <div className="info-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editData?.email || ""}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="form-input"
              />
            ) : (
              <span className="info-value">{profileData?.email}</span>
            )}
          </div>

          <div className="info-group">
            <label>Level</label>
            <span className="info-value">{profileData?.level}</span>
          </div>

          <div className="info-group">
            <label>Role</label>
            <span className="info-value">
              <span className="role-badge admin">{profileData?.role}</span>
            </span>
          </div>
        </div>

        <div className="bio-section">
          <label>Giới thiệu</label>
          {isEditing ? (
            <textarea
              value={editData?.bio || ""}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              className="form-textarea"
              rows="4"
              placeholder="Viết vài dòng giới thiệu về bản thân..."
            />
          ) : (
            <p className="bio-text">{profileData?.bio}</p>
          )}
        </div>

        {isEditing && (
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              ❌ Hủy bỏ
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Cài đặt tài khoản</h3>
      </div>
      <div className="settings-content">
        <div className="settings-group">
          <h4>Bảo mật</h4>
          <div className="setting-item">
            <div className="setting-info">
              <strong>Mật khẩu</strong>
              <p>Cập nhật mật khẩu để bảo mật tài khoản</p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              🔐 Đổi mật khẩu
            </button>
          </div>
          {showChangePassword && (
            <div className="password-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                >
                  ✅ Xác nhận
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowChangePassword(false)}
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-group">
          <h4>Thông tin hệ thống</h4>
          <div className="system-info">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{profileData?.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày tham gia:</span>
              <span className="info-value">
                {profileData?.joinDate
                  ? new Date(profileData.joinDate).toLocaleDateString("vi-VN")
                  : "--"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Lần đăng nhập cuối:</span>
              <span className="info-value">
                {profileData?.lastLogin || "--"}
              </span>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h4>Thống kê hoạt động</h4>
          <div className="stats-grid">
            {adminStats.map((stat, idx) => (
              <div key={idx} className={`stat-card ${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Hoạt động gần đây</h3>
        <button className="btn btn-secondary">📊 Xem báo cáo chi tiết</button>
      </div>
      <div className="activity-content">
        <div className="activity-timeline">
          {recentActivities.map((a) => (
            <div key={a.id} className="timeline-item">
              <div className={`timeline-icon ${a.type}`}>
                {a.type === "create"
                  ? "➕"
                  : a.type === "update"
                  ? "✏️"
                  : a.type === "delete"
                  ? "🗑️"
                  : "🔐"}
              </div>
              <div className="timeline-content">
                <div className="activity-title">{a.action}</div>
                <div className="activity-target">{a.target}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="activity-summary">
          <h4>Tóm tắt hoạt động hôm nay</h4>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-value">12</span>
              <span className="summary-label">Thao tác thực hiện</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">3</span>
              <span className="summary-label">Phòng game tạo mới</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">8</span>
              <span className="summary-label">Users được quản lý</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">2h 45m</span>
              <span className="summary-label">Thời gian online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Đang tải hồ sơ…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="admin-container">
        <div className="error">
          <p>⚠️ {error}</p>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Speedy Clicker</span>
          </div>
        </div>

        <div className="header-right">
          <button className="btn btn-secondary" onClick={handleBackToAdmin}>
            ← Quay lại Admin
          </button>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>

          <div className="header-icons">
            <button className="icon-btn">🔔</button>
          </div>

          <div
            className="admin-profile"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="profile-avatar">
              <span>
                {(profileData?.fullName || "A").slice(0, 2).toUpperCase()}
              </span>
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowProfileDropdown(false);
                  }}
                >
                  👤 Profile
                </div>
                <div className="dropdown-item">⚙️ Settings</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="profile-page-layout">
        <main className="main-content">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-title-section">
                <h1 className="profile-title">Hồ sơ Admin</h1>
                <p className="profile-subtitle">
                  Quản lý thông tin cá nhân và cài đặt tài khoản
                </p>
              </div>
            </div>

            <div className="profile-nav">
              <button
                className={`nav-btn ${
                  activeSection === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveSection("personal")}
              >
                👤 Thông tin cá nhân
              </button>
              <button
                className={`nav-btn ${
                  activeSection === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveSection("settings")}
              >
                ⚙️ Cài đặt
              </button>
              <button
                className={`nav-btn ${
                  activeSection === "activity" ? "active" : ""
                }`}
                onClick={() => setActiveSection("activity")}
              >
                📊 Hoạt động
              </button>
            </div>

            <div className="profile-content-wrapper">
              {activeSection === "personal" && renderPersonalInfo()}
              {activeSection === "settings" && renderSettings()}
              {activeSection === "activity" && renderActivity()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
