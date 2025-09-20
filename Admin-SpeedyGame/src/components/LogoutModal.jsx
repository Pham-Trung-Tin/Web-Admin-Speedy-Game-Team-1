import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onCancel, onLogoutCurrent, onLogoutAll, isLoading = false, loadingType = null }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="logout-modal-overlay" onClick={handleOverlayClick}>
      <div className="logout-modal">
        <div className="logout-modal-header">
          <h3>Logout Confirmation</h3>
        </div>
        
        <div className="logout-modal-body">
          <div className="logout-modal-icon">
            <span>🚪</span>
          </div>
          <p>Choose your logout option:</p>
        </div>
        
        <div className="logout-modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={onLogoutCurrent}
            disabled={isLoading}
          >
            {isLoading && loadingType === 'current' ? (
              <>
                <span className="loading-spinner"></span>
                Logging out...
              </>
            ) : (
              'Logout Current Device'
            )}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onLogoutAll}
            disabled={isLoading}
          >
            {isLoading && loadingType === 'all' ? (
              <>
                <span className="loading-spinner"></span>
                Logging out...
              </>
            ) : (
              'Logout All Devices'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;