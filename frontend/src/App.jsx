import React from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Layout/Navbar/Navbar';
import Hero from './components/Landing/Hero/Hero';
import Features from './components/Landing/Features/Features';
import HowItWorks from './components/Landing/HowItWorks/HowItWorks';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Layout/Footer/Footer';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#10b981', fontSize: '1.2rem' }}>
        Loading ExpenseFlow...
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main>
        {isLoggedIn ? (
          <Dashboard />
        ) : (
          <>
            <Hero />
            <Features />
            <HowItWorks />
            <Auth />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
