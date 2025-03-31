import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from "./StudentsDashboard/Components/NavBar.jsx";
import SideBar from "./StudentsDashboard/Components/SideBar.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import OtpVerification from "./Welcome/OtpVerification";
import StudentRoutes from "./Routes/StudentRoutes.jsx";
import LecturerRoutes from "./Routes/LecturerRoutes.jsx";
import './styles.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(""); 
    const [profilePic, setProfilePic] = useState(null);
    const location = useLocation();

    return (
        <div>
            {location.pathname !== '/welcome' && isAuthenticated && (
                <NavBar setIsAuthenticated={setIsAuthenticated} profilePic={profilePic} />
            )}
            <div className="main-layout">
                {isAuthenticated && location.pathname !== '/welcome' && <SideBar userType={userType} />}
                <div className="main-content">
                    <div className="content">
                        <Routes>
                            
                            <Route
                                path="/welcome"
                                element={<Welcome setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />}
                            />
                            <Route path="/otp-verification" element={<OtpVerification />} />

                            
                            <Route
                                path="/"
                                element={
                                    isAuthenticated ? (
                                        userType === "student" ? (
                                            <Navigate to="/student/home" />
                                        ) : userType === "lecturer" ? (
                                            <Navigate to="/lecturer/home" />
                                        ) : (
                                            <Navigate to="/welcome" />
                                        )
                                    ) : (
                                        <Navigate to="/welcome" />
                                    )
                                }
                            />

                            
                            <Route
                                path="/*"
                                element={
                                    userType === "student" ? (
                                        <StudentRoutes
                                            isAuthenticated={isAuthenticated}
                                            profilePic={profilePic}
                                            setProfilePic={setProfilePic}
                                        />
                                    ) : (
                                        <LecturerRoutes isAuthenticated={isAuthenticated} />
                                    )
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;