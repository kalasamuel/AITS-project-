import React, { useState, useEffect } from "react";
import { apiClient } from "../../api";
import "./ResolvedIssues.css";

const ResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIssueType, setFilterIssueType] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatWords = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ") 
      .toLowerCase() 
      .split(" ") 
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await apiClient.get(
          "/issues/lecturer/issues/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resolvedOnly = response.data.filter(
          (issue) => issue.status === "resolved" || issue.status === "rejected"
        );

        setIssues(resolvedOnly);
      } catch (err) {
        console.error("Error fetching resolved issues:", err);
        setError("Failed to load resolved issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearchTerm =
      [issue.issue_type, issue.student_name, issue.status, issue.registration_number]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesIssueType =
      filterIssueType === "" || issue.issue_type === filterIssueType;

    const matchesStatus = filterStatus === "" || issue.status === filterStatus;

    return matchesSearchTerm && matchesIssueType && matchesStatus;
  });

  const uniqueIssueTypes = [
    "",
    ...new Set(issues.map((issue) => issue.issue_type)),
  ];
  const uniqueStatuses = [
    "",
    ...new Set(issues.map((issue) => issue.status)),
  ];
  return (
    <div className="resolved-issues">
      <h2>Resolved Issues</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterIssueType}
          onChange={(e) => setFilterIssueType(e.target.value)}
          className="filter-select"
          aria-label="Filter by Issue Type"
        >
          <option value="">All Issue Types</option>
          {uniqueIssueTypes.map(
            (type) =>
              type && (
                <option key={type} value={type}>
                  {formatWords(type)}
                </option>
              )
          )}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
          aria-label="Filter by Status"
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map(
            (status) =>
              status && ( 
                <option key={status} value={status}>
                  {formatWords(status)}
                </option>
              )
          )}
        </select>
      </div>

      {loading ? (
        <p>Loading resolved issues...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredIssues.length === 0 ? (
        <p>No resolved issues found matching your criteria.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Issue Type</th>
              <th>Registration Number</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Date Submitted</th>
              <th>Resolution Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.issue_id}>
                <td>{formatWords(issue.issue_type)}</td>
                <td>{issue.registration_number}</td>
                <td>{issue.student_name}</td>
                <td>{formatWords(issue.status)}</td>
                <td>{new Date(issue.created_at).toLocaleString()}</td>
                <td>{issue.resolution_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResolvedIssues;