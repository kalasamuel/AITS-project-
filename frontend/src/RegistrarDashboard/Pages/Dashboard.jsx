import React from 'react';
import './Dashboard.css';

const RegistrarsDashboard = () => {
    const issues = [
        { id: '#1234', studentName: 'Alice', department: 'COCIS', issueType: 'Missing marks', dateSubmitted: 'Feb 14, 2025, 10:30am', status: 'Resolved' },
        { id: '#1235', studentName: 'Bob', department: 'CEDAT', issueType: 'Exam results', dateSubmitted: 'Feb 14, 2025, 10:30am', status: 'Open' },
        { id: '#1236', studentName: 'Charlie', department: 'CHUSS', issueType: 'Exam results', dateSubmitted: 'Feb 14, 2025, 10:30am', status: 'In Progress' },
        { id: '#1237', studentName: 'David', department: 'COCIS', issueType: 'Exam results', dateSubmitted: 'Feb 14, 2025, 10:30am', status: 'Resolved' },
        { id: '#1238', studentName: 'Eve', department: 'CEDAT', issueType: 'Exam results', dateSubmitted: 'Feb 14, 2025, 10:30am', status: 'Open' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Resolved': return 'status-resolved';
            case 'Open': return 'status-open';
            case 'In Progress': return 'status-in-progress';
            default: return '';
        }
    };

    // Dynamic summary values
    const totalIssues = issues.length;
    const openCount = issues.filter(issue => issue.status === 'Open').length;
    const inProgressCount = issues.filter(issue => issue.status === 'In Progress').length;
    const resolvedCount = issues.filter(issue => issue.status === 'Resolved').length;

    return (
        <div className="container">
            <h1 className="header">Registrar's Dashboard</h1>

            {/* Summary Cards */}
            <div className="summary-container">
                <SummaryCard title="Total Issues" value={totalIssues} className="card-total" />
                <SummaryCard title="Open Issues" value={openCount} className="card-open" />
                <SummaryCard title="Issues In Progress" value={inProgressCount} className="card-in-progress" />
                <SummaryCard title="Resolved Issues" value={resolvedCount} className="card-resolved" />
            </div>

            {/* Issues Table */}
            <div className="table-container">
                <h2 className="table-header">Recent Issues Table:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="table-header-cell">Issue ID</th>
                            <th className="table-header-cell">Student Name</th>
                            <th className="table-header-cell">Department</th>
                            <th className="table-header-cell">Issue Type</th>
                            <th className="table-header-cell">Date Submitted</th>
                            <th className="table-header-cell">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue.id} className="table-row">
                                <td className="table-cell">{issue.id}</td>
                                <td className="table-cell">{issue.studentName}</td>
                                <td className="table-cell">{issue.department}</td>
                                <td className="table-cell">{issue.issueType}</td>
                                <td className="table-cell">{issue.dateSubmitted}</td>
                                <td className="table-cell">
                                    <span className={`status ${getStatusClass(issue.status)}`}>
                                        {issue.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Summary Card Component
const SummaryCard = ({ title, value, className }) => (
    <div className={`card ${className}`}>
        <h3 className="card-title">{title}:</h3>
        <p className="card-value">{value}</p>
    </div>
);

export default RegistrarsDashboard;
