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
      // Redirect or show an error if email is not provided
      setError('Email not found in the URL.');
      // Optionally, you can redirect the user back to the signup page
      // navigate('/signup');
    }
  }, [location]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage(data.message || "OTP Verified Successfully! Redirecting...");
        setTimeout(() => navigate('/'), 3000);
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
