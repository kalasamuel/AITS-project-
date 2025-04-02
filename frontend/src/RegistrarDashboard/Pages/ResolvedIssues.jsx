import React,{useState} from "react";
import "./ResolvedIssues.css";
const ResolvedIssues=()=>{
    const [searchTerm,setsearchTerm]=useState("");
    const [sortOrder,setSortOrder]=useState("asc");
    const issues=[
        { type:"Exam results",
            regNo:"2024BSC/3210",
            studentName:"Gang shi",
            status:"Resolved",
            date:"2025-02-15",
        resolutionTime:"1 day"},
        { type:"Missing marks",
            regNo:"2024BSC/3510",
            studentName:"Tai shi",
            status:"Rejected",
            date:"2025-02-15",
            resolutionTime:"2 days"},
        { type:"Exam results",
            regNo:"2024BSC/3810",
            studentName:"jarred",
            status:"Resolved",
            date:"2025-02-15",
            resolutionTime:"1 day"},

    ];
    const filteredIssues=issues.filter((issue)=>
    issue.type.toLowerCase().includes(searchTerm.toLowerCase())||
    issue.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.studentName.toLowerCase().includes(searchTerm.toLowerCase())||
    issue.status.toLowerCase().includes(searchTerm.toLowerCase()));
    const sortedIssues=[...filteredIssues].sort((a,b)=>{
            return sortOrder==="asc"?a.studentName.localeCompare(b.studentName):
            b.studentName.localeCompare(a.studentName);
        });
        return (
            <div className="resolved-issues">
                <h2>Resolved Issues</h2>
                <div className="controls">
                    <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e)=>setsearchTerm(e.target.value)}
                    />
                    <select onChange={(e)=>
                        setSortOrder(e.target.value)}
                        value={sortOrder}>
                        <option value="asc">Sort by A-Z</option>
                        <option value="desc">Sort by Z-A</option>
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Issue Type</th>
                            <th>Registration Number</th>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Date Submitted</th>
                            <th>Resolution Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedIssues.map((issue,index)=>(
                            <tr key={issue.regNo}>
                                <td>{issue.type}</td>
                                <td>{issue.regNo}</td>
                                <td>{issue.studentName}</td>
                                <td>{issue.status}</td>
                                <td>{issue.date}</td>
                                <td>{issue.resolutionTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
        );
};
export default ResolvedIssues;
    