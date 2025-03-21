import React from "react";
import IssuesList from "../Components/IssuesList";
import "./Home.css";

const IssueDetails = () => {
    
    const sampleIssues = [
        { id: 1, title: "Login Issue", description: "Unable to login to the portal", status: "Pending", department: "IT" },
        { id: 2, title: "Network Problem", description: "Internet is not working", status: "In Progress", department: "Infrastructure" },
        { id: 3, title: "Course Material Missing", description: "Course material for Math 101 is missing", status: "Resolved", department: "Academics" },
    ];

    return (
        <div>
             <IssuesList issues={sampleIssues} />
        </div>
    );
};

export default IssueDetails;