import React from 'react';
import { Zap, ArrowLeftRight, PieChart } from 'lucide-react';
import './Features.css';

export const Features = () => {
    const features = [
        {
            icon: <Zap size={26} />,
            colorClass: 'emerald',
            title: 'Instant Balance Sync',
            description: 'Your account balance updates instantly the moment a deposit or withdrawal is logged, ensuring 100% financial accuracy in real time.',
        },
        {
            icon: <ArrowLeftRight size={26} />,
            colorClass: 'cyan',
            title: 'Seamless Transactions',
            description: 'Record incoming income and outgoing expenses with quick validation, clear type categorization, and searchable history.',
        },
        {
            icon: <PieChart size={26} />,
            colorClass: 'purple',
            title: 'Automated Analytics',
            description: 'Generate comprehensive financial reports comparing total deposits vs. withdrawals and net cash flow at any time.',
        },
    ];

    return (
        <section id="features" className="features-section">
            <div className="features-header">
                <div className="features-tag">Built For Clarity</div>
                <h2 className="features-title">Everything You Need to Manage Money</h2>
                <p className="features-description">
                    Engineered for speed and simplicity so you always know where your money stands.
                </p>
            </div>

            <div className="features-grid">
                {features.map((item, index) => (
                    <div key={index} className="feature-card">
                        <div className={`feature-icon-wrapper ${item.colorClass}`}>
                            {item.icon}
                        </div>
                        <h3 className="feature-card-title">{item.title}</h3>
                        <p className="feature-card-text">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
