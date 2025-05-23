import React, { useEffect, useState } from "react";
import { apiClient } from "../../api";
import "./Dashboard.css";

const LecturerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await apiClient.get("/issues/lecturer/issues/", {
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

  const recentActivity = issues
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  function formatWords(str) {
    if (!str) return "";
    return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  return (
    <div className="dashboard-container modern-lecturer-dashboard">
      <div className="dashboard-content">
        <h2 className="dashboard-welcome">Welcome, Lecturer!</h2>
        <h3 className="dashboard-title">Your Activity Overview</h3>
        <div className="stats-container modern-stats">
          <div className="stat-box modern-stat-box assigned">
            <p>Total Assigned Issues</p>
            <h2>{loading ? <span className="stat-loading">...</span> : assignedIssues}</h2>
          </div>
          <div className="stat-box modern-stat-box in-progress">
            <p>Issues in Progress</p>
            <h2>{loading ? <span className="stat-loading">...</span> : issuesInProgress}</h2>
          </div>
          <div className="stat-box modern-stat-box resolved">
            <p>Resolved Issues</p>
            <h2>{loading ? <span className="stat-loading">...</span> : resolvedIssues}</h2>
          </div>
        </div>
        <div className="activity-feed modern-activity-feed">
          <h3>Recent Activity Feed</h3>
          {loading ? (
            <div className="activity-skeleton">
              <div className="activity-item-skeleton" />
              <div className="activity-item-skeleton" />
              <div className="activity-item-skeleton" />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="no-activity">No recent activity.</p>
          ) : (
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Student Name</th>
                  <th>Issue Type</th>
                  <th>Status</th>                  
                  <th>Date Submitted</th>

                </tr>
              </thead>
              <tbody>
                {recentActivity.map((issue) => (
                  <tr key={issue.issue_id}>
                    <td>{issue.issue_id}</td>
                    <td>{issue.student_name}</td>
                    <td>{formatWords(issue.issue_type)}</td>
                    <td>
                      <span className={`status ${issue.status}`}>
                        {formatWords(issue.status)}
                      </span>
                    </td>
                    <td>{new Date(issue.created_at).toLocaleString()}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;