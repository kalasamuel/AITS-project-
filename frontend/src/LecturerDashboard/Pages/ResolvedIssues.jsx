import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResolvedIssues.css";

const ResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/issues/lecturer/issues/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resolvedOnly = response.data.filter(
          (issue) => issue.status === "resolved"
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

  const filteredIssues = issues.filter((issue) =>
    [issue.issue_type, issue.student_name, issue.status, issue.registration_number]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    return sortOrder === "asc"
      ? a.student_name.localeCompare(b.student_name)
      : b.student_name.localeCompare(a.student_name);
  });

  return (
    <div className="resolved-issues">
      <h2>Resolved Issues</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="asc">Sort by A-Z</option>
          <option value="desc">Sort by Z-A</option>
        </select>
      </div>

      {loading ? (
        <p>Loading resolved issues...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : sortedIssues.length === 0 ? (
        <p>No resolved issues found.</p>
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
            {sortedIssues.map((issue) => (
              <tr key={issue.issue_id}>
                <td>{issue.issue_type.replace(/_/g, " ")}</td>
                <td>{issue.registration_number}</td>
                <td>{issue.student_name}</td>
                <td>{issue.status.replace(/_/g, " ")}</td>
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
