import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IssuesList.css";

const IssuesList = () => ({issues, addIssue}) => {
    const [searchIssue, setsearchIssue] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const navigate = useNavigate();

    return(
        <div className="issues-rectangle">
            <h1>Students Dashboard</h1>
            <div className="search-sort">
                <input type = "text" placeholder = "Search issues...."
                value={searchIssue}
                onChange={(e) => setSearchIssue(e.target.value)}/>

                <select onChange={(e) => setFilter(e.target.value)}>
                   <option value="All" >All</option>
                   <option value="Resolved">Resolved</option>
                   <option value="In progress">In Progress</option>
                   <option value="Pending">Pending</option>
                </select>
            </div>

        <div className="issues-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <div 
              key={issue.id} 
              className="issue-item" 
              onClick={() => setSelectedIssue(issue)}
            >
              <span>{issue.title}</span>
              <span className={`status ${issue.status.toLowerCase()}`}>{issue.status}</span>
            </div>
          ))
        ) : (
          <p className="no-issues">No issues found.</p>
        )}
      </div>

      {selectedIssue && (
        <div className="issue-details">
          <h2>My Current Issues</h2>
          <p><strong>Title:</strong> {selectedIssue.title}</p>
          <p><strong>Description:</strong> {selectedIssue.description}</p>
          <p><strong>Status:</strong> <span className={`status ${selectedIssue.status.toLowerCase()}`}>{selectedIssue.status}</span></p>
          <p><strong>Department:</strong> {selectedIssue.department}</p>
        </div>
      )}

        <button className="new-issue-button" onClick={() => navigate("/issuesubmission")}>
        New Issue
      </button>
            
        </div>
    );
};