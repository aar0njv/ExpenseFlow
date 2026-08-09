import React, { useState, useEffect } from 'react';
import { TrendingUp, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e, targetId) => {
        e.preventDefault();
        setMobileOpen(false);
        const element = document.querySelector(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Brand Logo */}
                <a href="#home" className="navbar-logo" onClick={(e) => scrollToSection(e, '#home')}>
                    <div className="logo-icon">
                        <TrendingUp size={20} />
                    </div>
                    <span>Expense<span className="gradient-text">Flow</span></span>
                </a>

                {/* Desktop Nav Links */}
                <nav>
                    <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <a href="#dashboard" className="nav-link" onClick={(e) => scrollToSection(e, '#dashboard')}>
                                        <LayoutDashboard size={16} style={{ display: 'inline', marginRight: '4px' }} /> Dashboard
                                    </a>
                                </li>
                                <li>
                                    <span className="nav-link" style={{ color: '#10b981', fontWeight: '600' }}>
                                        {user?.name}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        className="nav-btn"
                                        onClick={logout}
                                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)' }}
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <a href="#home" className="nav-link" onClick={(e) => scrollToSection(e, '#home')}>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="nav-link" onClick={(e) => scrollToSection(e, '#features')}>
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#how-it-works" className="nav-link" onClick={(e) => scrollToSection(e, '#how-it-works')}>
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a href="#auth" className="nav-btn" onClick={(e) => scrollToSection(e, '#auth')}>
                                        Sign In / Register
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Mobile Hamburger Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
};

export default Navbar;
