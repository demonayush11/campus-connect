import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('cc_token');
        const stored = localStorage.getItem('cc_user');
        if (token && stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login({ email, password });
        localStorage.setItem('cc_token', data.token);
        localStorage.setItem('cc_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (body) => {
        const data = await authApi.register(body);
        localStorage.setItem('cc_token', data.token);
        localStorage.setItem('cc_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
        setUser(null);
    };

    const updateUser = (updated) => {
        const merged = { ...user, ...updated };
        localStorage.setItem('cc_user', JSON.stringify(merged));
        setUser(merged);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
