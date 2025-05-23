import React, {useEffect ,useState } from 'react';
import { apiClient } from "../../api";
import { useLocation } from 'react-router-dom';
import './Assignment.css';

const AssignmentPage = () => {
    const [issues, setIssues] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [issueTypeFilter, setIssueTypeFilter] = useState('');
    const [lecturerFilter, setLecturerFilter] = useState('');

    const location = useLocation();

    // Parse status filter from query params
    const getStatusFromQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get('status') || '';
    };
    const [statusFilter, setStatusFilter] = useState(getStatusFromQuery());

    useEffect(() => {
        setStatusFilter(getStatusFromQuery());
    }, [location.search]);

    useEffect(() => {
        const fetchIssuesAndLecturers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };

                const [issuesResponse, lecturersResponse] = await Promise.all([
                    apiClient.get("/issues/registrar/all-issues/", { headers }),
                    apiClient.get("/accounts/lecturers/", { headers }),
                ]);
                // Only show unassigned issues
                let unassignedIssues = issuesResponse.data.filter(issue => !issue.assigned_to);

                // If statusFilter is set, filter issues by status
                if (statusFilter) {
                    unassignedIssues = unassignedIssues.filter(issue => issue.status === statusFilter);
                }

                setIssues(unassignedIssues);
                setLecturers(lecturersResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssuesAndLecturers();
    }, [statusFilter]);

    const handleAssign = async (issueId) => {
        const lecturerId = assignments[issueId];
        if (!lecturerId) return alert("Please select a lecturer to assign issue.");

        try {
            const token = localStorage.getItem("access_token");
            const response = await apiClient.post(
                "/issues/assign-issue/",
                { issue_id: issueId, lecturer_id: lecturerId },
                { headers: { Authorization: `Bearer ${token}`, },}
            );
            

            alert(response.data.message);
            setIssues(prev => prev.filter(issue => issue.issue_id !== issueId)); // removes from list
        } catch (error) {
            console.error("Assignment failed:", error);
            alert("Failed to assign issue. Please try again.");
        }
    };

    const handleSelectChange = (issueId, lecturerId) => {
        setAssignments(prev => ({ ...prev, [issueId]: lecturerId }));
    };

    // --- Modern Search & Filter Logic ---
    const filteredIssues = issues.filter(issue => {
        const searchTermLower = searchTerm.toLowerCase();
        // Student Name filter (case-insensitive substring match)
        const studentNameMatch = issue.student_name && issue.student_name.toLowerCase().includes(searchTermLower);

        // Department filter
        const departmentMatchStr = issue.department ? issue.department.toLowerCase() : '';
        const departmentMatch = departmentMatchStr.includes(searchTermLower);

        // Issue Type filter
        const issueTypeMatchStr = issue.issue_type ? issue.issue_type.replace(/_/g, ' ').toLowerCase() : '';
        const issueTypeMatch = issueTypeMatchStr.includes(searchTermLower);

        // Lecturer Name match (searches all lecturers)
        const lecturerNames = lecturers.map(l => `${l.first_name} ${l.last_name}`.toLowerCase());
        const lecturerMatch = lecturerNames.some(name => name.includes(searchTermLower));

        // Global search: any field matches
        const globalSearchMatch =
            !searchTerm ||
            studentNameMatch ||
            departmentMatch ||
            issueTypeMatch ||
            lecturerMatch;

        // Department filter (dropdown)
        const departmentFilterMatch = !departmentFilter ||
            (issue.department && issue.department === departmentFilter);

        // Issue Type filter (dropdown)
        const issueTypeFilterMatch = !issueTypeFilter ||
            (issue.issue_type && issue.issue_type === issueTypeFilter);

        // Lecturer filter (dropdown)
        const lecturerFilterMatch =
            !lecturerFilter ||
            (assignments[issue.issue_id] &&
                lecturers.find(l =>
                    l.lecturer_id === assignments[issue.issue_id] &&
                    `${l.first_name} ${l.last_name}` === lecturerFilter
                ));

        return globalSearchMatch && departmentFilterMatch && issueTypeFilterMatch && lecturerFilterMatch;
    });

    // --- Unique values for dropdowns ---
    const departmentOptions = Array.from(new Set(issues.map(i => i.department).filter(Boolean)));
    const issueTypeOptions = Array.from(new Set(issues.map(i => i.issue_type).filter(Boolean)));
    const lecturerOptions = lecturers.map(l => ({
        id: l.lecturer_id,
        name: `${l.first_name} ${l.last_name}`
    }));

    return (
        <div className="assignment-container">
            <h1 className="header">Assign Issues to Lecturers</h1>

            {/* Modern Search & Filter Bar */}
            <div className="search-filter-wrapper" style={{ marginBottom: 24 }}>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by Student Name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select
                    className="select-field"
                    value={departmentFilter}
                    onChange={e => setDepartmentFilter(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departmentOptions.map(dep => (
                        <option key={dep} value={dep}>{dep.toUpperCase()}</option>
                    ))}
                </select>
                <select
                    className="select-field"
                    value={issueTypeFilter}
                    onChange={e => setIssueTypeFilter(e.target.value)}
                >
                    <option value="">All Issue Types</option>
                    {issueTypeOptions.map(type => (
                        <option key={type} value={type}>
                            {type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </option>
                    ))}
                </select>
                <select
                    className="select-field"
                    value={lecturerFilter}
                    onChange={e => setLecturerFilter(e.target.value)}
                >
                    <option value="">All Lecturers</option>
                    {lecturerOptions.map(l => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : filteredIssues.length === 0 ? (
                <p>No unassigned issues{statusFilter ? ` with status "${statusFilter.replace(/_/g, ' ')}"` : ''} available.</p>
            ) : (
                <div className="table-container">
                    <h2 className="table-header">
                        Issues Pending Assignment{statusFilter ? ` (${statusFilter.replace(/_/g, ' ')})` : ''}:
                    </h2>
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
                                <th className="table-header-cell">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map(issue => (
                                <tr key={issue.issue_id} className="table-row">
                                    <td className="table-cell">{issue.issue_id}</td>
                                    <td className="table-cell">{issue.student_name}</td>
                                    <td className="table-cell">{issue.department?.toUpperCase()}</td>
                                    <td className="table-cell">{issue.course_code}</td>
                                    <td className="table-cell">{issue.issue_type.replace(/_/g, ' ')}</td>
                                    <td className="table-cell">{issue.status.replace(/_/g, ' ')}</td>
                                    <td className="table-cell">
                                        <select
                                            value={assignments[issue.issue_id] || ''}
                                            onChange={e => handleSelectChange(issue.issue_id, e.target.value)}
                                            className="select-field"
                                        >
                                            <option value="">Select Lecturer</option>
                                            {lecturers.map(lect => (
                                                <option key={lect.lecturer_id} value={lect.lecturer_id}>
                                                    {lect.first_name} {lect.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="table-cell">
                                        <button
                                            onClick={() => handleAssign(issue.issue_id)}
                                            disabled={!assignments[issue.issue_id]}
                                            className="assign-button"
                                        >
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssignmentPage;