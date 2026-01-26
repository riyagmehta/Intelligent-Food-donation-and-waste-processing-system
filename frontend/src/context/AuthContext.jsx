import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Helper to extract role from JWT token
const getRoleFromToken = (decoded) => {
    // The backend stores roles as comma-separated string in 'roles' claim
    const rolesStr = decoded.roles || '';
    if (rolesStr.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
    if (rolesStr.includes('ROLE_STAFF')) return 'ROLE_STAFF';
    if (rolesStr.includes('ROLE_DRIVER')) return 'ROLE_DRIVER';
    return 'ROLE_DONOR';
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const role = getRoleFromToken(decoded);

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
            const role = getRoleFromToken(decoded);

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
            const role = getRoleFromToken(decoded);

            setUser({ username: decoded.sub, token, role });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || error.response?.data || 'Signup failed'
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