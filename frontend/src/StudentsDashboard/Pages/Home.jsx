import React, { useEffect, useState } from "react";
import { apiClient } from "../../api";
import { useNavigate } from "react-router-dom";
import IssuesList from "../Components/IssuesList";
import './Home.css';

function formatStatus(status) {
  if (!status) return "";
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatIssueType(issueType) {
  if (!issueType) return "";
  const formatted = issueType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return formatted.length > 14 ? formatted.slice(0, 14) + "..." : formatted;
}

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const response = await apiClient.get("/issues/student/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIssues(response.data);
      } catch (error) {
        console.error("Failed to fetch student issues:", error);
        setError("Failed to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="student-home-container">
      <div className="header-row">
        <h1>Student Dashboard</h1>
        <span className="recent-updates">Recent issues updates</span>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-container" aria-live="polite">
          <p className="loading-message">Loading issues...</p>
        </div>
      ) : (
        <div className="modern-issues-list">
          {issues.length === 0 ? (
            <p className="no-issues">No recent issues found.</p>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.issue_id}
                className={`issue-card status-${issue.status.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(`/student/issuedetails/${issue.issue_id}`)}
                tabIndex={0}
                role="button"
                aria-pressed="false"
              >
                <div className="issue-card-header">
                  <span className="issue-type">{formatIssueType(issue.issue_type)}</span>
                  <span className={`status-badge status-${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {formatStatus(issue.status)}
                  </span>
                </div>
                <div className="issue-card-body">
                  <p className="issue-description">
                    {issue.description && issue.description.length > 20
                      ? issue.description.slice(0, 20) + "..."
                      : issue.description}
                  </p>
                  <div className="issue-meta">
                    <span className="department">{issue.department}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;