import React, { useState, useEffect } from "react";
import { apiClient } from "../../api";
import "./RegistrarProfileAndSettings.css";

const ProfileAndSettings = ({ profilePic, setProfilePic }) => {
  const [bioData, setBioData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await apiClient.get("/accounts/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data;
        setBioData({
          name: `${user.first_name} ${user.last_name}`,
          email: user.institutional_email,
          registrationNumber: user.registration_number || "",
        });
      } catch (error) {
        console.error("Failed to fetch registrar profile:", error);
        setErrorMessage("Failed to load profile. Please try again later.");
      }
    };
    fetchProfile();
  }, []);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("profile_picture", file);

        await apiClient.post("/accounts/profile/upload-picture/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setProfilePic(URL.createObjectURL(file));
        setSuccessMessage("Profile picture updated successfully!");
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        setErrorMessage("Failed to upload profile picture. Please try again.");
        setSuccessMessage("");
      }
    } else {
      setErrorMessage("No file selected or invalid file.");
    }
  };

  const handleBioDataChange = (e) => {
    const { name, value } = e.target;
    setBioData({ ...bioData, [name]: value });
  };

  const handlePasswordsChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSaveBioData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await apiClient.put("/accounts/profile/update/", {
        first_name: bioData.name.split(" ")[0],
        last_name: bioData.name.split(" ")[1],
        institutional_email: bioData.email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Bio data saved successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to save bio data:", error);
      setErrorMessage("Failed to save bio data. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword) {
      setErrorMessage("Current password is required!");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await apiClient.post("/accounts/change-password/", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Password changed successfully!");
      setErrorMessage("");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
      setErrorMessage("Failed to change password. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile and Settings</h1>
      <div className="profile-pic-section">
        <label htmlFor="profile-pic-input" className="profile-pic">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-img" />
          ) : (
            <span className="placeholder">Click to upload</span>
          )}
        </label>
        <input
          id="profile-pic-input"
          name="profilePic"
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="bio-data">
        <h2>Bio Data</h2>
        <label>Name</label>
        <input type="text" name="name" value={bioData.name} onChange={handleBioDataChange} />
        <label>Email</label>
        <input type="email" name="email" value={bioData.email} onChange={handleBioDataChange} />
        <button className="save-btn" onClick={handleSaveBioData} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className="change-password">
        <h2>Change Password</h2>
        <label>Current Password</label>
        <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordsChange} />
        <label>New Password</label>
        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordsChange} />
        <label>Confirm New Password</label>
        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordsChange} />
        <button className="change-btn" onClick={handleChangePassword} disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ProfileAndSettings;