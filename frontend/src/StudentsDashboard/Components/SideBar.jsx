import React from 'react';
import { Link } from "react-router-dom";
import './SideBar.css';


function SideBar() {
    return (
        <nav className="sidebar">
            <div className="sidebar-links">
                <Link to="/" className="nav-link">HOME</Link> 
                <Link to="/issuesubmission" className="nav-link">ISSUE SUBMISSION</Link>
                <Link to="/issuedetails" className="nav-link">ISSUE DETAILS</Link>
                <Link to="/notifications" className="nav-link">NOTIFICATIONS</Link>
                <Link to="/profileandsettings" className="nav-link">PROFILE & SETTINGS</Link>
            </div>
        </nav>
    );
}

export default SideBar;