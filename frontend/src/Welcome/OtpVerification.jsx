import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./OtpVerification.css";
import { BACKEND_URL } from '../config';

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('institutional_email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError('Webmail is missing. Please register again.');
    }
  }, [location]);

  // Handle OTP verification form submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/accounts/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, otp}),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        data = { error: "Failed to parse server response" };
      }

      if (response.ok) {
        setMessage(data.message || "OTP Verified Successfully! Redirecting...");
        // Store verification status in localStorage or context if needed
        localStorage.setItem('isVerified', 'true');
        setTimeout(() => navigate('/welcome?verified=true'), 3000);
      } else {
        setError(data.error || "Invalid Verification Code. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Email Verification</h2>
      <p>A verification code has been sent to your Webmail: <b>{email}</b></p>

      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label>Enter Verification Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            placeholder="Enter 6-digit code"
            required
          />
        </div>
        <button
          type="submit"
          className="verify-button"
          disabled={isSubmitting || !otp}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default OtpVerification;