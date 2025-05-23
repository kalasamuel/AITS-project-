import React, { useState, useEffect } from 'react';
import { apiClient } from "../../api";
import './Assigned.css';

const Assigned = () => {
  const [issues, setIssues] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lecturerFilter, setLecturerFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  function formatWords(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        const response = await apiClient.get("/issues/assigned/", {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
      });
        setIssues(response.data);
      } catch (error) {
        console.error('Failed to fetch assigned issues:', error);
        setError('Failed to fetch assigned issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedIssues();
  }, []);

  // Unique options for filters
  const lecturerOptions = Array.from(
    new Set(
      issues
        .map(issue =>
          issue.assigned_to
            ? `${issue.assigned_to.last_name} ${issue.assigned_to.first_name}`
            : ''
        )
        .filter(Boolean)
    )
  );
  const courseOptions = Array.from(
    new Set(issues.map(issue => issue.course?.code).filter(Boolean))
  );

  // Modern search and filter logic
  const filteredIssues = issues
    .filter(issue => issue.status === "open" || issue.status === "in_progress")
    .filter(issue => {
      const searchTermLower = searchTerm.toLowerCase();

      // Search by student name, registration, lecturer, course, issue type
      const studentName = `${issue.student?.last_name || ''} ${issue.student?.first_name || ''}`.toLowerCase();
      const registrationNo = issue.student?.student_number?.toLowerCase() || '';
      const lecturerName = issue.assigned_to
        ? `${issue.assigned_to.last_name} ${issue.assigned_to.first_name}`.toLowerCase()
        : '';
      const courseCode = issue.course?.code?.toLowerCase() || '';
      const issueType = issue.issue_type?.replace(/_/g, ' ').toLowerCase() || '';

      const globalSearchMatch =
        !searchTerm ||
        studentName.includes(searchTermLower) ||
        registrationNo.includes(searchTermLower) ||
        lecturerName.includes(searchTermLower) ||
        courseCode.includes(searchTermLower) ||
        issueType.includes(searchTermLower);

      const statusMatch =
        selectedStatus === 'All' || issue.status === selectedStatus;

      const lecturerFilterMatch =
        !lecturerFilter || lecturerName === lecturerFilter.toLowerCase();

      const courseFilterMatch =
        !courseFilter || courseCode === courseFilter.toLowerCase();

      return globalSearchMatch && statusMatch && lecturerFilterMatch && courseFilterMatch;
    });

  return (
    <div className="assigned-container">
      <h1>Lecturer's Dashboard</h1>

      {error && <p className="error-message">{error}</p>}

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
          onChange={e => setSelectedStatus(e.target.value)}
          value={selectedStatus}
        >
          <option value="All">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
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

      <div className="table-container">
        {loading ? (
          <p className="loading-message">Loading issues...</p>
        ) : filteredIssues.length > 0 ? (
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
                  <td>{new Date(issue.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No issues found for the selected filter.</p>
        )}
      </div>

      {selectedIssue && (
        <div
          className="modal"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="modal-content">
            <h2 id="modal-title">Issue Details</h2>
            <p id="modal-description"><strong>Type:</strong> {formatWords(selectedIssue.issue_type)}</p>
            <p><strong>Registration No:</strong> {selectedIssue.student?.registration_number}</p>
            <p><strong>Student Name:</strong> {`${selectedIssue.student?.last_name} ${selectedIssue.student?.first_name}`}</p>
            <p><strong>Lecturer:</strong> {`${selectedIssue.assigned_to?.last_name} ${selectedIssue.assigned_to?.first_name}`}</p>
            <p><strong>Course Code:</strong> {selectedIssue.course?.code}</p>
            <p><strong>Status:</strong> {formatWords(selectedIssue.status)}</p>
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