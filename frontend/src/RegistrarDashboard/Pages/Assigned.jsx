import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assigned.css';

const Assigned = () => {
  const [issues, setIssues] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/issues/assigned/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setIssues(response.data);
      } catch (error) {
        console.error('Failed to fetch assigned issues:', error);
        setError('Failed to fetch assigned issues. Please try again later.');
      }
    };

    fetchAssignedIssues();
  }, []);

  const filteredIssues = selectedStatus === 'All' 
    ? issues 
    : issues.filter(issue => issue.status === selectedStatus);

  return (
    <div className="assigned-container">
      <h1>Lecturer's Dashboard</h1>

      {error && <p className="error-message">{error}</p>}

      <label>Filter by Status: </label>
      <select onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
        <option value="All">All</option>
        <option value="open">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>
      
      <table className="issues-table">
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Registration No.</th>
            <th>Student Name</th>
            <th>Lecturer</th>
            <th>Course Code</th>
            <th>Status</th>
            <th>Date Assigned</th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.map((issue) => (
            <tr key={issue.issue_id} onClick={() => setSelectedIssue(issue)} style={{ cursor: 'pointer' }}>
              <td>{issue.issue_type.replace(/_/g, ' ')}</td>
              <td>{issue.student?.registration_number}</td>
              <td>{`${issue.student?.last_name} ${issue.student?.first_name}`}</td>
              <td>{`${issue.assigned_to?.last_name} ${issue.assigned_to?.first_name}`}</td>
              <td>{issue.course?.code}</td>
              <td>{issue.status}</td>
              <td>{new Date(issue.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIssue && (
        <div className="modal">
          <div className="modal-content">
            <h2>Issue Details</h2>
            <p><strong>Type:</strong> {selectedIssue.issue_type}</p>
            <p><strong>Registration No:</strong> {selectedIssue.student?.registration_number}</p>
            <p><strong>Student Name:</strong> {`${selectedIssue.student?.last_name} ${selectedIssue.student?.first_name}`}</p>
            <p><strong>Lecturer:</strong> {`${selectedIssue.assigned_to?.last_name} ${selectedIssue.assigned_to?.first_name}`}</p>
            <p><strong>Course Code:</strong> {selectedIssue.course?.code}</p>
            <p><strong>Status:</strong> {selectedIssue.status}</p>
            <p><strong>Date Assigned:</strong> {new Date(selectedIssue.created_at).toLocaleString()}</p>
            <button onClick={() => setSelectedIssue(null)}>Close</button>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedIssue(null)}></div>
        </div>
      )}
    </div>
  );
};

export default Assigned;