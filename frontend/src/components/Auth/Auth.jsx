import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';

export const Auth = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <section id="auth" className="auth-section">
            <div className="auth-header">
                <div className="auth-tag">Get Started</div>
                <h2 className="auth-title">Welcome to ExpenseFlow</h2>
                <p className="auth-subtitle">
                    {activeTab === 'login'
                        ? 'Sign in to access your dashboard & transaction history'
                        : 'Create an account to start tracking your finances'}
                </p>
            </div>

            <div className="auth-card">
                {/* Tab Toggle */}
                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Create Account
                    </button>
                </div>

                {/* Form rendering */}
                {activeTab === 'login' ? (
                    <LoginForm switchToRegister={() => setActiveTab('register')} />
                ) : (
                    <RegisterForm switchToLogin={() => setActiveTab('login')} />
                )}
            </div>
        </section>
    );
};

export default Auth;
