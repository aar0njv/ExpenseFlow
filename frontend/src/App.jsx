import React from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Layout/Navbar/Navbar';
import HeroSection from './components/Landing/HeroSection/HeroSection';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Remaining Placeholders */}
        <section id="features" style={{ height: '80vh', padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
          <h2>Features Section Placeholder</h2>
        </section>

        <section id="how-it-works" style={{ height: '80vh', padding: '100px 24px' }}>
          <h2>How It Works Placeholder</h2>
        </section>

        <section id="auth" style={{ height: '80vh', padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
          <h2>Auth Section Placeholder</h2>
        </section>
      </main>
    </div>
  );
}

export default App;
