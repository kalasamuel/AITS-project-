import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from "./StudentsDashboard/Components/NavBar.jsx";
import SideBar from "./StudentsDashboard/Components/SideBar.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import StudentRoutes from "./Routes/StudentRoutes.jsx";
import LecturerRoutes from "./Routes/LecturerRoutes.jsx";
import RegistrarRoutes from "./Routes/RegistrarRoutes.jsx";
import OtpVerification from "./Welcome/OtpVerification.jsx";
import './styles.css';
import useIsAuthenticated from '../hooks/useIsAuthenticated.js';
import DashboardLayout from './StudentsDashboard/Components/DashboardLayout.jsx';
import ForgotPassword from './Welcome/ForgotPassword';
import ResetPassword from './Welcome/ResetPassword'
import axios from 'axios';

const token = localStorage.getItem('access_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
    const { isAuthenticated, userRole } = useIsAuthenticated();

    console.log("Auth Check:", { isAuthenticated, userRole });

    const [profilePic, setProfilePic] = useState(null);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div>
            {isAuthenticated && location.pathname !== '/welcome' ? (
                <DashboardLayout profilePic={profilePic} setProfilePic={setProfilePic} toggleSidebar={toggleSidebar}>
                    <Routes>
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/otp-verification" element={<OtpVerification />} />
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
                        <Route
                            path="/student/*"
                            element={
                                <StudentRoutes
                                    isAuthenticated={isAuthenticated}
                                    profilePic={profilePic}
                                    setProfilePic={setProfilePic}
                                />
                            }
                        />
                        <Route
                            path="/lecturer/*"
                            element={
                                <LecturerRoutes
                                    isAuthenticated={isAuthenticated}
                                    profilePic={profilePic}
                                    setProfilePic={setProfilePic}
                                />
                            }
                        />
                        <Route
                            path="/registrar/*"
                            element={
                                <RegistrarRoutes
                                    isAuthenticated={true}
                                    profilePic={profilePic}
                                    setProfilePic={setProfilePic}
                                />
                            }
                        />
                    </Routes>
                </DashboardLayout>
            ) : (
                <Routes>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/otp-verification" element={<OtpVerification />} />
                    <Route path="*" element={<Navigate to="/welcome" />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />                    
                </Routes>
            )}
        </div>
    );
}

export default App;