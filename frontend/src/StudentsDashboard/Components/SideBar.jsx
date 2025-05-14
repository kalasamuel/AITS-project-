import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';
import { MdHome, MdAssignment, MdDetails, MdNotifications, MdSettings, MdDashboard, MdTaskAlt, MdCheckCircleOutline } from 'react-icons/md';

function SideBar({ isOpen, toggleSidebar }) {
  const userRole = localStorage.getItem('user_role');

  // Critical fix for production environment
  useEffect(() => {
    // Add class to identify production environment
    if (window.location.hostname !== 'localhost') {
      document.body.classList.add('production');
    }
    
    // Ensure the close button works by adding a direct event listener
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
      // Force remove and re-add event listener to prevent stale closures
      const newCloseButton = closeButton.cloneNode(true);
      if (closeButton.parentNode) {
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);
        newCloseButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSidebar();
        });
      }
    }
    
    return () => {
      // Clean up if needed
      if (window.location.hostname !== 'localhost') {
        document.body.classList.remove('production');
      }
    };
  }, [toggleSidebar]); // Re-run when toggleSidebar changes

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Use inline onClick as a backup in case the useEffect approach doesn't work */}
      <button
        className="close-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSidebar();
        }}
        aria-label="Close Sidebar"
      >
        &times;
      </button>
      <div className="sidebar-links">
        {userRole === 'student' && (
          <>
            <NavLink to="/student/home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdHome className="nav-icon" /> HOME
            </NavLink>
            <NavLink to="/student/issuesubmission" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdAssignment className="nav-icon" /> ISSUE SUBMISSION
            </NavLink>
            <NavLink to="/student/issuedetails" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdDetails className="nav-icon" /> ISSUE DETAILS
            </NavLink>
            <NavLink to="/student/notifications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdNotifications className="nav-icon" /> NOTIFICATIONS
            </NavLink>
            <NavLink to="/student/profileandsettings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdSettings className="nav-icon" /> PROFILE & SETTINGS
            </NavLink>
          </>
        )}
        {/* Other role sections remain unchanged */}
        {userRole === 'lecturer' && (
          /* Your lecturer navigation links here */
          <>
            <NavLink to="/lecturer/home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdDashboard className="nav-icon" /> DASHBOARD
            </NavLink>
            <NavLink to="/lecturer/assigned-issues" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdTaskAlt className="nav-icon" /> ASSIGNED ISSUES
            </NavLink>
            <NavLink to="/lecturer/resolved-issues" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdCheckCircleOutline className="nav-icon" /> RESOLVED ISSUES
            </NavLink>
            <NavLink to="/lecturer/notifications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdNotifications className="nav-icon" /> NOTIFICATIONS
            </NavLink>
            <NavLink to="/lecturer/profile-and-settings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdSettings className="nav-icon" /> PROFILE & SETTINGS
            </NavLink>
          </>
        )}
        {userRole === 'registrar' && (
          /* Your registrar navigation links here */
          <>
            <NavLink to="/registrar/home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdDashboard className="nav-icon" /> DASHBOARD
            </NavLink>
            <NavLink to="/registrar/assignment" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdAssignment className="nav-icon" /> ASSIGNMENT
            </NavLink>
            <NavLink to="/registrar/assigned" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdTaskAlt className="nav-icon" /> ASSIGNED
            </NavLink>
            <NavLink to="/registrar/resolved-issues" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdCheckCircleOutline className="nav-icon" /> RESOLVED ISSUES
            </NavLink>
            <NavLink to="/registrar/profile-and-settings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MdSettings className="nav-icon" /> PROFILE & SETTINGS
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default SideBar;