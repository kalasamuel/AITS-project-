import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from "./LectureDashboard/Components/NavBar.jsx";
import SideBar from "./LectureDashboard/Components/SideBar.jsx";
import Home from "./LectureDashboard/Pages/Home.jsx";
import IssueSubmission from "./LectureDashboard/Pages/IssueSubmission.jsx";
import IssueDetails from "./LectureDashboard/Pages/IssueDetails.jsx";
import Notifications from "./LectureDashboard/Pages/Notifications.jsx";
import ProfileAndSettings from "./LectureDashboard/Pages/ProfileAndSettings.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import './styles.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const location = useLocation(); 

    return (
        <div>
            
            {location.pathname !== '/welcome' && isAuthenticated && (
                <NavBar setIsAuthenticated={setIsAuthenticated} />
            )}
            <div className="main-layout">
                {isAuthenticated && location.pathname !== '/welcome' && <SideBar />}
                <div className="main-content">
                    <div className="content">
                        <Routes>
                            <Route
                                path="/welcome"
                                element={<Welcome setIsAuthenticated={setIsAuthenticated} />}
                            />
                            <Route
                                path="/"
                                element={isAuthenticated ? <Home /> : <Navigate to="/welcome" />}
                            />
                            <Route
                                path="/issuesubmission"
                                element={isAuthenticated ? <IssueSubmission /> : <Navigate to="/welcome" />}
                            />
                            <Route
                                path="/issuedetails"
                                element={isAuthenticated ? <IssueDetails /> : <Navigate to="/welcome" />}
                            />
                            <Route
                                path="/notifications"
                                element={isAuthenticated ? <Notifications /> : <Navigate to="/welcome" />}
                            />
                            <Route
                                path="/profileandsettings"
                                element={isAuthenticated ? <ProfileAndSettings /> : <Navigate to="/welcome" />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;