import React, { useState } from 'react';
import './Assignment.css';

const AssignmentPage = () => {
    const [issues, setIssues] = useState([
        { id: '#1235', studentName: 'Bob', department: 'CEDAT', courseCode: 'CIV101', issueType: 'Exam results', status: 'Open', assignedTo: '', adminNumber: '' },
        { id: '#1236', studentName: 'Charlie', department: 'CHUSS', courseCode: 'LIT202', issueType: 'Exam results', status: 'In Progress', assignedTo: '', adminNumber: '' },
        { id: '#1238', studentName: 'Eve', department: 'CEDAT', courseCode: 'MTH300', issueType: 'Open', status: 'Open', assignedTo: '', adminNumber: '' },
    ]);

    // Function to handle input changes for lecturer name and admin number
    const handleInputChange = (issueId, field, value) => {
        setIssues(issues.map(issue =>
            issue.id === issueId ? { ...issue, [field]: value } : issue
        ));
    };

    // Function to assign an issue when the "Assign" button is clicked
    const assignIssue = (issueId) => {
        setIssues(issues.map(issue =>
            issue.id === issueId ? { ...issue, status: 'Assigned' } : issue
        ));
        alert(`Issue ${issueId} has been successfully assigned.`);
    };

    return (
        <div className="container">
            <h1 className="header">Assign Issues to Lecturers</h1>

            {/* Issues Table */}
            <div className="table-container">
                <h2 className="table-header">Issues Pending Assignment:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="table-header-cell">Issue ID</th>
                            <th className="table-header-cell">Student Name</th>
                            <th className="table-header-cell">Department</th>
                            <th className="table-header-cell">Course Code</th>
                            <th className="table-header-cell">Issue Type</th>
                            <th className="table-header-cell">Status</th>
                            <th className="table-header-cell">Lecturer Name</th>
                            <th className="table-header-cell">Admin Number</th>
                            <th className="table-header-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue.id} className="table-row">
                                <td className="table-cell">{issue.id}</td>
                                <td className="table-cell">{issue.studentName}</td>
                                <td className="table-cell">{issue.department}</td>
                                <td className="table-cell">{issue.courseCode}</td>
                                <td className="table-cell">{issue.issueType}</td>
                                <td className="table-cell">{issue.status}</td>
                                <td className="table-cell">
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Enter Lecturer Name"
                                        value={issue.assignedTo}
                                        onChange={(e) => handleInputChange(issue.id, 'assignedTo', e.target.value)}
                                    />
                                </td>
                                <td className="table-cell">
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Enter Admin Number"
                                        value={issue.adminNumber}
                                        onChange={(e) => handleInputChange(issue.id, 'adminNumber', e.target.value)}
                                    />
                                </td>
                                <td className="table-cell">
                                    <button
                                        className="assign-button"
                                        onClick={() => assignIssue(issue.id)}
                                        disabled={!issue.assignedTo || !issue.adminNumber}
                                    >
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignmentPage;