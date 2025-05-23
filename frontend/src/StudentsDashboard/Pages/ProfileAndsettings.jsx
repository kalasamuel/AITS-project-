import React, { useState, useEffect } from "react";
import { apiClient } from "../../api";
import "./ProfileAndsettings.css";

const ProfileAndSettings = ({ profilePic, setProfilePic }) => {
  const [bioData, setBioData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    student_number: "",
    program: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await apiClient.get("/accounts/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setBioData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.institutional_email || "",
          student_number: user.student_number || "",
          program: user.program || "",
        });
        setProfilePic(user.profile_picture || null);
      } catch (error) {
        console.error("Failed to fetch student profile:", error);
        setErrorMessage("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setProfilePic]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("profile_picture", file);

        await apiClient.post(
          "/accounts/profile/upload-picture/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setProfilePic(URL.createObjectURL(file));
        setSuccessMessage("Profile picture updated successfully!");
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        setErrorMessage("Failed to upload profile picture. Please try again.");
        setSuccessMessage("");
      }
    }
  };

  const handlePasswordsChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setSuccessMessage("");
      return;
    }

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
          "Content-Type": "multipart/form-data",
        }
      );
      setSuccessMessage("Password changed successfully!");
      setErrorMessage("");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
      setErrorMessage("Failed to change password. Please try again.");
      setSuccessMessage("");
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
            <div className="profile-meta-label">Student Number</div>
            <div className="profile-meta-value">{bioData.student_number || "N/A"}</div>
          </div>
          <div className="profile-meta">
            <div className="profile-meta-label">Program</div>
            <div className="profile-meta-value">{bioData.program || "N/A"}</div>
          </div>
        </div>
        <div className="profile-forms">
          <div className="bio-data-modern">
            <h2>Bio Data</h2>
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={bioData.first_name}
                readOnly
                style={{ background: "#f0f2f5", color: "#888", cursor: "not-allowed" }}
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={bioData.last_name}
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
                readOnly
                style={{ background: "#f0f2f5", color: "#888", cursor: "not-allowed" }}
              />
            </div>
          </div>
          <div className="change-password-modern">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword} autoComplete="off">
              <div className="input-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordsChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordsChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordsChange}
                  required
                />
              </div>
              <button className="change-btn-modern" type="submit">
                Change Password
              </button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAndSettings;