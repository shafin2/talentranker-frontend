import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const Landing = () => {
  const { loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
