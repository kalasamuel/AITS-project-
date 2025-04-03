import React, { useState } from 'react';

const ResolvedIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    { type: 'Missing marks', regNo: '2024/BSCS/3210', name: 'KALA SAMUEL', lecturer: 'Dr. John Doe', courseCode: 'CS101', status: 'Resolved', date: 'Feb 14, 2025, 10:30am' },
    { type: 'Exam results', regNo: '2024/BSCS/3212', name: 'LUTWAMA KENNETH', lecturer: 'Prof. Mark Lee', courseCode: 'CS303', status: 'Resolved', date: 'Feb 14, 2025, 10:30am' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Resolved Issues</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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
          {issues.map((issue, index) => (
            <tr key={index} onClick={() => setSelectedIssue(issue)} style={{ cursor: 'pointer' }}>
              <td>{issue.type}</td>
              <td>{issue.regNo}</td>
              <td>{issue.name}</td>
              <td>{issue.lecturer}</td>
              <td>{issue.courseCode}</td>
              <td>{issue.status}</td>
              <td>{issue.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIssue && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', boxShadow: '0px 0px 10px gray' }}>
          <h2>Issue Details</h2>
          <p><strong>Type:</strong> {selectedIssue.type}</p>
          <p><strong>Registration No:</strong> {selectedIssue.regNo}</p>
          <p><strong>Student Name:</strong> {selectedIssue.name}</p>
          <p><strong>Lecturer:</strong> {selectedIssue.lecturer}</p>
          <p><strong>Course Code:</strong> {selectedIssue.courseCode}</p>
          <p><strong>Status:</strong> {selectedIssue.status}</p>
          <p><strong>Date Resolved:</strong> {selectedIssue.date}</p>
          <button onClick={() => setSelectedIssue(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ResolvedIssues;