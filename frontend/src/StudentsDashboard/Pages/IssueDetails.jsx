import React, { useEffect, useState} from "react";
import { apiClient } from "../../api";
import IssuesList from "../Components/IssuesList";

const IssueDetails = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResolvedIssues= async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await apiClient.get("/issues/student/resolved/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIssues(response.data);
                }  catch (error) {
                    console.error("Failed to fetch resolved issues:", error);
                } finally {
                    setLoading(false);
                }
        };
        fetchResolvedIssues();
    }, []);

    return (
        <div>
            {loading ? <p>Loading resolved issues...</p> : <IssuesList issues={issues} />}
        </div>
    );
};

/*
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
*/
export default IssueDetails;