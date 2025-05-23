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
    <div className="profile-container-modern">
      <h1 className="profile-title">Profile & Settings</h1>
      <div className="profile-card">
        <div className="profile-pic-section-modern">
          <label htmlFor="profile-pic-input" className="profile-pic-modern" title="Click to upload">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-img-modern" />
            ) : (
              <span className="placeholder-modern">Upload Photo</span>
            )}
            <div className="profile-pic-overlay">Change</div>
          </label>
          <input
            id="profile-pic-input"
            name="profilePic"
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
          <div className="profile-meta">
            <div className="profile-meta-label">Registration No.</div>
            <div className="profile-meta-value">{bioData.registrationNumber || "N/A"}</div>
          </div>
        </div>
        <div className="profile-forms">
          <div className="bio-data-modern">
            <h2>Bio Data</h2>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={bioData.name}
                readOnly
                style={{ background: "#f0f2f5", color: "#888", cursor: "not-allowed" }}
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={bioData.email}
                onChange={handleBioDataChange}
              />
            </div>
            <button className="save-btn-modern" onClick={handleSaveBioData} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <div className="change-password-modern">
            <h2>Change Password</h2>
            <div className="input-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordsChange} />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordsChange} />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordsChange} />
            </div>
            <button className="change-btn-modern" onClick={handleChangePassword} disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAndSettings;