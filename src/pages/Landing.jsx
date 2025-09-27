import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="font-inter">
      <Navigation />
      <HeroSection />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Landing;
