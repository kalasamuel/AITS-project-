import React, { useEffect, useState } from "react";
import { apiClient } from "../../api";
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
        const response = await apiClient.get("/issues/lecturer/issues/", {
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

  const handleIssueStatusUpdate = async (issueId, status) => {
    try {
      const response = await apiClient.patch(`/issues/lecturer/issues/${issueId}/resolve/`, 
        {status},
        {headers: {Authorization: `Bearer ${localStorage.getItem("access_token")}`,},}
      );

      // Update the local issues state
      setIssues((prevIssues) =>
      prevIssues.map((issue)=>
        issue.issue_id === issueId ? { ...issue, status: response.data.status } : issue 
      )
    );
  } catch (error) {
    console.error("Failed to update issue status:", error);
    setError("Failed to update isssue status. Please try again later. ");}
  };

const filteredIssues = issues.filter((issue) => {
  const searchValue = searchTerm.toLowerCase();
  return (
    (issue.student_name && issue.student_name.toLowerCase().includes(searchValue)) ||
    (issue.registration_number && issue.registration_number.toLowerCase().includes(searchValue)) ||
    (issue.issue_type && issue.issue_type.toLowerCase().includes(searchValue))
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
        <table className="issues-table">
          <thead>
            <tr>
              <th>Issue Type</th>
              <th>Registration Number</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Date Submitted</th>
              <th>Actions</th>
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
                <td>
                  <button
                    className="resolve-btn"
                    onClick={() => handleIssueStatusUpdate(issue.issue_id, "resolved")}
                    disabled={issue.status === "resolved"}
                  >
                    Resolve
                  </button>
                  <button 
                    className="pending-btn"
                    onClick={()=> handleIssueStatusUpdate(issue.issue_id, "in_progress")}
                    disabled={issue.status === "in_progress"}
                  >
                    Mark Pending
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleIssueStatusUpdate(issue.issue_id, "rejected")}
                    disabled={issue.status === "rejected"}                    
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedIssues;
