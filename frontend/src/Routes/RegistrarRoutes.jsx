import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Assigned from '../RegistrarDashboard/Pages/Assigned.jsx';
import RegistrarDashboard from '../RegistrarDashboard/Pages/Dashboard.jsx';
import Assignment from '../RegistrarDashboard/Pages/Assignment.jsx';
import RegistrarResolvedIssues from '../RegistrarDashboard/Pages/RegistrarResolvedIssues.jsx';
import ProfileAndsettings from '../RegistrarDashboard/Pages/RegistrarProfileAndsettings.jsx'; 
    function RegistrarRoutes({ isAuthenticated,profilePic, setProfilePic }) {
    return (
        <Routes>
            <Route
                path="/registrar/home"
                element={isAuthenticated ? <RegistrarDashboard /> : <Navigate to="/welcome" />}
            />
            <Route
                path="/registrar/assignment"
                element={isAuthenticated ? <Assignment /> : <Navigate to="/welcome" />}
            />
            <Route
                path="/registrar/assigned"
                element={isAuthenticated ? <Assigned /> : <Navigate to="/welcome" />}
            />
            <Route
                path="/registrar/resolved-issues"
                element={isAuthenticated ? <RegistrarResolvedIssues /> : <Navigate to="/welcome" />}
            />
            <Route
                path="/registrar/profile-and-settings"
                element={isAuthenticated ? <ProfileAndsettings profilePic={profilePic} setProfilePic={setProfilePic} /> : <Navigate to="/welcome" />}
            />
            <Route
                path="*"
                element={<Navigate to="/registrar/home" />}
            />
        </Routes>
    );
}

export default RegistrarRoutes;