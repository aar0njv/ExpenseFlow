import React from 'react';
import { ArrowRight, Shield, Sparkles, TrendingUp, ArrowDownLeft, ArrowUpRight, DollarSign, Wallet, CheckCircle2 } from 'lucide-react';
import './Hero.css';

export const Hero = () => {
    const scrollToSection = (e, targetId) => {
        e.preventDefault();
        const element = document.querySelector(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="home" className="hero-section">
            <div className="hero-glow primary-glow"></div>
            <div className="hero-glow accent-glow"></div>

            <div className="hero-container">

                <h1 className="hero-title animate-fade-in">
                    Master Your Money with <br />
                    <span className="gradient-text">Clarity & Confidence</span>
                </h1>

                <p className="hero-subtitle animate-fade-in">
                    Track your daily expenses, monitor account balances in real-time, and make smarter spending decisions with an intuitive dashboard built for real life.
                </p>


                <div className="hero-actions animate-fade-in">
                    <a href="#auth" className="hero-btn-primary" onClick={(e) => scrollToSection(e, '#auth')}>
                        Get Started Free <ArrowRight size={18} />
                    </a>
                    <a href="#how-it-works" className="hero-btn-secondary" onClick={(e) => scrollToSection(e, '#how-it-works')}>
                        Explore Features
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
