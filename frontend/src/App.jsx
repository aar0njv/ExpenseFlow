import React from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Layout/Navbar/Navbar';
import Hero from './components/Landing/Hero/Hero';
import Features from './components/Landing/Features/Features';
import HowItWorks from './components/Landing/HowItWorks/HowItWorks';
import Auth from './components/Auth/Auth';
import Footer from './components/Layout/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Auth />
      </main>

      <Footer />
    </div>
  );
}

export default App;
