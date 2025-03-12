import { useState } from 'react'
import IssueForm from "./IssueForm";
import "./IssueForm.css";



function Dashboard() {
  const [showForm,setShowForm]=useState(false);
  return (
    <div
    className="dashboard-container">
      <nav className="sidebar">
        <h2>Academic Issue Tracking System</h2>
        <ul>
        <li>Dashboard</li>
        <li>Issue Submission </li>
        <li>Issue Details</li>
        <li>Notifications</li>
        <li>Profile and Settings</li>
        </ul>
      </nav>
      <main className="content">
        <header>
          <h3>Student's Dashboard</h3>
          <button onClick={()=> setShowForm(!showForm)}>Submit New Issue</button>
        </header>
        {showForm && <IssueForm/>}
        <section>
          <h4>My Current Issues</h4>
          <ul className="issue-list">
            <li>Issue 1-Pending</li>
            <li>Issue 2-Resolved</li>
            <li>Issue 3-In Progress</li>
          </ul>
        </section>
      </main>
    </div>
  )
  
}

export default Dashboard;
