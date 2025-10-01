import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI, usageAPI, planAPI } from '../services/api';
import { detectUserCountry } from '../utils/countryDetection';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dashboard state
  const [userData, setUserData] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Upload state
  const [selectedJD, setSelectedJD] = useState(null);
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Detect user country for plan filtering
      const userCountry = detectUserCountry();
      
      // Load user profile and usage stats
      const [userResponse, usageResponse, plansResponse] = await Promise.all([
        userAPI.getCurrentUser(),
        userAPI.getUsageStats(),
        userAPI.getAvailablePlans(userCountry)
      ]);

      setUserData(userResponse.user);
      setUsageStats(usageResponse.usage);
      setAvailablePlans(plansResponse.plans);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleJDUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setSelectedJD(file);
    } else {
      alert('Please select a PDF or text file for the job description.');
    }
  };

  const handleCVUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || file.type === 'text/plain'
    );
    
    if (validFiles.length !== files.length) {
      alert('Some files were not added. Please only select PDF or text files.');
    }
    
    setSelectedCVs([...selectedCVs, ...validFiles]);
  };

  const removeJD = () => {
    setSelectedJD(null);
  };

  const removeCV = (index) => {
    setSelectedCVs(selectedCVs.filter((_, i) => i !== index));
  };

  const handleRankCandidates = async () => {
    if (!selectedJD) {
      alert('Please upload a job description first.');
      return;
    }
    
    if (selectedCVs.length === 0) {
      alert('Please upload at least one CV.');
      return;
    }

    setUploading(true);
    try {
      // Upload JD first
      await usageAPI.uploadJD(selectedJD);
      
      // Upload CVs
      await usageAPI.uploadCV(selectedCVs);
      
      // Generate mock results for demonstration
      const mockResults = selectedCVs.map((cv, index) => ({
        id: index + 1,
        candidate: cv.name,
        prediction: Math.random() > 0.5 ? 'Relevant' : 'Not Relevant',
        confidence: (Math.random() * 40 + 60).toFixed(1) // 60-100%
      }));
      
      setResults(mockResults);
      setShowResults(true);
      
      // Refresh usage stats
      const updatedUsage = await userAPI.getUsageStats();
      setUsageStats(updatedUsage.usage);
      
    } catch (error) {
      console.error('Failed to process files:', error);
      alert('Failed to process files. Please check your usage limits and try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform md:translate-x-0 md:static md:inset-0 transition duration-200 ease-in-out md:transition-none`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gradient-primary text-white">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">TR</span>
            </div>
            <span className="font-bold text-lg">TalentRanker</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
              { id: 'pricing', name: 'Pricing Plans', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`${
                  activeSection === item.id
                    ? 'bg-primary-100 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md w-full transition-colors`}
              >
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userData?.name}</p>
              <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden -ml-2 mr-2 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeSection === 'dashboard' ? 'Dashboard' : 
                 activeSection === 'pricing' ? 'Pricing Plans' : 'Settings'}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'dashboard' && (
            <DashboardSection
              userData={userData}
              usageStats={usageStats}
              selectedJD={selectedJD}
              selectedCVs={selectedCVs}
              uploading={uploading}
              results={results}
              showResults={showResults}
              onJDUpload={handleJDUpload}
              onCVUpload={handleCVUpload}
              onRemoveJD={removeJD}
              onRemoveCV={removeCV}
              onRankCandidates={handleRankCandidates}
            />
          )}
          {activeSection === 'pricing' && (
            <PricingSection availablePlans={availablePlans} currentPlan={userData?.plan} />
          )}
          {activeSection === 'settings' && (
            <SettingsSection userData={userData} onUpdateUser={loadUserData} />
          )}
        </main>
      </div>
    </div>
  );
};

