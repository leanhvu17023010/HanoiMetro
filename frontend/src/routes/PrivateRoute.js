import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { token, userRole, isLoading } = useAuth();

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && userRole !== requiredRole && userRole !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
