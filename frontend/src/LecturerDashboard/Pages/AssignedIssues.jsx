import React ,{useState, useEffect}from "react";
import axios from "axios";
import "./AssignedIssues.css";

const AssignedIssues=()=>{
    const[issues,setIssues]=useState([]);
    const[sortBy,setSortBy]=useState("date");

    useEffect(()=>{
        const fetchAssignedIssues=async()=>{
            try{
                const token=localStorage.getItem("access_token");
                const response=await axios.get("http://127.0.0.1:8000/api/issues/lecturer/issues/",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                setIssues(response.data);
            }catch(error){
                console.error("Error fetching assigned issues:",error);
            }
        };
        fetchAssignedIssues();
    }, []);

    const sortedIssues=[...issues].sort((a,b)=>{
        if(sortBy==="date"){
            return new Date(b.created_at)- new Date(a.created_at);
        }
        if(sortBy==="status"){
            return a.status.localeCompare(b.status);
        }
        return 0;
    });
    return (
        <div className="lecturer-dashboard">
          <h2>Lecturer's Dashboard</h2>
          <div className="sort-options">
            <label>Sort by:</label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="date">Date Submitted</option>
              <option value="status">Status</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Issue Type</th>
                <th>Student Webmail</th>
                <th>Status</th>
                <th>Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {sortedIssues.map((issue) => (
                <tr key={issue.issue_id}>
                  <td>{issue.issue_type}</td>
                  <td>{issue.student_name}</td>
                  <td>{issue.status}</td>
                  <td>{new Date(issue.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
    
    export default AssignedIssues;