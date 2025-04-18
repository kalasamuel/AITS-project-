import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Assigned from "../RegistrarDashboard/Pages/Assigned.jsx";
import RegistrarDashboard from '../RegistrarDashboard/Pages/Dashboard.jsx';
import Assignment from '../RegistrarDashboard/Pages/Assignment.jsx';
import ResolvedIssues from '../RegistrarDashboard/Pages/RegistrarResolvedIssues.jsx';
import RegistrarProfileAndSettings from '../RegistrarDashboard/Pages/RegistrarProfileAndSettings.jsx';

function RegistrarRoutes({ isAuthenticated, profilePic, setProfilePic }) {
  // Redirect to the welcome page if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/welcome" />;
  }

  return (
    <Routes>
      <Route path="/registrar/home" element={<RegistrarDashboard />} />

      <Route path="/registrar/assignment" element={<Assignment />} />

      <Route path="/registrar/assigned" element={<Assigned />} />

      <Route path="/registrar/resolved-issues" element={<ResolvedIssues />} />

      <Route
        path="/registrar/profile-and-settings"
        element={<RegistrarProfileAndSettings profilePic={profilePic} setProfilePic={setProfilePic} />}
      />

      <Route path="*" element={<Navigate to="/registrar/home" />} />
    </Routes>
  );
}

export default RegistrarRoutes;