import React, { useState } from 'react';
import { User, Mail, Lock, DollarSign, Eye, EyeOff, UserPlus } from 'lucide-react';
import './LoginForm.css'; // Shared form styles
import './RegisterForm.css';

export const RegisterForm = ({ switchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [balance, setBalance] = useState('1000');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`[Demo UI] Account created for: ${name} (${email}) with initial balance: $${balance}`);
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {/* Full Name Input */}
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

            {/* Initial Balance Input */}
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
            <button type="submit" className="form-submit-btn">
                <UserPlus size={18} /> Create Account
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
