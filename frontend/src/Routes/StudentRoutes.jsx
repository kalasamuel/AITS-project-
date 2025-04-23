import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "../StudentsDashboard/Pages/Home.jsx";
import IssueSubmission from "../StudentsDashboard/Pages/IssueSubmission.jsx";
import IssueDetails from "../StudentsDashboard/Pages/IssueDetails.jsx";
import Notifications from "../StudentsDashboard/Pages/Notifications.jsx";
import ProfileAndSettings from "../StudentsDashboard/Pages/ProfileAndsettings.jsx";

function StudentRoutes({ isAuthenticated, profilePic, setProfilePic }) {
    return (
        <Routes>
            <Route
                path="home"
                element={isAuthenticated ? <Home /> : <Navigate to="/welcome" />}
            />
            <Route
                path="issuesubmission"
                element={isAuthenticated ? <IssueSubmission /> : <Navigate to="/welcome" />}
            />
            <Route
                path="issuedetails"
                element={isAuthenticated ? <IssueDetails /> : <Navigate to="/welcome" />}
            />
            <Route
                path="notifications"
                element={isAuthenticated ? <Notifications /> : <Navigate to="/welcome" />}
            />
            <Route
                path="profileandsettings"
                element={isAuthenticated ? <ProfileAndSettings profilePic={profilePic} setProfilePic={setProfilePic} /> : <Navigate to="/welcome" />}
            />
        </Routes>
    );
}

export default StudentRoutes;
