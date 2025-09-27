import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="font-inter">
        {/* Simple header for non-landing pages */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={
            <div>
              <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <Link
                      to="/"
                      className="flex items-center px-3 py-2 text-xl font-bold bg-gradient-primary bg-clip-text text-transparent"
                    >
                      TalentRanker
                    </Link>
                  </div>
                </div>
              </nav>
              <Auth />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App
