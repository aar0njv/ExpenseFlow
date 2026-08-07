import React from 'react';
import { UserPlus, CreditCard, BarChart3 } from 'lucide-react';
import './HowItWorks.css';

export const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: <UserPlus size={26} />,
            title: 'Create Your Account',
            description: 'Sign up in seconds with your email and set an initial balance to launch your account dashboard.',
        },
        {
            number: '02',
            icon: <CreditCard size={26} />,
            title: 'Log Income & Expenses',
            description: 'Record deposits or withdrawals anytime. Your total balance updates automatically with zero delay.',
        },
        {
            number: '03',
            icon: <BarChart3 size={26} />,
            title: 'Generate Reports',
            description: 'View aggregated financial metrics showing total deposits, withdrawals, and net cash flow.',
        },
    ];

    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="how-header">
                <div className="how-tag">Simple 3-Step Process</div>
                <h2 className="how-title">How ExpenseFlow Works</h2>
                <p className="how-description">
                    Designed for maximum speed and simplicity from day one.
                </p>
            </div>

            <div className="steps-grid">
                {steps.map((step, index) => (
                    <div key={index} className="step-card">
                        <div className="step-number">{step.number}</div>
                        <div className="step-icon">{step.icon}</div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-text">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
