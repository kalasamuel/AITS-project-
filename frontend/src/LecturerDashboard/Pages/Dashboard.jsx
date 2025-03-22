import React from "react";
import "./Dashboard.css"
const LecturerDashboard=()=>{
    const assignedIssues=5;
    const issuesInProgress=2;
    const resolvedIssues=3;
    const recentActivity=[{message:"A new issue has been assigned",time:"01:00 pm"}];
    
return (
        <div
        className="dashboard-container">
            <div
            className="dashboard-content">
                <h2>Welcome,Lecturer! Here is an overview of your activities</h2>
                <h3>Lecturer`s Dashboard</h3>
                <div
                className="stats-container">
                    <div className="stat-box">
                        <p>Total Assigned Issues</p>
                        <h2>{assignedIssues}</h2>
                    </div>
                    <div className="stat-box">
                        <p>Issues in Progress</p>
                        <h2>{issuesInProgress}</h2>
                    </div>
                    <div className="stat-box">
                        <p>Resolved Issues</p>
                        <h2>{resolvedIssues}</h2>
                    </div>
                </div>
                <div 
                className="activity-feed">
                    <h3>Recent Activity Feed</h3>
                    {recentActivity.map((activity,index)=>(
                        <div
                        className="activity-item"
                        key={index}>
                            <p>{activity.message}</p>
                            <span>{activity.time}</span>
                            </div>
                    ))}
                </div>
            </div>
        </div>
);
};
                        
export default LecturerDashboard;
