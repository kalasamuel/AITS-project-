import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";
import {
  MdHome,
  MdAssignment,
  MdDetails,
  MdNotifications,
  MdSettings,
  MdDashboard,
  MdTaskAlt,
  MdCheckCircleOutline,
  MdClose,
} from "react-icons/md";
import logo from "../../assets/logo.png";

function SideBar({ isOpen, toggleSidebar }) {
  const userRole = localStorage.getItem("user_role");

  return (
    <nav className={`sidebar modern-sidebar${isOpen ? " open" : ""}`}>
      <button className="close-button" onClick={toggleSidebar} aria-label="Close Sidebar">
        <MdClose size={28} />
      </button>
      {/* Logo at the top */}
      <div className="sidebar-logo-container">
        <img src={logo} alt="AITS Logo" className="sidebar-logo" />
      </div>
      <div className="sidebar-links">
        {userRole === "student" && (
          <>
            <NavLink to="/student/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdHome className="nav-icon" /> <span>Home</span>
            </NavLink>
            <NavLink to="/student/issuesubmission" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdAssignment className="nav-icon" /> <span>Issue Submission</span>
            </NavLink>
            <NavLink to="/student/issuedetails" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdDetails className="nav-icon" /> <span>Issue Details</span>
            </NavLink>
            <NavLink to="/student/notifications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdNotifications className="nav-icon" /> <span>Notifications</span>
            </NavLink>
            <NavLink to="/student/profileandsettings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdSettings className="nav-icon" /> <span>Profile & Settings</span>
            </NavLink>
          </>
        )}
        {userRole === "lecturer" && (
          <>
            <NavLink to="/lecturer/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdDashboard className="nav-icon" /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/lecturer/assigned-issues" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdTaskAlt className="nav-icon" /> <span>Assigned Issues</span>
            </NavLink>
            <NavLink to="/lecturer/resolved-issues" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdCheckCircleOutline className="nav-icon" /> <span>Resolved Issues</span>
            </NavLink>
            <NavLink to="/lecturer/notifications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdNotifications className="nav-icon" /> <span>Notifications</span>
            </NavLink>
            <NavLink to="/lecturer/profile-and-settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdSettings className="nav-icon" /> <span>Profile & Settings</span>
            </NavLink>
          </>
        )}
        {userRole === "registrar" && (
          <>
            <NavLink to="/registrar/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdDashboard className="nav-icon" /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/registrar/assignment" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdAssignment className="nav-icon" /> <span>Assignment</span>
            </NavLink>
            <NavLink to="/registrar/assigned" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdTaskAlt className="nav-icon" /> <span>Assigned</span>
            </NavLink>
            <NavLink to="/registrar/resolved-issues" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdCheckCircleOutline className="nav-icon" /> <span>Resolved Issues</span>
            </NavLink>
            <NavLink to="/registrar/profile-and-settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdSettings className="nav-icon" /> <span>Profile & Settings</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default SideBar;