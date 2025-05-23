import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../api";
import "./IssuesList.css";

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

const IssuesList = () => {
  const navigate = useNavigate();
  const { issue_id } = useParams();
  const [issues, setIssues] = useState([]);
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("access_token");
        const response = await apiClient.get("/issues/student/all/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIssues(response.data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setError("Failed to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Debounce search input for performance
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (issue_id) {
      setExpandedIssue(Number(issue_id));
      // Optionally, scroll into view
      setTimeout(() => {
        const el = document.getElementById(`issue-card-${issue_id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [issue_id, issues]);

  const handleIssueClick = (issueId) => {
    setExpandedIssue((prev) => (prev === issueId ? null : issueId));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const filteredIssues = issues.filter(
    (issue) =>
      (filter === "All" ||
        (filter === "In Progress" && issue.status === "in_progress") ||
        (filter === "Resolved" && issue.status === "resolved") ||
        (filter === "Open" && issue.status === "open") ||
        (filter === "Rejected" && issue.status === "rejected")) &&
      (issue.title || issue.issue_type || issue.description) &&
      (
        (issue.title && issue.title.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (issue.issue_type && issue.issue_type.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (issue.description && issue.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      )
  );

  return (
    <div className="i-container">
      <h1>All Your Issues</h1>
      <div className="search-sort">
        <div className="search-bar-advanced">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search issues"
            className="search-input long-search"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={handleClearSearch}
              aria-label="Clear search"
              type="button"
            >
              &times;
            </button>
          )}
        </div>
        <div className="filter-dropdown">
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Resolved">Resolved</option>
            <option value="In Progress">In Progress</option>
            <option value="Rejected">Rejected</option>
            <option value="Open">Open</option>
          </select>
          <span className="dropdown-arrow">&#9662;</span>
        </div>
      </div>    
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <div className="loading-container"><p>Loading issues...</p></div>
      ) : (
        <div className="modern-issues-list">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.issue_id}
                id={`issue-card-${issue.issue_id}`}
                className={`issue-card status-${issue.status}`}
                onClick={() => handleIssueClick(issue.issue_id)}
                tabIndex={0}
                role="button"
                aria-pressed={expandedIssue === issue.issue_id}
              >
                <div className="issue-card-header">
                  <span className="issue-type">
                    {formatIssueType(issue.issue_type || issue.title)}
                  </span>
                  <span className={`status-badge status-${issue.status}`}>
                    {formatStatus(issue.status)}
                  </span>
                </div>
                <div className="issue-card-body">
                  <p className="issue-description">
                    {expandedIssue === issue.issue_id
                      ? issue.description
                      : (issue.description && issue.description.length > 45
                          ? issue.description.slice(0, 45) + "..."
                          : issue.description)}
                  </p>
                  <div className="issue-meta">
                    <span className="department">{issue.department}</span>
                  </div>
                </div>
                {expandedIssue === issue.issue_id && (
                  <div className="issue-details">
                    <p>
                      <strong>Type:</strong> {formatIssueType(issue.issue_type)}
                    </p>
                    <p>
                      <strong>Description:</strong> {issue.description}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`status ${issue.status}`}>
                        {formatStatus(issue.status)}
                      </span>
                    </p>
                    <p>
                      <strong>Department:</strong> {issue.department}
                    </p>
                    <p>
                      <strong>Date:</strong> {issue.created_at ? new Date(issue.created_at).toLocaleString() : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-issues">No issues found.</p>
          )}
        </div>
      )}
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