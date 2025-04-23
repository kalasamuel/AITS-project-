import React, { useState } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import './DashboardLayout.css';

function DashboardLayout({ children, profilePic }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dashboard-layout">
      <NavBar profilePic={profilePic} toggleSidebar={toggleSidebar} />
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`content ${isOpen ? 'sidebar-open' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;