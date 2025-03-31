import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

function SideBar({ userType }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-links">
        {userType === "student" && (
          <>
            <NavLink to="/student/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              HOME
            </NavLink>
            <NavLink to="/student/issuesubmission" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              ISSUE SUBMISSION
            </NavLink>
            <NavLink to="/student/issuedetails" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              ISSUE DETAILS
            </NavLink>
            <NavLink to="/student/notifications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              NOTIFICATIONS
            </NavLink>
            <NavLink to="/student/profileandsettings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              PROFILE & SETTINGS
            </NavLink>
          </>
        )}
        {userType === "lecturer" && (
          <>
            <NavLink to="/lecturer/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              DASHBOARD
            </NavLink>
            <NavLink to="/lecturer/assigned-issues" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              ASSIGNED ISSUES
            </NavLink>
            <NavLink to="/lecturer/resolved-issues" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              RESOLVED ISSUES
            </NavLink>
            <NavLink to="/lecturer/notifications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              NOTIFICATIONS
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default SideBar;
