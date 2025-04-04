import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyAccount = ({ setIsAuthenticated }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUrl = window.location.href;
      const queryString = currentUrl.split("?")[1];
      const queryParams = queryString.split("=");
      const institutional_email = queryParams[1];

      const response = await axios.post("http://127.0.0.1:8000/api/verify/", { code, institutional_email });
      if (response.status === 200) {
        navigate("/");
        setIsAuthenticated(true)
      } else {
        setError("Invalid verification code.");
      }
    } catch (err) {
      console.log(err)
      setError("Error verifying code. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Enter Verification Code</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter Code"
          className="border p-2 rounded w-full"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyAccount;
