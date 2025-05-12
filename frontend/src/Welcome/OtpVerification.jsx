import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./OtpVerification.css";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('institutional_email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError('Webmail is missing. Please register again.');
    }
  }, [location]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("https://aits-group-t-3712bf6213e8.herokuapp.com/api/accounts/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage(data.message || "OTP Verified Successfully! Redirecting...");
        setTimeout(() => navigate('/welcome?verified=true'), 3000);
      } else {
        setError(data.error || "Invalid Verification Code. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during verification. Please try again.");
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
            required
          />
        </div>
        <button type="submit" className="verify-button">
          Verify Code
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default OtpVerification;
