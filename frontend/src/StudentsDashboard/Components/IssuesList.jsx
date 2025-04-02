import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IssuesList.css";

const IssuesList = ({ issues }) => {
  const navigate = useNavigate();
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const handleIssueClick = (issueId) => {
    setExpandedIssue((prev) => (prev === issueId ? null : issueId));
  };

  const filteredIssues = issues.filter(
    (issue) =>
      (filter === "All" || issue.status === filter) &&
      issue.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h1>Students Dashboard</h1>

      
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="All">All</option>
          <option value="Resolved">Resolved</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      
      <div className="issues-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`issue-item ${
                expandedIssue === issue.id ? "expanded" : ""
              }`}
              onClick={() => handleIssueClick(issue.id)}
            >
              <div className="issue-summary">
                <span>{issue.title}</span>
                <span className={`status ${issue.status.toLowerCase()}`}>
                  {issue.status}
                </span>
              </div>

              
              {expandedIssue === issue.id && (
                <div className="issue-details">
                  <p>
                    <strong>Title:</strong> {issue.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {issue.description}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${issue.status.toLowerCase()}`}>
                      {issue.status}
                    </span>
                  </p>
                  <p>
                    <strong>Department:</strong> {issue.department}
                  </p>
                  <p>
                    <strong>Date:</strong> {issue.date}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-issues">No issues found.</p>
        )}
      </div>

      
      <button
        className="new-issue-button"
        onClick={() => navigate("/student/issuesubmission")}
      >
        New Issue
      </button>
    </div>
  );
};

export default IssuesList;