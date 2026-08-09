import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

export const LoginForm = ({ switchToRegister }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // Login successful!
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Login failed. Please check your credentials or verify backend server is running.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {/* Error Alert Box */}
            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}>
                    {error}
                </div>
            )}

            {/* Email Input */}
            <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button type="submit" className="form-submit-btn" disabled={loading}>
                <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="form-footer-text">
                Don't have an account?
                <button type="button" className="form-link-btn" onClick={switchToRegister}>
                    Create Account
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
