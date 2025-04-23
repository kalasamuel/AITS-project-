import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Assigned from "../RegistrarDashboard/Pages/Assigned.jsx";
import RegistrarDashboard from '../RegistrarDashboard/Pages/Dashboard.jsx';
import Assignment from '../RegistrarDashboard/Pages/Assignment.jsx';
import ResolvedIssues from '../RegistrarDashboard/Pages/RegistrarResolvedIssues.jsx';
import RegistrarProfileAndSettings from '../RegistrarDashboard/Pages/RegistrarProfileAndSettings.jsx';

function RegistrarRoutes({ isAuthenticated, profilePic, setProfilePic }) {
  return (
    <Routes>
      <Route
        path="home"
        element={isAuthenticated ? <RegistrarDashboard /> : <Navigate to="/welcome" />}
      />

      <Route
        path="assignment"
        element={isAuthenticated ? <Assignment /> : <Navigate to="/welcome" />}
      />

      <Route
        path="assigned"
        element={isAuthenticated ? <Assigned /> : <Navigate to="/welcome" />}
      />

      <Route
        path="resolved-issues"
        element={isAuthenticated ? <ResolvedIssues /> : <Navigate to="/welcome" />}
      />

      <Route
        path="profile-and-settings"
        element={
          isAuthenticated ? (
            <RegistrarProfileAndSettings profilePic={profilePic} setProfilePic={setProfilePic} />
          ) : (
            <Navigate to="/welcome" />
          )
        }
      />

    </Routes>
  );
}

export default RegistrarRoutes;
