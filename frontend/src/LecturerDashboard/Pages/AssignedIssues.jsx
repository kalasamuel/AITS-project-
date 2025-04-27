import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedIssues.css";

const AssignedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/issues/lecturer/issues/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.log("Assigned issues:", response.data);
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching assigned issues:", error);
        setError("Failed to fetch assigned issues.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      issue.student_name.toLowerCase().includes(searchValue) ||
      (issue.registration_number && issue.registration_number.toLowerCase().includes(searchValue)) ||
      issue.issue_type.toLowerCase().includes(searchValue)
    );
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="lecturer-dashboard">
      <h2>Lecturer's Dashboard</h2>

      <div className="search-sort-bar">
        <input
          type="text"
          placeholder="Search by Student Name, Registration Number, or Issue Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {loading ? (
        <p>Loading assigned issues...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : issues.length === 0 ? (
        <p>No assigned issues found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Issue Type</th>
              <th>Registration Number</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.map((issue) => (
              <tr key={issue.issue_id}>
                <td>{issue.issue_type.replace("_", " ")}</td>
                <td>{issue.registration_number || "N/A"}</td>
                <td>{issue.student_name}</td>
                <td>{issue.status.replace("_", " ")}</td>
                <td>{new Date(issue.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedIssues;
