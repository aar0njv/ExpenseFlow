import React, { useState } from 'react';
import { User, Mail, Lock, DollarSign, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';
import './RegisterForm.css';

export const RegisterForm = ({ switchToLogin }) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [balance, setBalance] = useState('1000');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password, balance);
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Account creation failed. Email may already be registered.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}>
                    {error}
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
            </div>

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

            <div className="form-group">
                <label className="form-label">Initial Account Balance ($)</label>
                <div className="input-wrapper">
                    <DollarSign size={18} className="input-icon dollar" />
                    <input
                        type="number"
                        min="0"
                        step="10"
                        className="form-input"
                        placeholder="1000"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="form-submit-btn" disabled={loading}>
                <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Switch to Login */}
            <div className="form-footer-text">
                Already have an account?
                <button type="button" className="form-link-btn" onClick={switchToLogin}>
                    Sign In
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
