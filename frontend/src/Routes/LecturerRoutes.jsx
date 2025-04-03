import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssignedIssues from '../LecturerDashboard/Pages/AssignedIssues.jsx';
import LecturerDashboard from '../LecturerDashboard/Pages/Dashboard.jsx';
import LecturerNotifications from '../LecturerDashboard/Pages/LecturerNotifications.jsx';
import ResolvedIssues from '../LecturerDashboard/Pages/ResolvedIssues.jsx';
import LecturerProfileAndSettings from '../LecturerDashboard/Pages/LecturerProfileAndSettings.jsx';

function LecturerRoutes({ isAuthenticated }) {
    return (
        <Routes>
        
            <Route
                path="/lecturer/home"
                element={isAuthenticated ? <LecturerDashboard /> : <Navigate to="/welcome" />}
            />

            <Route
                path="/lecturer/assigned-issues"
                element={isAuthenticated ? <AssignedIssues /> : <Navigate to="/welcome" />}
            />

            <Route
                path="/lecturer/resolved-issues"
                element={isAuthenticated ? <ResolvedIssues /> : <Navigate to="/welcome" />}
            />
            <Route
                path="/lecturer/notifications"
                element={isAuthenticated ? <LecturerNotifications /> : <Navigate to="/welcome" />}
            />
             <Route
                path="/lecturer/profile-and-settings"
                element={isAuthenticated ? <LecturerProfileAndSettings /> : <Navigate to="/welcome" />}
                            />
        </Routes>
    );
}

export default LecturerRoutes;