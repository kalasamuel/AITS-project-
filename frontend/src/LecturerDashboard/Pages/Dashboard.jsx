import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const LecturerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("https://aits-group-t-3712bf6213e8.herokuapp.com/api/issues/lecturer/issues/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const assignedIssues = issues.length;
  const issuesInProgress = issues.filter(i => i.status === 'in_progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;

  const recentActivity = issues.slice(0, 5).map(issue => ({
    message: `Issue ${issue.issue_id} - ${issue.issue_type} (${issue.status})`,
    time: new Date(issue.created_at).toLocaleTimeString(),
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Welcome, Lecturer! Here is an overview of your activities</h2>
        <h3>Lecturer's Dashboard</h3>
        <div className="stats-container">
          <div className="stat-box">
            <p>Total Assigned Issues</p>
            <h2>{assignedIssues}</h2>
          </div>
          <div className="stat-box">
            <p>Issues in Progress</p>
            <h2>{issuesInProgress}</h2>
          </div>
          <div className="stat-box">
            <p>Resolved Issues</p>
            <h2>{resolvedIssues}</h2>
          </div>
        </div>
        <div className="activity-feed">
          <h3>Recent Activity Feed</h3>
          {recentActivity.map((activity, index) => (
            <div className="activity-item" key={index}>
              <p>{activity.message}</p>
              <span>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
