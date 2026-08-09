import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                setAuthToken(token);
                try {
                    const userData = await authService.getCurrentUser(token);
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        const newToken = data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setAuthToken(newToken);

        const userData = await authService.getCurrentUser(newToken);
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password, balance) => {
        await authService.register(name, email, password, balance);
        return await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setAuthToken(null);
    };

    const refreshUser = async () => {
        if (token) {
            try {
                const userData = await authService.getCurrentUser(token);
                setUser(userData);
            } catch (err) {
                console.error('Failed to refresh user data:', err);
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loading,
                isLoggedIn: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
