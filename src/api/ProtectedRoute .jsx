import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './usercontext'; 

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();

    // If user is not logged in, redirect to login
    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
