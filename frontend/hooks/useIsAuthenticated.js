import { useState, useEffect } from 'react';

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('access_token') && !!localStorage.getItem('refresh_token');
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('user_role');
  });

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const role = localStorage.getItem('user_role');

      setIsAuthenticated(!!accessToken && !!refreshToken);
      setUserRole(role);
    };

    // Listens for storage changes across browser tabs
    window.addEventListener('storage', checkAuth);

    // listens internally for changes in the same tab every 500ms (if needed)
    const interval = setInterval(checkAuth, 500);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  return { isAuthenticated, userRole };
};

export default useIsAuthenticated;