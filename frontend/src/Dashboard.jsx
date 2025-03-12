import React from 'react'
import {Link} from "react-router-dom";
import "./IssueForm.css";
const Dashboard=()=>{
  return(
    <div className="dashboard">
      <div className='sidebar'>
        <h2>Menu</h2>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/submit">IssueSubmission</Link></li>
          <li><Link to="/details">IssueDetails</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/profile">Profile & Settings</Link></li>
        </ul>
      </div>
      <div className="content">
        <h1>Welcome to the Academic Issue Tracking System</h1>
      </div>
    </div>
  );
};
export default Dashboard;




