import React from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import './HeroSection.css';

export const HeroSection = () => {
    return (
        <section id="home" className="hero-section">
            <div className="hero-glow"></div>

            <div className="hero-container">
                <div className="hero-badge animate-fade-in">
                    <ShieldCheck size={16} />
                    <span>Effortless Personal Finance Tracking</span>
                </div>

                <h1 className="hero-title animate-fade-in">
                    Smart Financial Tracking with <br />
                    <span className="gradient-text">Decoupled Precision</span>
                </h1>


                <p className="hero-subtitle animate-fade-in">
                    Monitor your spending, track your balances, and generate instant financial summaries—all in one clean, intuitive dashboard.
                </p>

                <div className="hero-actions animate-fade-in">
                    <a href="#auth" className="hero-btn-primary">
                        Get Started <ArrowRight size={18} />
                    </a>
                    <a href="#how-it-works" className="hero-btn-secondary">
                        Explore Features
                    </a>
                </div>

                <div className="hero-preview animate-float">
                    <div className="preview-header">
                        <div>
                            <div className="preview-title">Total Active Account Balance</div>
                            <div className="preview-balance">$14,850.50</div>
                        </div>
                        <div className="preview-badge">
                            <TrendingUp size={16} />
                            <span>+18.4% this month</span>
                        </div>
                    </div>

                    <div className="preview-stats">
                        <div className="stat-box">
                            <div className="stat-label">Total Deposits</div>
                            <div className="stat-value deposit">+$18,200.00</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Total Withdrawals</div>
                            <div className="stat-value withdrawal">-$3,349.50</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Services Status</div>
                            <div className="stat-value" style={{ color: '#06b6d4', fontSize: '0.95rem' }}>
                                🟢 Real-Time Sync Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
