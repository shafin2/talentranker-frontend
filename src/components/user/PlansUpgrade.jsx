import React, { useState, useEffect } from 'react';
import apiClient from '../../services/auth';
import { useToast } from '../../contexts/ToastContext';

const PlansUpgrade = ({ currentPlan, onUpdate }) => {
  const { addToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRegion, setShowRegion] = useState('International');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading plans...');
      const response = await apiClient.get('/users/plans');
      console.log('✅ Plans loaded:', response.data);
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('❌ Failed to load plans:', error);
      addToast(error.response?.data?.message || 'Failed to load plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setMessage('');
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan) return;

    setSubmitting(true);
    try {
      await apiClient.post('/users/upgrade-request', {
        planId: selectedPlan._id,
        message
      });
      
      addToast('Upgrade request submitted! An admin will review it soon.', 'success');
      setShowModal(false);
      setSelectedPlan(null);
      setMessage('');
      onUpdate();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getPlanBadge = (name) => {
    const colors = {
      'Freemium': 'bg-gray-100 text-gray-800',
      'Starter': 'bg-blue-100 text-blue-800',
      'Growth': 'bg-green-100 text-green-800',
      'Pro': 'bg-purple-100 text-purple-800',
      'Enterprise': 'bg-indigo-100 text-indigo-800'
    };
    return colors[name] || 'bg-gray-100 text-gray-800';
  };

  const isCurrentPlan = (plan) => {
    return currentPlan?._id === plan._id;
  };

  // Filter plans: remove Freemium, filter by region, and sort to show Enterprise last
  const filteredPlans = plans
    .filter(plan => plan.name !== 'Freemium') // Hide Freemium
    .filter(plan => plan.region === showRegion || plan.region === 'Global')
    .sort((a, b) => {
      // Enterprise always last
      if (a.name === 'Enterprise') return 1;
      if (b.name === 'Enterprise') return -1;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <p className="text-gray-600 mt-1">Choose a plan that fits your needs</p>
        </div>

        {/* Region Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setShowRegion('Pakistan')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              showRegion === 'Pakistan'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🇵🇰 Pakistan
          </button>
          <button
            onClick={() => setShowRegion('International')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              showRegion === 'International'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌍 International
          </button>
        </div>
      </div>

      {/* Current Plan Banner */}
      {currentPlan && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Your Current Plan</p>
              <h3 className="text-2xl font-bold mt-1">{currentPlan.name}</h3>
              <p className="text-indigo-100 mt-2">
                {currentPlan.price ? `${currentPlan.currency} ${currentPlan.price}` : 'Free'}
                {currentPlan.billingCycle && ` / ${currentPlan.billingCycle}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm">JD Limit</p>
              <p className="text-2xl font-bold">{currentPlan.jdLimit || '∞'}</p>
              <p className="text-indigo-100 text-sm mt-2">CV Limit</p>
              <p className="text-2xl font-bold">{currentPlan.cvLimit || '∞'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan._id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
              isCurrentPlan(plan)
                ? 'border-indigo-500 ring-2 ring-indigo-200'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="p-6">
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlanBadge(plan.name)}`}>
                  {plan.name}
                </span>
                {isCurrentPlan(plan) && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    ✓ Current
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                {plan.price ? (
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.currency === 'PKR' ? 'Rs' : '$'}{plan.price}
                    </span>
                    {plan.billingCycle && (
                      <span className="text-gray-600 ml-2">/ {plan.billingCycle}</span>
                    )}
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-gray-900">Free</div>
                )}
              </div>

              {/* Description */}
              {plan.description && (
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              )}

              {/* Limits */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">JD Limit:</span>
                  <span className="font-semibold text-gray-900">
                    {plan.jdLimit || 'Unlimited'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">CV Limit:</span>
                  <span className="font-semibold text-gray-900">
                    {plan.cvLimit || 'Unlimited'}
                  </span>
                </div>
              </div>

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <div className="mb-6">
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrentPlan(plan)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  isCurrentPlan(plan)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isCurrentPlan(plan) ? 'Current Plan' : 'Request Upgrade'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Request Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => !submitting && setShowModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Request Upgrade to {selectedPlan.name}
                </h3>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-indigo-900 font-medium mb-2">
                    {selectedPlan.price 
                      ? `${selectedPlan.currency} ${selectedPlan.price}${selectedPlan.billingCycle ? ` / ${selectedPlan.billingCycle}` : ''}`
                      : 'Free Plan'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-indigo-700">
                    <div>JD Limit: <span className="font-semibold">{selectedPlan.jdLimit || '∞'}</span></div>
                    <div>CV Limit: <span className="font-semibold">{selectedPlan.cvLimit || '∞'}</span></div>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message for Admin (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Add any comments or questions..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={submitting}
                ></textarea>

                <p className="text-xs text-gray-500 mt-3">
                  ⓘ An administrator will review your request and update your plan accordingly.
                </p>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansUpgrade;
