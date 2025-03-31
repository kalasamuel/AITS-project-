import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssignedIssues from '../LecturerDashboard/Pages/AssignedIssues.jsx';
import LecturerDashboard from '../LecturerDashboard/Pages/Dashboard.jsx';
import LecturerNotifications from '../LecturerDashboard/Pages/LecturerNotifications.jsx';
import ResolvedIssues from '../LecturerDashboard/Pages/ResolvedIssues.jsx';

function LecturerRoutes({ isAuthenticated }) {
    return (
        <Routes>
            {/* Lecturer Dashboard Home */}
            <Route
                path="/lecturer/home"
                element={isAuthenticated ? <LecturerDashboard /> : <Navigate to="/welcome" />}
            />

            {/* Assigned Issues */}
            <Route
                path="/lecturer/assigned-issues"
                element={isAuthenticated ? <AssignedIssues /> : <Navigate to="/welcome" />}
            />

            {/* Resolved Issues */}
            <Route
                path="/lecturer/resolved-issues"
                element={isAuthenticated ? <ResolvedIssues /> : <Navigate to="/welcome" />}
            />

            {/* Lecturer Notifications */}
            <Route
                path="/lecturer/notifications"
                element={isAuthenticated ? <LecturerNotifications /> : <Navigate to="/welcome" />}
            />
        </Routes>
    );
}

export default LecturerRoutes;