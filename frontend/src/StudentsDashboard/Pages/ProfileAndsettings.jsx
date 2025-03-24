import React, { useState } from "react";
import "./ProfileAndSettings.css";

const ProfileAndSettings = () => {
  const [profilePic, setProfilePic] = useState(null);
  const uniqueId = `profile-pic-input-${Math.random().toString(36).substr(2, 9)}`;
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    } else {
      console.error("No file selected or invalid file.");
    }}
    const [bioData, setBioData] = useState({
      name: 'John Doe',
      email: 'john.doe@example.com',
      program: 'Computer Science',
      registrationNumber: '123456789'
    });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
   
  
    const handleBioDataChange = (e) => {
      const { name, value } = e.target;
      setBioData({ ...bioData, [name]: value });
    };
  
    const handlePasswordsChange = (e) => {
      const { name, value } = e.target;
      setPasswords({ ...passwords, [name]: value });
    };
  
    const handleSaveBioData = () => {
      // Save bio data logic
      setSuccessMessage('Bio data saved successfully!');
    };
  
    const handleChangePassword = () => {
      // Change password logic
      if (passwords.newPassword !== passwords.confirmPassword) {
        setErrorMessage('Passwords do not match!');
      } else {
        setErrorMessage('');
        setSuccessMessage('Password changed successfully!');
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
        <label>Student Name</label>
        <input type="text" name="name" value={bioData.name} onChange={handleBioDataChange} />
        <label>Student Email</label>
        <input type="email" name="email" value={bioData.email} onChange={handleBioDataChange} />
        <label>Academic Program</label>
        <input type="text" name="program" value={bioData.program} onChange={handleBioDataChange} />
        <label>Registration Number</label>
        <input type="text" name="registrationNumber" value={bioData.registrationNumber} onChange={handleBioDataChange} />
        <button className="save-btn" onClick={handleSaveBioData}>Save</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ProfileAndSettings;