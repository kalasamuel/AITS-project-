import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

function SideBar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          HOME
        </NavLink>
        <NavLink
          to="/issuesubmission"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          ISSUE SUBMISSION
        </NavLink>
        <NavLink
          to="/issuedetails"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          ISSUE DETAILS
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          NOTIFICATIONS
        </NavLink>
        <NavLink
          to="/profileandsettings"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          PROFILE & SETTINGS
        </NavLink>
      </div>
    </nav>
  );
}

export default SideBar;