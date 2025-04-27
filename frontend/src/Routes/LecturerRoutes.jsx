import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssignedIssues from '../LecturerDashboard/Pages/AssignedIssues.jsx';
import LecturerDashboard from '../LecturerDashboard/Pages/Dashboard.jsx';
import LecturerNotifications from '../LecturerDashboard/Pages/LecturerNotifications.jsx';
import ResolvedIssues from '../LecturerDashboard/Pages/ResolvedIssues.jsx';
import LecturerProfileAndSettings from '../LecturerDashboard/Pages/LecturerProfileAndSettings.jsx';

function LecturerRoutes({ isAuthenticated, profilePic, setProfilePic }) {
    return (
        <Routes>
            <Route
                path="home"
                element={isAuthenticated ? <LecturerDashboard /> : <Navigate to="/welcome" />}
            />
            <Route
                path="assigned-issues"
                element={isAuthenticated ? <AssignedIssues /> : <Navigate to="/welcome" />}
            />
            <Route
                path="resolved-issues"
                element={isAuthenticated ? <ResolvedIssues /> : <Navigate to="/welcome" />}
            />
            <Route
                path="notifications"
                element={isAuthenticated ? <LecturerNotifications /> : <Navigate to="/welcome" />}
            />
            <Route
                path="profile-and-settings"
                element={isAuthenticated ? (
                    <LecturerProfileAndSettings profilePic={profilePic} setProfilePic={setProfilePic} />
                ) : (
                    <Navigate to="/welcome" />
                )}
            />
        </Routes>
    );
}

export default LecturerRoutes;
