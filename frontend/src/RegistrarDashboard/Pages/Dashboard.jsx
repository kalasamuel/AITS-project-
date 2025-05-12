import React, { useEffect, useState } from 'react';
import { apiClient } from "../../api";
import './Dashboard.css';

const RegistrarsDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const[searchTerm, setSearchTerm] = useState('');
  const[statusFilter, setStatusFilter] = useState('');
  const[issueTypeFilter, setIssueTypeFilter] = useState('');
  const[departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'resolved': return 'status-resolved';
      case 'open': return 'status-open';
      case 'in_progress': return 'status-in-progress';
      default: return '';
    }
  };
  const ISSUE_TYPE_LABELS = {
    missing_marks: "Missing Marks",
    wrong_registration_number: "Wrong Registration Number",
    wrong_marks: "Wrong Marks",
    other: "Other"
  };
  

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await apiClient.get('/issues/registrar/all-issues/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const totalIssues = issues.length;
  const openCount = issues.filter(issue => issue.status === 'open').length;
  const inProgressCount = issues.filter(issue => issue.status === 'in_progress').length;
  const resolvedCount = issues.filter(issue => issue.status === 'resolved').length;

  return (
    <div className="dashboard-container">
      <h1 className="header">Registrar's Dashboard</h1>
      <div className="summary-container">
        <SummaryCard title="Total Issues" value={totalIssues} className="card-total" />
        <SummaryCard title="Open Issues" value={openCount} className="card-open" />
        <SummaryCard title="Issues In Progress" value={inProgressCount} className="card-in-progress" />
        <SummaryCard title="Resolved Issues" value={resolvedCount} className="card-resolved" />
      </div>

      <div className='search-filter-wrapper'>
        <input
        type='text'
        placeholder='Search by Student Webmail...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='search-bar'
        />
        <div className='filter-toggle' onClick={() => setShowFilters(!showFilters)} title ="Show filters">
            ▼
          </div>
          {showFilters && (
            <div className="filter-dropdown">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select value={issueTypeFilter} onChange={(e) => setIssueTypeFilter(e.target.value)}>
                <option value="">All Issue Types</option>
                {Object.entries(ISSUE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                <option value="">All Departments</option>
                {Array.from(new Set(issues.map(i => i.department))).map(dep => (
                  <option key={dep} value={dep}>{dep.toUpperCase()}</option>
                ))}
              </select>
            </div>
              )}
        </div>

      <div className="table-container">
        <h2 className="table-header">Recent Issues Table:</h2>
        {loading ? (
          <p>Loading issues...</p>
        ) : issues.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table" aria-label="Issues Table">
              <thead>
                <tr>
                  <th className="table-header-cell">Issue ID</th>
                  <th className="table-header-cell">Student Webmail</th>
                  <th className="table-header-cell">Department</th>
                  <th className="table-header-cell">Issue Type</th>
                  <th className="table-header-cell">Date Submitted</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {issues
                  .filter(issue =>
                    (!searchTerm || issue.student_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (!statusFilter || issue.status === statusFilter) &&
                    (!issueTypeFilter || issue.issue_type === issueTypeFilter) &&
                    (!departmentFilter || issue.department === departmentFilter)
                  )
                  .map(issue => (
                  <tr key={issue.issue_id} className="table-row">
                    <td className="table-cell">{issue.issue_id}</td>
                    <td className="table-cell">{issue.student_name}</td>
                    <td className="table-cell">{issue.department.toUpperCase()}</td>
                    <td className="table-cell">{ISSUE_TYPE_LABELS[issue.issue_type]}</td>
                    <td className="table-cell">{new Date(issue.created_at).toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={`status ${getStatusClass(issue.status)}`}>
                        {issue.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, className }) => (
  <div className={`card ${className}`}>
    <h3 className="card-title">{title}:</h3>
    <p className="card-value">{value}</p>
  </div>
);

export default RegistrarsDashboard;