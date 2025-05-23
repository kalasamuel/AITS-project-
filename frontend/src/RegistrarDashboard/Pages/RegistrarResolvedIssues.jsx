import React, { useState, useEffect } from 'react';
import { apiClient } from "../../api";
import './RegistrarResolvedIssues.css';

const ResolvedIssues = () => {
  const [resolvedIssues, setResolvedIssues] = useState([]); 
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [lecturerFilter, setLecturerFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await apiClient.get('/issues/registrar/all-issues/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResolvedIssues(response.data);
      } catch (error) {
        console.error('Failed fetching resolved issues:', error);
        setError('Failed to load resolved issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedIssues();
  }, []);

  // Unique options for filters
  const lecturerOptions = Array.from(
    new Set(
      resolvedIssues
        .map(issue =>
          issue.assigned_to
            ? `${issue.assigned_to.last_name} ${issue.assigned_to.first_name}`
            : ''
        )
        .filter(Boolean)
    )
  );
  const courseOptions = Array.from(
    new Set(resolvedIssues.map(issue => issue.course?.code).filter(Boolean))
  );
  const statusOptions = Array.from(
    new Set(
      resolvedIssues
        .map(issue => issue.status)
        .filter(status => status === "resolved" || status === "rejected")
    )
  );

  // Helper for formatting
  function formatWords(str) {
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Filtered issues
  const filteredIssues = resolvedIssues
    .filter(issue => issue.status === "resolved" || issue.status === "rejected")
    .filter(issue => {
      const searchTermLower = searchTerm.toLowerCase();

      const studentName = `${issue.student?.last_name || ''} ${issue.student?.first_name || ''}`.toLowerCase();
      const registrationNo = issue.student?.student_number?.toLowerCase() || '';
      const lecturerName = issue.assigned_to
        ? `${issue.assigned_to.last_name} ${issue.assigned_to.first_name}`.toLowerCase()
        : '';
      const courseCode = issue.course?.code?.toLowerCase() || '';
      const issueType = issue.issue_type?.replace(/_/g, ' ').toLowerCase() || '';
      const status = issue.status || '';

      const globalSearchMatch =
        !searchTerm ||
        studentName.includes(searchTermLower) ||
        registrationNo.includes(searchTermLower) ||
        lecturerName.includes(searchTermLower) ||
        courseCode.includes(searchTermLower) ||
        issueType.includes(searchTermLower);

      const lecturerFilterMatch =
        !lecturerFilter || lecturerName === lecturerFilter.toLowerCase();

      const courseFilterMatch =
        !courseFilter || courseCode === courseFilter.toLowerCase();

      const statusFilterMatch =
        !statusFilter || status === statusFilter;

      return globalSearchMatch && lecturerFilterMatch && courseFilterMatch && statusFilterMatch;
    });
  return (
    <div className="resolved-container">
      <h1>Resolved Issues</h1>

      <div className="search-filter-wrapper" style={{ marginBottom: 24 }}>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by Student, Reg. No, Lecturer, Course, or Issue Type..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="select-field"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{formatWords(status)}</option>
          ))}
        </select>
        <select
          className="select-field"
          value={lecturerFilter}
          onChange={e => setLecturerFilter(e.target.value)}
        >
          <option value="">All Lecturers</option>
          {lecturerOptions.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <select
          className="select-field"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          <option value="">All Courses</option>
          {courseOptions.map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredIssues.length === 0 ? (
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
            {filteredIssues.map((issue) => (
              <tr
                key={issue.issue_id}
                onClick={() => setSelectedIssue(issue)}
                style={{ cursor: 'pointer' }}
              >
                <td>{formatWords(issue.issue_type)}</td>
                <td>{issue.student?.student_number}</td>
                <td>{`${issue.student?.last_name} ${issue.student?.first_name}`}</td>
                <td>{`${issue.assigned_to?.last_name} ${issue.assigned_to?.first_name}`}</td>
                <td>{issue.course?.code}</td>
                <td>{formatWords(issue.status)}</td>
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
            <p><strong>Type:</strong> {formatWords(selectedIssue.issue_type)}</p>
            <p><strong>Registration No:</strong> {selectedIssue.student?.student_number}</p>
            <p><strong>Student Name:</strong> {`${selectedIssue.student?.last_name} ${selectedIssue.student?.first_name}`}</p>
            <p><strong>Lecturer:</strong> {`${selectedIssue.assigned_to?.last_name} ${selectedIssue.assigned_to?.first_name}`}</p>
            <p><strong>Course Code:</strong> {selectedIssue.course?.code}</p>
            <p><strong>Status:</strong> {formatWords(selectedIssue.status)}</p>
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