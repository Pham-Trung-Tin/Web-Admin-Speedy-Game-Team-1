import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authService.js";
import GameHistory from "../gameHistory/GameHistory";
import GameRoomUser from "../gameRoomUser/GameRoomUser";
import ChangePassword from "./ChangePassword.jsx";
import DeleteAccount from "./DeleteAccount.jsx";
import LogoutModal from "../../../components/LogoutModal";
import "./Profile.css";
import "../Admin.css";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutType, setLogoutType] = useState(null); // 'current' or 'all'
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowProfileDropdown(false);
    setShowLogoutModal(true);
  };

  const handleLogoutCurrent = async () => {
    setIsLoggingOut(true);
    setLogoutType('current');
    try {
      // Gọi API logout từ thiết bị hiện tại
      await AuthService.logout();
      
      // Redirect về trang login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Dù có lỗi vẫn redirect để đảm bảo user được logout
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
      setLogoutType(null);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    setLogoutType('all');
    try {
      // Gọi API logout từ tất cả thiết bị
      await AuthService.logoutAll();
      
      // Redirect về trang login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout all error:", error);
      // Dù có lỗi vẫn redirect để đảm bảo user được logout
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
      setLogoutType(null);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
    setLogoutType(null);
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
      // chỉ backend hỗ trợ: bio + avatar (file). Các field khác giữ nguyên tại UI.
      const updated = await AuthService.updateProfileMultipart({
        bio: editData.bio ?? "",
        avatarFile, // null nếu không đổi ảnh
      });

      console.log("Updated response:", updated); // Debug log

      // Fetch lại profile để có avatar URL mới nhất
      const freshProfile = await AuthService.getMyProfile();
      console.log("Fresh profile:", freshProfile); // Debug log

      const mapped = {
        id: freshProfile._id || freshProfile.id || profileData.id,
        username: freshProfile.username || profileData.username,
        email: freshProfile.email || profileData.email,
        fullName:
          freshProfile.fullName ||
          freshProfile.username ||
          profileData.fullName,
        phone: freshProfile.phone || profileData.phone,
        role:
          (Array.isArray(freshProfile.roles) && freshProfile.roles[0]) ||
          freshProfile.role ||
          profileData.role,
        department: freshProfile.department || profileData.department,
        joinDate: freshProfile.createdAt || profileData.joinDate,
        lastLogin: freshProfile.lastLogin || profileData.lastLogin,
        status: freshProfile.status || profileData.status,
        avatar: freshProfile.avatar || profileData.avatar, // Dùng avatar mới từ server
        bio: freshProfile.bio || profileData.bio,
        location: freshProfile.location || profileData.location,
        timezone: freshProfile.timezone || profileData.timezone,
        level: freshProfile.level || profileData.level,
        totalscore: freshProfile.totalscore || profileData.totalscore,
      };

      console.log("Mapped data:", mapped); // Debug log

      setProfileData(mapped);
      setEditData(mapped);
      setAvatarFile(null); // reset file sau khi lưu
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (e) {
      console.error("Save error:", e); // Debug log
      if (e.status === 401) return handleLogout();
      setError(e.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({ ...(profileData || {}) });
    setIsEditing(false);
  };

  const handlePasswordChangeSuccess = (message) => {
    setSuccessMessage(message);
    // Auto hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  // const handleChangePassword = async () => {
  //   if (passwordData.newPassword !== passwordData.confirmPassword) {
  //     alert("Mật khẩu xác nhận không khớp!");
  //     return;
  //   }
  //   if (passwordData.newPassword.length < 6) {
  //     alert("Mật khẩu phải có ít nhất 6 ký tự!");
  //     return;
  //   }
  //   try {
  //     await AuthService.changePassword({
  //       currentPassword: passwordData.currentPassword,
  //       newPassword: passwordData.newPassword,
  //     });
  //     alert("Đổi mật khẩu thành công!");
  //     setPasswordData({
  //       currentPassword: "",
  //       newPassword: "",
  //       confirmPassword: "",
  //     });
  //     setShowChangePassword(false);
  //   } catch (e) {
  //     if (e.status === 401) return handleLogout();
  //     alert(e.message || "Đổi mật khẩu thất bại!");
  //   }
  // };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file); // lưu file để gửi lên BE
    // preview ngay trên UI
    const reader = new FileReader();
    reader.onload = (e) =>
      setEditData((prev) => ({ ...prev, avatar: e.target.result }));
    reader.readAsDataURL(file);
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
        <h3>Personal Information</h3>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowChangePassword(true)}
          >
           Change Password
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteAccount(true)}
            style={{ 
              backgroundColor: '#ef4444',
              color: 'white',
              border: '1px solid #dc2626'
            }}
          >
           Delete Account
          </button>
          
          <button
            className={`btn ${isEditing ? "btn-secondary" : "btn-primary"}`}
            onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
            disabled={saving}
          >
            {isEditing ? "❌ Cancel" : "✏️ Edit"}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-container">
            {editData?.avatar || profileData?.avatar ? (
              <img
                src={editData?.avatar || profileData?.avatar}
                alt="Avatar"
                className="profile-avatar-large"
                onError={(e) => {
                  console.error("Avatar load error:", e.target.src);
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            {!(editData?.avatar || profileData?.avatar) && (
              <div className="profile-avatar-large placeholder">
                <span>{editData?.fullName?.charAt(0) || "A"}</span>
              </div>
            )}
            {/* Fallback placeholder (hidden by default, shown on image error) */}
            <div
              className="profile-avatar-large placeholder"
              style={{ display: "none" }}
            >
              <span>{editData?.fullName?.charAt(0) || "A"}</span>
            </div>
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
                  📷 Change Avatar
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
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        </div>

        <div className="info-grid info-grid--cards">
          <div className="info-group">
            <label>Username</label>
            <span className="info-value">{profileData?.username}</span>
          </div>

          <div className="info-group">
            <label>Email</label>
            <span className="info-value">{profileData?.email}</span>
          </div>

          <div className="info-group">
            <label>Level</label>
            <span className="info-value">
              <span className="chip chip--level">{profileData?.level}</span>
            </span>
          </div>

          <div className="info-group">
            <label>Role</label>
            <span className="info-value">
              {/* đổi màu theo role nếu thích: chip--warning cho STAFF, chip--primary cho ADMIN */}
              <span
                className={`chip ${
                  String(profileData?.role).toUpperCase() === "STAFF"
                    ? "chip--warning"
                    : "chip--primary"
                }`}
              >
                {profileData?.role}
              </span>
            </span>
          </div>
        </div>

        <div className="bio-section bio--card">
          <label>Introduction</label>
          {isEditing ? (
            <textarea
              value={editData?.bio || ""}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              className="form-textarea"
              rows="4"
              placeholder="Write a few lines introducing yourself..."
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
              {saving ? "Saving..." : "💾 Save Change"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderGameHistory = () => (
    <div className="profile-section">
      <GameHistory />
    </div>
  );

  const renderGameRoom = () => (
    <div className="profile-section">
      <GameRoomUser />
    </div>
  );

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading Profile…</div>
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
            🔄 Retry
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
          <div
            className="logo"
            onClick={() => navigate("/admin")}
            style={{ cursor: "pointer" }}
          >
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Speedy Clicker</span>
          </div>
        </div>

        <div className="header-right">
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
                {/* <div className="dropdown-item">⚙️ Settings</div> */}
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
                <h1 className="profile-title">Admin Profile</h1>
                <p className="profile-subtitle">
                  Manage personal information and account settings
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
                👤 Personal Information
              </button>
              <button
                className={`nav-btn ${
                  activeSection === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveSection("settings")}
              >
                🎮 Game History
              </button>
              <button
                className={`nav-btn ${
                  activeSection === "users" ? "active" : ""
                }`}
                onClick={() => setActiveSection("users")}
              >
                👥 Room Users
              </button>
            </div>

            <div className="profile-content-wrapper">
              {successMessage && (
                <div className="success-alert">
                  <span className="success-icon">✅</span>
                  {successMessage}
                  <button 
                    className="success-close"
                    onClick={() => setSuccessMessage("")}
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {activeSection === "personal" && renderPersonalInfo()}
              {activeSection === "settings" && renderGameHistory()}
              {activeSection === "users" && renderGameRoom()}
              {activeSection === "activity" && renderActivity()}
            </div>
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <DeleteAccount
          onClose={() => setShowDeleteAccount(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setShowDeleteAccount(false);
          }}
        />
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onCancel={handleLogoutCancel}
        onLogoutCurrent={handleLogoutCurrent}
        onLogoutAll={handleLogoutAll}
        isLoading={isLoggingOut}
        loadingType={logoutType}
      />
    </div>
  );
};

export default Profile;
