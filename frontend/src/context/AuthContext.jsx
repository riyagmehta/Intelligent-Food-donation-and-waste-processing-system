import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // For now, we'll determine role from username
                // In production, you'd fetch user details from backend
                let role = 'ROLE_DONOR';
                if (decoded.sub === 'admin') role = 'ROLE_ADMIN';
                if (decoded.sub === 'staff') role = 'ROLE_STAFF';

                setUser({ username: decoded.sub, token, role });
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token } = response.data;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            // Determine role from username for testing
            let role = 'ROLE_DONOR';
            if (credentials.username === 'admin') role = 'ROLE_ADMIN';
            if (credentials.username === 'staff') role = 'ROLE_STAFF';

            setUser({ username: decoded.sub, token, role });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            const { token } = response.data;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            // Signup always creates DONOR role
            setUser({ username: decoded.sub, token, role: 'ROLE_DONOR' });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};