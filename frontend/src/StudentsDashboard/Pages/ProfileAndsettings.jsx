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

        const response = await apiClient.post(
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

  const handleBioDataChange = (e) => {
    const { name, value } = e.target;
    setBioData({ ...bioData, [name]: value });
  };

  const handleSaveBioData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await apiClient.put(
        "/accounts/profile/update/",
        {
          first_name: bioData.first_name,
          last_name: bioData.last_name,
          institutional_email: bioData.email,
          student_number: bioData.student_number,
          program: bioData.program,
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
    }
  };

  const handlePasswordsChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("Passwords do not match!");
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
        <label>First Name</label>
        <input type="text" name="first_name" value={bioData.first_name} onChange={handleBioDataChange} />
        <label>Last Name</label>
        <input type="text" name="last_name" value={bioData.last_name} onChange={handleBioDataChange} />
        <label>Email</label>
        <input type="email" name="email" value={bioData.email} onChange={handleBioDataChange} />
        <label>Student Number</label>
        <input type="text" name="student_number" value={bioData.student_number} onChange={handleBioDataChange} />
        <label>Program</label>
        <input type="text" name="program" value={bioData.program} onChange={handleBioDataChange} />
        <button className="save-btn" onClick={handleSaveBioData}>Save</button>
      </div>

      <div className="change-password">
        <h2>Change Password</h2>
        <label>Current Password</label>
        <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordsChange} />
        <label>New Password</label>
        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordsChange} />
        <label>Confirm New Password</label>
        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordsChange} />
        <button className="change-btn" onClick={handleChangePassword}>Change Password</button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ProfileAndSettings;