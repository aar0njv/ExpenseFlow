import React from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Layout/Navbar/Navbar';
import Hero from './components/Landing/Hero/Hero';
import Features from './components/Landing/Features/Features';
import HowItWorks from './components/Landing/HowItWorks/HowItWorks';
import Footer from './components/Layout/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />

        {/* Remaining Placeholder for Auth */}
        <section id="auth" style={{ height: '80vh', padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
          <h2>Auth Section Placeholder</h2>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
