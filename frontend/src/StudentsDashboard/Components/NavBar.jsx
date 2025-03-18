import React from 'react';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function NavBar({ setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleProfilePicClick = () => {
        document.getElementById('profile-pic-input').click();
    };

    const handleLogout = () => {
        setIsAuthenticated(false); 
        navigate('/welcome'); 
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <h1 className="aits">ACADEMIC ISSUE TRACKING SYSTEM</h1>
            </div>
            <div className="navbar-profile">
                <FontAwesomeIcon
                    icon={faUserCircle}
                    className="profile-icon"
                    onClick={handleProfilePicClick}
                />
                <input type="file" id="profile-pic-input" className="file-input" />
                <button className="logout-button" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </nav>
    );
}

export default NavBar;