import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';

function NavBar({ profilePic, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/welcome');
  };

  return (
    <nav className="navbar">
      <button className="hamburger-button" onClick={toggleSidebar}>
        <MdMenu size={24} />
      </button>
      <div className="navbar-content">
        <h1 className="aits">ACADEMIC ISSUE TRACKING SYSTEM</h1>
      </div>
      <div className="navbar-profile">
        {profilePic ? (
          <div className="navbar-img-wrapper">
            <img src={profilePic} alt="Profile" className="navbar-img" />
          </div>
        ) : (
          <span className="navbar-placeholder">No Profile Pic</span>
        )}
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
