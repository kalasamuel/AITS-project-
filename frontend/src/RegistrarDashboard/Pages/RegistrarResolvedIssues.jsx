import React, { useState, useEffect } from 'react';
import { apiClient } from "../../api";
import './RegistrarResolvedIssues.css';

const ResolvedIssues = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]); 
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await apiClient.get('/issues/registrar/all-issues/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resolved = response.data.filter(issue => issue.status === 'resolved');
        setResolvedIssues(resolved);
      } catch (error) {
        console.error('Failed fetching resolved issues:', error);
        setError('Failed to load resolved issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedIssues();
  }, []);

  return (
    <div className="resolved-container">
      <h1>Resolved Issues</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : resolvedIssues.length === 0 ? (
        <p>No resolved issues available.</p>
      ) : (
        <table className="resolved-table">
          <thead>
            <tr>
              <th>Issue Type</th>
              <th>Registration No.</th>
              <th>Student Name</th>
              <th>Lecturer</th>
              <th>Course Code</th>
              <th>Status</th>
              <th>Date Resolved</th>
            </tr>
          </thead>
          <tbody>
            {resolvedIssues.map((issue) => (
              <tr
                key={issue.issue_id}
                onClick={() => setSelectedIssue(issue)}
                style={{ cursor: 'pointer' }}
              >
                <td>{issue.issue_type.replace(/_/g, ' ')}</td>
                <td>{issue.student?.registration_number}</td>
                <td>{`${issue.student?.last_name} ${issue.student?.first_name}`}</td>
                <td>{`${issue.assigned_to?.last_name} ${issue.assigned_to?.first_name}`}</td>
                <td>{issue.course?.code}</td>
                <td>{issue.status}</td>
                <td>{new Date(issue.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
            <p><strong>Date Resolved:</strong> {new Date(selectedIssue.updated_at).toLocaleString()}</p>
            <button onClick={() => setSelectedIssue(null)}>Close</button>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedIssue(null)}></div>
        </div>
      )}
    </div>
  );
};

export default ResolvedIssues;