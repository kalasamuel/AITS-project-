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
    <div className="profile-outer-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">Profile & Settings</h1>
        {loading ? (
          <div className="profile-loading">Loading...</div>
        ) : (
          <>
            <section className="profile-pic-section">
              <label htmlFor="profile-pic-input" className="profile-pic-label" tabIndex={0}>
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="profile-img" />
                ) : (
                  <span className="profile-placeholder">Click to upload</span>
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
            </section>

            <form className="bio-data-form" autoComplete="off">
              <h2>Bio Data</h2>
              <div className="form-row">
                <label htmlFor="first_name">First Name</label>
                <input type="text" id="first_name" name="first_name" value={bioData.first_name} readOnly tabIndex={-1} />
              </div>
              <div className="form-row">
                <label htmlFor="last_name">Last Name</label>
                <input type="text" id="last_name" name="last_name" value={bioData.last_name} readOnly tabIndex={-1} />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={bioData.email} readOnly tabIndex={-1} />
              </div>
              <div className="form-row">
                <label htmlFor="student_number">Student Number</label>
                <input type="text" id="student_number" name="student_number" value={bioData.student_number} readOnly tabIndex={-1} />
              </div>
              <div className="form-row">
                <label htmlFor="program">Program</label>
                <input type="text" id="program" name="program" value={bioData.program} readOnly tabIndex={-1} />
              </div>
            </form>

            <form className="change-password-form" onSubmit={handleChangePassword} autoComplete="off">
              <h2>Change Password</h2>
              <div className="form-row">
                <label htmlFor="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordsChange} />
              </div>
              <div className="form-row">
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={passwords.newPassword} onChange={handlePasswordsChange} />
              </div>
              <div className="form-row">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordsChange} />
              </div>
              <button className="change-btn" type="submit">Change Password</button>
            </form>

            {(successMessage || errorMessage) && (
              <div className="profile-messages">
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileAndSettings;