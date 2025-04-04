import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import './SideBar.css';

function SideBar() {
    const [active, setActive] = useState(null);

    const handleSetActive = (index) => {
        setActive(index);
    };

    const links = [
        { name: "DASHBOARD", path: "/" },
        { name: "ASSIGNED ISSUES", path: "/issuesubmission" },
        { name: "RESOLVED ISSUES", path: "/issuedetails" },
        { name: "NOTIFICATIONS", path: "/notifications" },
        { name: "PROFILE & SETTINGS", path: "/profileandsettings" }
    ];

    return (
        <nav className="sidebar">
            <div className="sidebar-links">
                {links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={`nav-link ${active === index ? "active" : ""}`}
                        onClick={() => handleSetActive(index)}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default SideBar;
//side bar//
