import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredToken, getUserRole, getApiBaseUrl } from '../services/utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getStoredToken('token'));
    const [userRole, setUserRole] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            if (token) {
                const role = await getUserRole(getApiBaseUrl(), token);
                setUserRole(role);
            } else {
                setUserRole(null);
            }
        };
        fetchRole();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        window.dispatchEvent(new Event('authChange'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUserRole(null);
        window.dispatchEvent(new Event('authChange'));
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <AuthContext.Provider value={{ token, userRole, login, logout, openLoginModal, closeLoginModal, isLoginModalOpen }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
