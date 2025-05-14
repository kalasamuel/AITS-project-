import React, { useState, useEffect } from "react";
import { apiClient } from "../../api";
import "./LecturerProfileAndSettings.css";

const ProfileAndSettings = ({ profilePic, setProfilePic }) => {
  const [bioData, setBioData] = useState({
    name: "",
    email: "",
    LecturerID: ""
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const uniqueId = `profile-pic-input-${Math.random().toString(36).substr(2, 9)}`;

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
          LecturerID: user.lecturer_id || "Not Set",
        });
        setProfilePic(user.profile_picture || null);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setErrorMessage("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
    // eslint-disable-next-line
  }, [setProfilePic]);

  // Profile picture upload
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

  // Handle bio data change
  const handleBioDataChange = (e) => {
    const { name, value } = e.target;
    setBioData({ ...bioData, [name]: value });
  };

  // Save bio data
  const handleSaveBioData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await apiClient.put(
        "/accounts/profile/update/",
        {
          first_name: bioData.name.split(" ")[0],
          last_name: bioData.name.split(" ")[1] || "",
          institutional_email: bioData.email,
          lecturer_id: bioData.LecturerID,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  // Handle password input change
  const handlePasswordsChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await apiClient.post(
        "/accounts/change-password/",
        {
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        <label htmlFor={uniqueId} className="profile-pic">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-img" />
          ) : (
            <span className="placeholder">Click to upload</span>
          )}
        </label>
        <input
          id={uniqueId}
          name="profilePic"
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="bio-data">
        <h2>Bio Data</h2>
        <label>Lecturer Name</label>
        <input type="text" name="name" value={bioData.name} onChange={handleBioDataChange} />
        <label>Lecturer Email</label>
        <input type="email" name="email" value={bioData.email} onChange={handleBioDataChange} />
        <label>Staff Number</label>
        <input type="text" name="LecturerID" value={bioData.LecturerID} onChange={handleBioDataChange} />
        <button className="save-btn" onClick={handleSaveBioData} disabled={loading}>Save</button>
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
        <button className="change-btn" onClick={handleChangePassword} disabled={loading}>Change Password</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ProfileAndSettings;