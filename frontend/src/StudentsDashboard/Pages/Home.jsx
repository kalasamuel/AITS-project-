import React from "react";
import IssuesList from "../Components/IssuesList";



const Home = () => {
    
    const sampleIssues = [
        { id: 1, title: "Issue", description: "Unable to login to the portal", status: "Pending", department: "COCIS" },
        { id: 2, title: "Math marks", description: "Internet is not working", status: "In Progress", department: "COCIS" },
        { id: 3, title: "Course Material Missing", description: "Course material for Math 101 is missing", status: "Resolved", department: "COCIS" },
    ];

    return (
        <div>
            <IssuesList issues={sampleIssues} />
        </div>
    );
};

export default Home;