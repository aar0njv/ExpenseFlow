import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import './LoginForm.css';

export const LoginForm = ({ switchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`[Demo UI] Login submitted for: ${email}`);
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
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

            {/* Submit Button */}
            <button type="submit" className="form-submit-btn">
                <LogIn size={18} /> Sign In
            </button>

            {/* Switch to Register */}
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
