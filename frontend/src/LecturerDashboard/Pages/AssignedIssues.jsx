import React ,{useState}from "react";
import "./AssignedIssues.css";
const AssignedIssues=()=>{
    const [issues,setIssues]=
    useState([{
        id:1,
        issue_type:"Missing marks",
        registration_number:"2024BSC/3210",
        student_name:"Gang shi",
        status:"Pending",
        date_submitted:"2025-02-15"},
        {
            id:2,
            issue_type:"Exam marks",
            registration_number:"2024BSC/5210",
            student_name:"Jarred",
            status:"Resolved",
            date_submitted:"2025-02-15"},
    

    ]);
    const [sortBy,setSortBy]=useState("date");
    const sortedIssues = [...issues].sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.date_submitted) - new Date(a.date_submitted);
        }
        if (sortBy === "status") {
            return a.status.localeCompare(b.status);
        }
        return 0;
    });
return (
    <div
    className="lecturer-dashboard">
        <h2>Lecturer`s Dashboard</h2>
        <div
        className="sort-options">
            <label>Sort by:</label>
            <select onChange={(e)=>setSortBy(e.target.value)}>
                <option
                value="date">Date Submitted</option>
                <option value="status">Status</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Issue Type</th>
                    <th>Registration number</th>
                    <th>Student Name</th>
                    <th>Status</th>
                    <th>Date Submitted</th>
                </tr>
            </thead>
            <tbody>
                {sortedIssues.map((issue)=>(<tr key={issue.id}>
                    <td>{issue.issue_type}</td>
                    <td>{issue.registration_number}</td>
                    <td>{issue.student_name}</td>
                    <td>{issue.status}</td>
                    <td>{new Date(issue.date_submitted).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
    
};

export default AssignedIssues;