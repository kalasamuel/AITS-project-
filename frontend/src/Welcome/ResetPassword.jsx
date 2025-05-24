import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api';
import './ResetPassword.css'; 

const ResetPassword = () => {
  const { uidb64, token } = useParams(); // Get UID and Token from URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false); // To check initial token validity

  useEffect(() => {
    if (uidb64 && token) {
      setIsValidToken(true);
    } else {
      setError("Invalid password reset link. Please try again.");
      setIsValidToken(false);
    }
  }, [uidb64, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/accounts/password-reset/confirm/', {
        uid: uidb64,
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage(response.data.message + " You can now log in with your new password.");
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data.new_password) {
          setError(`New password error: ${err.response.data.new_password.join(', ')}`);
        } else if (err.response.data.confirm_password) {
          setError(`Confirm password error: ${err.response.data.confirm_password.join(', ')}`);
        } else {
            setError('Failed to reset password. Please check the link or your password.');
        }
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="reset-password-container">
        <h2>Invalid Link</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/forgot-password')} className="back-button">
          Request a new reset link
        </button>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Enter your new password below:</p>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            aria-label="New Password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm New Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            aria-label="Confirm New Password"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;