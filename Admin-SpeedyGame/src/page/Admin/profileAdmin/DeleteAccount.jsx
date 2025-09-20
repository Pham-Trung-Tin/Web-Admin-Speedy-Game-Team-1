import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../../services/authService.js';
import './DeleteAccount.css';

const DeleteAccount = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu để xác nhận');
      return;
    }
    
    if (!confirmChecked) {
      setError('Bạn phải xác nhận đã hiểu về việc xóa tài khoản');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call delete account API
      await AuthService.deleteAccount({ password });
      
      // Clear local storage
      AuthService.logout();
      
      // Success callback
      if (onSuccess) {
        onSuccess('Tài khoản đã được xóa thành công');
      }
      
      // Navigate to login page
      navigate('/login');
      
    } catch (err) {
      console.error('Delete account error:', err);
      
      if (err.status === 401) {
        setError('Mật khẩu không chính xác');
      } else if (err.status === 400) {
        setError(err.message || 'Dữ liệu không hợp lệ');
      } else if (err.status === 500) {
        setError('Lỗi server. Vui lòng thử lại sau');
      } else {
        setError(err.message || 'Có lỗi xảy ra khi xóa tài khoản');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="delete-account-modal" onClick={handleOverlayClick}>
      <div className="delete-account-dialog">
        <button 
          className="delete-account-close"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
        
        <div className="delete-account-header">
          <span className="delete-account-icon">⚠️</span>
          <h2 className="delete-account-title">Xóa Tài Khoản</h2>
          <p className="delete-account-subtitle">
            Hành động này không thể hoàn tác
          </p>
        </div>

        <div className="delete-account-body">
          <div className="delete-account-warning">
            <h4>⚠️ Cảnh báo quan trọng:</h4>
            <ul>
              <li>Tài khoản của bạn sẽ bị xóa vĩnh viễn</li>
              <li>Tất cả dữ liệu cá nhân sẽ bị mất</li>
              <li>Lịch sử game và điểm số sẽ bị xóa</li>
              <li>Không thể khôi phục sau khi xóa</li>
              <li>Bạn sẽ bị đăng xuất khỏi tất cả thiết bị</li>
            </ul>
          </div>

          <form onSubmit={handleDeleteAccount} className="delete-account-form">
            <div className="delete-account-input-group">
              <label htmlFor="password" className="delete-account-label">
                Nhập mật khẩu để xác nhận:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`delete-account-input ${error && !password ? 'error' : ''}`}
                placeholder="Mật khẩu hiện tại"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="delete-account-checkbox-group">
              <input
                id="confirm-delete"
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="delete-account-checkbox"
                disabled={loading}
              />
              <label htmlFor="confirm-delete" className="delete-account-checkbox-label">
                Tôi hiểu rằng việc xóa tài khoản là không thể hoàn tác và tôi sẽ mất 
                tất cả dữ liệu liên quan đến tài khoản này.
              </label>
            </div>

            {error && (
              <div className="delete-account-error">
                <span>❌</span>
                {error}
              </div>
            )}

            <div className="delete-account-actions">
              <button
                type="button"
                className="delete-account-btn delete-account-btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="delete-account-btn delete-account-btn-delete"
                disabled={loading || !password || !confirmChecked}
              >
                {loading ? (
                  <div className="delete-account-loading">
                    <div className="delete-account-spinner"></div>
                    Đang xóa...
                  </div>
                ) : (
                  '🗑️ Xóa Tài Khoản'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;