import { useState, useEffect } from 'react';

const useIsAuthenticated = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userRole = localStorage.getItem('user_role');

        if (accessToken && refreshToken) {
            setIsAuthenticated(true);
            if(userRole){
                setUserRole(userRole);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []); // Empty dependency array so it runs only once when the component mounts

    return {isAuthenticated, userRole};
};

export default useIsAuthenticated;
