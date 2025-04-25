import React, {useEffect, useState} from "react";
import axios from "axios";
import IssuesList from "../Components/IssuesList";



const Home = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchIssues = async () => {
            try{
                const token = localStorage.getItem("token");
                const response = await axios.get("https://aits-project-backend-group-t.onrender.com/api/issues/student/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIssues(response.data);
            } catch (error) {
                console.error("Failed to fetch student issues:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);
 /*   
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
}; */
    return (
        <div>
            {loading ? <p>Loading issues...</p> : <IssuesList issues={issues}/>}
        </div>
    );
};
              

export default Home;