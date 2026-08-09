import React from 'react';
import { TrendingUp } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Info on Left */}
                <div className="footer-brand">
                    <a href="#home" className="footer-logo">
                        <div className="logo-icon">
                            <TrendingUp size={20} />
                        </div>
                        <span>Expense<span className="gradient-text">Flow</span></span>
                    </a>
                    <span className="footer-tagline">
                        Decoupled financial tracking platform.
                    </span>
                </div>

                {/* Copyright on Right */}
                <div className="footer-copyright">
                    &copy; {new Date().getFullYear()} ExpenseFlow. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