// Dashboard Section Component
const DashboardSection = ({ 
  userData, 
  usageStats, 
  selectedJD, 
  selectedCVs, 
  uploading, 
  results, 
  showResults,
  onJDUpload, 
  onCVUpload, 
  onRemoveJD, 
  onRemoveCV, 
  onRankCandidates 
}) => (
  <div className="space-y-6">
    {/* Welcome Header */}
    <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Welcome back, {userData?.name}!</h2>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
          <span className="font-medium">JDs:</span> {usageStats?.jdUsed || 0} / {usageStats?.jdLimit === -1 ? '∞' : usageStats?.jdLimit || 0}
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
          <span className="font-medium">CVs:</span> {usageStats?.cvUsed || 0} / {usageStats?.cvLimit === -1 ? '∞' : usageStats?.cvLimit || 0}
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
          <span className="font-medium">Plan:</span> {userData?.plan?.name || 'No Plan'}
        </div>
      </div>
    </div>

    {/* Upload Section */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload & Rank Candidates</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* JD Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="jd-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload Job Description
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF or Text files only
                </span>
                <input
                  id="jd-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.txt"
                  onChange={onJDUpload}
                />
                <div className="mt-2">
                  <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Choose File
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M16 8H6a2 2 0 00-2 2v36a2 2 0 002 2h36a2 2 0 002-2V10a2 2 0 00-2-2H32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 2v8H8m20 4l-4 4m0 0l-4-4m4 4V10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="cv-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload CVs (Multiple)
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF or Text files only
                </span>
                <input
                  id="cv-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  accept=".pdf,.txt"
                  onChange={onCVUpload}
                />
                <div className="mt-2">
                  <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Choose Files
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* File Lists */}
      {(selectedJD || selectedCVs.length > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files:</h4>
          
          {/* JD File */}
          {selectedJD && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-700 mb-1">Job Description:</h5>
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <span className="text-sm text-blue-800">{selectedJD.name}</span>
                <button
                  onClick={onRemoveJD}
                  className="text-primary hover:text-blue-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* CV Files */}
          {selectedCVs.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-1">CVs ({selectedCVs.length}):</h5>
              <div className="space-y-1">
                {selectedCVs.map((cv, index) => (
                  <div key={index} className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
                    <span className="text-sm text-indigo-800">{cv.name}</span>
                    <button
                      onClick={() => onRemoveCV(index)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rank Button */}
      <div className="text-center">
        <button
          onClick={onRankCandidates}
          disabled={!selectedJD || selectedCVs.length === 0 || uploading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Rank Candidates'
          )}
        </button>
      </div>
    </div>

    {/* Results Section */}
    {showResults && (
      <ResultsSection results={results} />
    )}
  </div>
);

// Results Section Component
const ResultsSection = ({ results }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking Results</h3>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prediction
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confidence
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result) => (
            <tr key={result.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {result.candidate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  result.prediction === 'Relevant' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.prediction}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {result.confidence}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination placeholder */}
    <div className="mt-6 flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </button>
        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{results.length}</span> of{' '}
            <span className="font-medium">{results.length}</span> results
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Pricing Section Component
const PricingSection = ({ availablePlans, currentPlan }) => {
  const [selectedBilling, setSelectedBilling] = useState('Monthly');

  // Group plans by name and billing cycle
  const groupedPlans = availablePlans.reduce((acc, plan) => {
    // Skip freemium plan in pricing section
    if (plan.name === 'Freemium') return acc;
    
    if (!acc[plan.name]) {
      acc[plan.name] = {
        name: plan.name,
        description: plan.description,
        jdLimit: plan.jdLimit,
        cvLimit: plan.cvLimit,
        features: plan.features,
        billingOptions: []
      };
    }
    
    if (plan.billingOptions && plan.billingOptions.length > 0) {
      acc[plan.name].billingOptions.push(...plan.billingOptions);
    }
    
    return acc;
  }, {});

  const planArray = Object.values(groupedPlans);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-2 text-gray-600">Select the plan that best fits your needs</p>
        
        {/* Billing Cycle Toggle */}
        {planArray.length > 0 && planArray[0].billingOptions.length > 1 && (
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-xl p-1 shadow-md">
              {['Monthly', 'SixMonth', 'Annual'].map((billing) => (
                <button
                  key={billing}
                  onClick={() => setSelectedBilling(billing)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedBilling === billing
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {billing === 'SixMonth' ? '6 Months' : billing}
                  {billing === 'SixMonth' && <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">20% OFF</span>}
                  {billing === 'Annual' && <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">33% OFF</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {planArray.map((plan, index) => {
          // Find the billing option for selected cycle
          const billingOption = plan.billingOptions?.find(b => b.billingCycle === selectedBilling) || plan.billingOptions?.[0];
          
          if (!billingOption) return null;
          
          return (
            <div key={index} className={`bg-white rounded-lg shadow border p-6 ${
              plan.name === 'Growth' ? 'border-primary-500 border-2' : 'border-gray-200'
            }`}>
              {plan.name === 'Growth' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {billingOption.price ? 
                        `${availablePlans[0]?.currency === 'PKR' ? 'Rs' : '$'} ${billingOption.price}` 
                        : 'Custom'
                      }
                    </span>
                    {billingOption.billingCycle && (
                      <span className="ml-1 text-sm text-gray-600">
                        /{billingOption.billingCycle === 'SixMonth' ? '6 months' : billingOption.billingCycle?.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>JD Limit:</span>
                    <span className="font-medium">{plan.jdLimit === -1 || plan.jdLimit === null ? 'Unlimited' : plan.jdLimit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CV Limit:</span>
                    <span className="font-medium">{plan.cvLimit === -1 || plan.cvLimit === null ? 'Unlimited' : plan.cvLimit}</span>
                  </div>
                </div>
                
                {plan.features && plan.features.length > 0 && (
                  <div className="mt-4">
                    <ul className="space-y-1 text-sm text-gray-600">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                    currentPlan?.name === plan.name
                      ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                      : 'bg-gradient-primary text-white hover:opacity-90'
                  }`}
                  disabled={currentPlan?.name === plan.name}
                >
                  {currentPlan?.name === plan.name ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Settings Section Component
const SettingsSection = ({ userData, onUpdateUser }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
      <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
    </div>

    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={userData?.name || ''}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userData?.email || ''}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Plan</label>
            <input
              type="text"
              value={userData?.plan?.name || 'No Plan'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <input
              type="text"
              value={userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;