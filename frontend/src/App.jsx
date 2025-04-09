import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from "./StudentsDashboard/Components/NavBar.jsx";
import SideBar from "./StudentsDashboard/Components/SideBar.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import StudentRoutes from "./Routes/StudentRoutes.jsx";
import LecturerRoutes from "./Routes/LecturerRoutes.jsx";
import RegistrarRoutes from "./Routes/RegistrarRoutes.jsx";
import './styles.css';
import VerifyAccount from './Welcome/VerifictaionCode.jsx';
import useIsAuthenticated from '../hooks/useIsAuthenticated.js';

function App() {
    const { isAuthenticated, userRole } = useIsAuthenticated();
    const [userType, setUserType] = useState(""); 
    const [profilePic, setProfilePic] = useState(null);
    const location = useLocation();

    return (
        <div>
            {location.pathname !== '/welcome' && isAuthenticated && (
                <NavBar  profilePic={profilePic} />
            )}
            <div className="main-layout">
                {(isAuthenticated && location.pathname !== '/welcome') && <SideBar userType={userRole} />}
                <div className="main-content">
                    <div className="content">
                        <Routes>
                            <Route
                                path="/welcome"
                                element={<Welcome setUserType={setUserType} />}
                            />
<<<<<<< HEAD

                            <Route path="/otp-verification" element={<VerifyAccount  />} />
=======
                            <Route path="/otp-verification" element={<OtpVerification email = "institutional_email"/>} />
>>>>>>> 4d9cc2ef6271b16cac6d9fa23f9290f1a24067ed

                            <Route
                                path="/"
                                element={
                                    isAuthenticated ? (
                                        userRole === "student" ? (
                                            <Navigate to="/student/home" />
                                        ) : userRole === "lecturer" ? (
                                            <Navigate to="/lecturer/home" />
                                        ) : userRole === "registrar" ? (
                                            <Navigate to="/registrar/home" />
                                        ) : (
                                            <Navigate to="/welcome" />
                                        )
                                    ) : (
                                        <Navigate to="/welcome" />
                                    )
                                }
                            />

                            <Route path="/student/*" 
                                element={
                                <StudentRoutes
                                    isAuthenticated={isAuthenticated}
                                    profilePic={profilePic}
                                    setProfilePic={setProfilePic}
                                />} 
                            />

                            <Route path="/lecturer/*" 
                                element={
                                <LecturerRoutes
                                    isAuthenticated={isAuthenticated}
                                    profilePic={profilePic}
                                    setProfilePic={setProfilePic}
                                />} 
                            />

                            <Route path="/registrar/*" 
                                element={
                                <RegistrarRoutes
                                    isAuthenticated={isAuthenticated}
                                    profilePic={profilePic}
                                    setProfilePic={setProfilePic}
                                />} 
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
