import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

function NavBar({ setIsAuthenticated, profilePic }) {
    const navigate = useNavigate();

    

    const handleLogout = () => {
        setIsAuthenticated(false); 
        navigate('/welcome'); 
    };` `

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <h1 className="aits">ACADEMIC ISSUE TRACKING SYSTEM</h1>
            </div>
            <div className="navbar-profile">
            {profilePic ? (
          <img src={profilePic} alt="Profile" className="navbar-img" />
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