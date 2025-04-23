import React, { useEffect, useState, useRef } from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import axios from 'axios';

function NavBar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/accounts/profile-picture/', {
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

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/profile/upload-picture/', formData, {
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

  return (
    <nav className="navbar">
      <button className="hamburger-button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <MdMenu size={24} />
      </button>

      <div className="navbar-content">
        <h1 className="aits">ACADEMIC ISSUE TRACKING SYSTEM</h1>
      </div>

      <div className="navbar-profile">
        <label htmlFor="profile-upload" className="navbar-img-wrapper" title="Click to change profile picture">
          <img
            src={profilePic || "/path/to/default-placeholder.png"}
            alt="Profile"
            className="navbar-img"
            onClick={() => fileInputRef.current.click()}
          />
        </label>
        <input
          id="profile-upload"
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleProfilePicUpload}
        />

        <button className="logout-button" onClick={handleLogout} aria-label="Log Out">
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
