import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { planAPI } from '../services/api';
import { detectUserCountry } from '../utils/countryDetection';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('pakistan');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
    detectUserRegion();
  }, []);

  const detectUserRegion = () => {
    try {
      const country = detectUserCountry();
      setActiveTab(country.toLowerCase());
    } catch (error) {
      console.log('Could not detect region, using default');
    }
  };

  const loadPlans = async () => {
    try {
      const response = await planAPI.getAllPlans();
      setPlans(response.plans || []);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and group plans
  const getFilteredPlans = () => {
    const regionFilter = activeTab === 'pakistan' ? 'Pakistan' : 'International';
    const filteredPlans = plans.filter(plan => 
      plan.region === regionFilter && 
      plan.billingCycle === billingCycle &&
      plan.name !== 'Freemium' // Hide freemium from pricing page
    );

    // Group by plan name
    const grouped = filteredPlans.reduce((acc, plan) => {
      if (!acc[plan.name]) {
        acc[plan.name] = plan;
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const currentPlans = getFilteredPlans();

  const formatPrice = (plan) => {
    if (plan.price === null || plan.price === undefined) {
      return 'Custom';
    }
    const symbol = plan.currency === 'PKR' ? 'Rs' : '$';
    return `${symbol} ${plan.price.toLocaleString()}`;
  };

  const formatBillingCycle = (cycle) => {
    switch (cycle) {
      case 'Monthly': return 'month';
      case 'SixMonth': return '6 months';
      case 'Annual': return 'year';
      default: return cycle?.toLowerCase() || '';
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-8"
          >
            Flexible pricing for teams of all sizes
          </motion.p>

          {/* Region Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-md">
              <button
                onClick={() => setActiveTab('pakistan')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'pakistan'
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Pakistan Plans
              </button>
              <button
                onClick={() => setActiveTab('international')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'international'
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                International Plans
              </button>
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-1 shadow-md">
              {['Monthly', 'SixMonth', 'Annual'].map((billing) => (
                <button
                  key={billing}
                  onClick={() => setBillingCycle(billing)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    billingCycle === billing
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {billing === 'SixMonth' ? '6 Months' : billing}
                  {billing === 'SixMonth' && <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Save 17%</span>}
                  {billing === 'Annual' && <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Save 33%</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`grid gap-8 ${
              currentPlans.length === 1 
                ? 'grid-cols-1 max-w-md mx-auto' 
                : currentPlans.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {currentPlans.map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 relative ${
                  plan.name === 'Growth' ? 'border-2 border-primary-600' : 'border border-gray-200'
                }`}
              >
                {plan.name === 'Growth' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-800">{formatPrice(plan)}</span>
                    {plan.billingCycle && (
                      <span className="text-gray-600">/{formatBillingCycle(plan.billingCycle)}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      {plan.jdLimit === -1 || plan.jdLimit === null ? 'Unlimited' : plan.jdLimit} Job Descriptions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      {plan.cvLimit === -1 || plan.cvLimit === null ? 'Unlimited' : plan.cvLimit} CV Reviews
                    </span>
                  </li>
                  {plan.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.price === null ? (
                  <a 
                    href="https://forms.gle/YOUR_CONTACT_FORM_ID" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                    >
                      Contact Sales
                    </motion.button>
                  </a>
                ) : (
                  <a 
                    href={`https://forms.gle/YOUR_PURCHASE_FORM_ID?entry.plan=${encodeURIComponent(plan.name)}&entry.region=${encodeURIComponent(plan.region)}&entry.billing=${encodeURIComponent(plan.billingCycle)}&entry.price=${encodeURIComponent(plan.price)}&entry.currency=${encodeURIComponent(plan.currency)}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        plan.name === 'Growth'
                          ? 'bg-gradient-primary text-white shadow-lg hover:shadow-xl'
                          : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      Buy Now
                    </motion.button>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
