import React, {useEffect ,useState } from 'react';
import axios from 'axios';
import './Assignment.css';

const AssignmentPage = () => {
    const [issues, setIssues] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssuesAndLecturers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };

                const [issuesResponse, lecturersResponse] = await Promise.all([
                    axios.get("http://127.0.1:8000/api/issues/registrar/all-issues/", { headers }),
                    axios.get("http://127.0.1:8000/api/accounts/lecturers/", { headers }),
                ]);

                const unassignedIssues = issuesResponse.data.filter(issue => !issue.assigned_to);
                setIssues(unassignedIssues);
                setLecturers(lecturersResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssuesAndLecturers();
    }, []);

    const handleAssign = async (issueId) => {
        const lecturerId = assignments[issueId];
        if (!lecturerId) return alert("Please select a lecturer to assign issue.");

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/issues/assign-issue/",
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
        setAssignments(prev => ({...prev, [issueId] : lecturerId}));
    };

    return (
        <div className="assignment-container">
            <h1 className="header">Assign Issues to Lecturers</h1>
            {loading ? (
                <p>Loading...</p>
            ) : issues.length === 0 ? (
                <p>No unassigned issues available.</p>
            ) : (
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
                            <th className="table-header-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue.issue_id} className="table-row">
                                <td className="table-cell">{issue.issue_id}</td>
                                <td className="table-cell">{issue.student_name}</td>
                                <td className="table-cell">{issue.department.toUpperCase()}</td>
                                <td className="table-cell">{issue.course_code}</td>
                                <td className="table-cell">{issue.issue_type.replace(/_/g, ' ')}</td>
                                <td className="table-cell">{issue.status}</td>
                                <td className="table-cell">
                                    <select
                                        value={assignments[issue.issue_id] || ''}
                                        onChange={e => handleSelectChange(issue.issue_id, e.target.value)}
                                        className="select-field"
                                    >
                                        <option value="">Select Lecturer</option>
                                        {lecturers.map(lect => (
                                            <option key={lect.id} value={lect.id}>
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