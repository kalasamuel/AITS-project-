import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpVerification.css";

const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(
    localStorage.getItem("otp") || ""
  );
  const navigate = useNavigate();

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      alert("OTP Verified Successfully!");
      localStorage.removeItem("otp");
      navigate("/"); 
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>An OTP has been sent to your email: {email}</p>
      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="verify-button">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;