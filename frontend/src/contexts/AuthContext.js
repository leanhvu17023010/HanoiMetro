import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authStep, setAuthStep] = useState('login'); // 'login', 'register', 'forgot-password', 'verify-code'
    const [registerStep, setRegisterStep] = useState(1);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
    const [authRedirectPath, setAuthRedirectPath] = useState(null);
    const [token, setToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { getStoredToken } = await import('../services/api');
                const storedToken = getStoredToken();
                if (storedToken) {
                    setToken(storedToken);
                    // fetchRole will be triggered by token change useEffect
                } else {
                    setIsLoading(false);
                }
            } catch (e) {
                console.error('Auth initialization error:', e);
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const login = (newToken, role = null) => {
        setToken(newToken);
        if (role) setUserRole(role);
        window.dispatchEvent(new Event('tokenUpdated'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('displayName');
        sessionStorage.removeItem('token');
        setToken(null);
        setUserRole(null);
        window.dispatchEvent(new Event('tokenUpdated'));
    };

    const fetchRole = async (tk) => {
        setIsLoading(true);
        try {
            const { getMyInfo } = await import('../services/api');
            const data = await getMyInfo(tk);
            const role = data?.role?.name || data?.role;
            setUserRole(role);
        } catch (e) {
            console.error('Fetch role error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchRole(token);
    }, [token]);

    const openLoginModal = (redirectPath = null) => {
        setAuthStep('login');
        setAuthRedirectPath(redirectPath || null);
        setAuthModalOpen(true);
    };

    const openRegisterModal = () => {
        setAuthStep('register');
        setRegisterStep(1);
        setAuthModalOpen(true);
    };

    const openForgotPasswordModal = () => {
        setAuthStep('forgot-password');
        setForgotPasswordStep(1);
        setAuthModalOpen(true);
    };

    const switchToLogin = () => {
        setAuthStep('login');
        setAuthModalOpen(true);
    };

    const switchToRegister = () => {
        setAuthStep('register');
        setAuthModalOpen(true);
    };

    const switchToForgotPassword = () => {
        setAuthStep('forgot-password');
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
        setAuthRedirectPath(null);
    };

    const value = {
        token,
        userRole,
        isLoading,
        login,
        logout,
        authModalOpen,
        authStep,
        registerStep,
        forgotPasswordStep,
        openLoginModal,
        openRegisterModal,
        openForgotPasswordModal,
        switchToLogin,
        switchToRegister,
        switchToForgotPassword,
        closeAuthModal,
        authRedirectPath,
        setAuthRedirectPath,
        setAuthStep,
        setRegisterStep,
        setForgotPasswordStep,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
