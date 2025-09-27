import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('pakistan');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pakistanPlans = {
    monthly: [
      {
        name: 'Starter',
        price: 'Rs 2,500',
        period: '/month',
        features: [
          '10 job postings per month',
          'Up to 100 CV evaluations',
          'Basic ranking algorithm',
          'Email support',
          'Export to PDF'
        ]
      },
      {
        name: 'Professional',
        price: 'Rs 5,000',
        period: '/month',
        popular: true,
        features: [
          '25 job postings per month',
          'Up to 500 CV evaluations',
          'Advanced AI ranking',
          'Priority support',
          'Custom filters',
          'Team collaboration'
        ]
      },
      {
        name: 'Enterprise',
        price: 'Rs 12,000',
        period: '/month',
        features: [
          'Unlimited job postings',
          'Unlimited CV evaluations',
          'Custom AI training',
          'Dedicated support',
          'API access',
          'White-label solution'
        ]
      }
    ],
    sixMonth: [
      {
        name: 'Starter',
        price: 'Rs 12,000',
        period: '/6 months',
        originalPrice: 'Rs 15,000',
        features: [
          '10 job postings per month',
          'Up to 100 CV evaluations',
          'Basic ranking algorithm',
          'Email support',
          'Export to PDF'
        ]
      },
      {
        name: 'Professional',
        price: 'Rs 24,000',
        period: '/6 months',
        originalPrice: 'Rs 30,000',
        popular: true,
        features: [
          '25 job postings per month',
          'Up to 500 CV evaluations',
          'Advanced AI ranking',
          'Priority support',
          'Custom filters',
          'Team collaboration'
        ]
      },
      {
        name: 'Enterprise',
        price: 'Rs 60,000',
        period: '/6 months',
        originalPrice: 'Rs 72,000',
        features: [
          'Unlimited job postings',
          'Unlimited CV evaluations',
          'Custom AI training',
          'Dedicated support',
          'API access',
          'White-label solution'
        ]
      }
    ],
    annual: [
      {
        name: 'Starter',
        price: 'Rs 20,000',
        period: '/year',
        originalPrice: 'Rs 30,000',
        features: [
          '10 job postings per month',
          'Up to 100 CV evaluations',
          'Basic ranking algorithm',
          'Email support',
          'Export to PDF'
        ]
      },
      {
        name: 'Professional',
        price: 'Rs 40,000',
        period: '/year',
        originalPrice: 'Rs 60,000',
        popular: true,
        features: [
          '25 job postings per month',
          'Up to 500 CV evaluations',
          'Advanced AI ranking',
          'Priority support',
          'Custom filters',
          'Team collaboration'
        ]
      },
      {
        name: 'Enterprise',
        price: 'Rs 100,000',
        period: '/year',
        originalPrice: 'Rs 144,000',
        features: [
          'Unlimited job postings',
          'Unlimited CV evaluations',
          'Custom AI training',
          'Dedicated support',
          'API access',
          'White-label solution'
        ]
      }
    ]
  };

  const internationalPlans = {
    monthly: [
      {
        name: 'Starter',
        price: '$25',
        period: '/month',
        features: [
          '10 job postings per month',
          'Up to 100 CV evaluations',
          'Basic ranking algorithm',
          'Email support',
          'Export to PDF'
        ]
      },
      {
        name: 'Professional',
        price: '$50',
        period: '/month',
        popular: true,
        features: [
          '25 job postings per month',
          'Up to 500 CV evaluations',
          'Advanced AI ranking',
          'Priority support',
          'Custom filters',
          'Team collaboration'
        ]
      },
      {
        name: 'Enterprise',
        price: '$120',
        period: '/month',
        features: [
          'Unlimited job postings',
          'Unlimited CV evaluations',
          'Custom AI training',
          'Dedicated support',
          'API access',
          'White-label solution'
        ]
      }
    ],
    sixMonth: [
      {
        name: 'Starter',
        price: '$120',
        period: '/6 months',
        originalPrice: '$150',
        features: [
          '10 job postings per month',
          'Up to 100 CV evaluations',
          'Basic ranking algorithm',
          'Email support',
          'Export to PDF'
        ]
      },
      {
        name: 'Professional',
        price: '$240',
        period: '/6 months',
        originalPrice: '$300',
        popular: true,
        features: [
          '25 job postings per month',
          'Up to 500 CV evaluations',
          'Advanced AI ranking',
          'Priority support',
          'Custom filters',
          'Team collaboration'
        ]
      },
      {
        name: 'Enterprise',
        price: '$600',
        period: '/6 months',
        originalPrice: '$720',
        features: [
          'Unlimited job postings',
          'Unlimited CV evaluations',
          'Custom AI training',
          'Dedicated support',
          'API access',
          'White-label solution'
        ]
      }
    ],
    annual: [
      {
        name: 'Starter',
        price: '$200',
        period: '/year',
        originalPrice: '$300',
        features: [
          '10 job postings per month',
          'Up to 100 CV evaluations',
          'Basic ranking algorithm',
          'Email support',
          'Export to PDF'
        ]
      },
      {
        name: 'Professional',
        price: '$400',
        period: '/year',
        originalPrice: '$600',
        popular: true,
        features: [
          '25 job postings per month',
          'Up to 500 CV evaluations',
          'Advanced AI ranking',
          'Priority support',
          'Custom filters',
          'Team collaboration'
        ]
      },
      {
        name: 'Enterprise',
        price: '$1000',
        period: '/year',
        originalPrice: '$1440',
        features: [
          'Unlimited job postings',
          'Unlimited CV evaluations',
          'Custom AI training',
          'Dedicated support',
          'API access',
          'White-label solution'
        ]
      }
    ]
  };

  const currentPlans = activeTab === 'pakistan' ? pakistanPlans : internationalPlans;

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
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('sixMonth')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === 'sixMonth'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                6 Months
                <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">20% OFF</span>
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === 'annual'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Annual
                <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">33% OFF</span>
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {currentPlans[billingCycle].map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 relative ${
                plan.popular ? 'border-2 border-primary-600' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">{plan.originalPrice}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-primary text-white shadow-lg hover:shadow-xl'
                      : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Select Plan
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
