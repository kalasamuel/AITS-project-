import React, { useEffect, useRef } from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import { apiClient } from "../../api";
import { FiLogOut, FiCamera } from 'react-icons/fi';
import logo from '../../assets/logo.png';

function NavBar({ toggleSidebar, profilePic, setProfilePic }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchProfilePicture = async () => {
    try {
      const response = await apiClient.get('/accounts/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setProfilePic(response.data.profile_picture);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePic(null);
    }
  };

  // Upload new profile picture and refresh everywhere
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await apiClient.post('/accounts/profile/upload-picture/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      fetchProfilePicture();  // refreshes image after upload
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.clear();
      navigate('/welcome');
    }
  };

  const handleImgError = (e) => {
    e.target.src = "/path/to/default-placeholder.png";
  };

  return (
    <nav className="navbar modern-navbar">
      <div className="navbar-section navbar-left">
        <button className="hamburger-button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <MdMenu size={28} />
        </button>
        <img
          src={logo}
          alt="AITS Logo"
          className="navbar-logo"
          style={{ height: "38px", width: "auto", marginLeft: "8px" }}
        />
      </div>

      <div className="navbar-section navbar-center">
        <h1 className="navbar-title">Academic Issue Tracking System</h1>
      </div>

      <div className="navbar-section navbar-right">
        <div className="navbar-profile-group">
          <div className="navbar-img-wrapper" title="Change profile picture">
            <img
              src={profilePic || "/path/to/default-placeholder.png"}
              alt="Profile"
              className="navbar-img"
              onClick={() => fileInputRef.current.click()}
              onError={handleImgError}
            />
            <span className="profile-camera-icon" onClick={() => fileInputRef.current.click()}>
              <FiCamera size={18} />
            </span>
          </div>
          <input
            id="profile-upload"
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleProfilePicUpload}
          />
        </div>
        <button className="logout-button" onClick={handleLogout} aria-label="Log Out">
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;