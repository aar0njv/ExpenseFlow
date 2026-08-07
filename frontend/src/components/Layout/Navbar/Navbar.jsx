import React, { useState, useEffect } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
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
