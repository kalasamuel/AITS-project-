import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Assigned from '../RegistrarDashboard/Pages/Assigned.jsx';
import Dashboard from '../RegistrarDashboard/Pages/Dashboard.jsx';
import Assignment from '../RegistrarDashboard/Pages/Assignment.jsx';
import RegistrarResolvedIssues from '../RegistrarDashboard/Pages/RegistrarResolvedIssues.jsx';

function RegistrarRoutes({ isAuthenticated }) {
    return (
        <Routes>
            <Route
                path="/registrar/home"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/welcome" />}
            />
            <Route
                path="/registrar/assignment"
                element={isAuthenticated ? < Assignment/> : <Navigate to="/welcome" />}
            />
            <Route
                path="/registrar/assigned"
                element={isAuthenticated ? <Assigned /> : <Navigate to="/welcome" />}
            />

            
            <Route
                path="/lecturer/resolved-issues"
                element={isAuthenticated ? <RegistrarResolvedIssues /> : <Navigate to="/welcome" />}
            />
             <Route
                path="/registrar/profile-and-settings"
                element={isAuthenticated ? <RegistrarProfileAndSettings /> : <Navigate to="/welcome" />}
                            />
        </Routes>
    );
}

export default RegistrarRoutes;