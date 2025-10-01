import React, { useState, useEffect } from 'react';

const PlanFormModal = ({ plan, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    billingCycle: '',
    price: '',
    currency: 'USD',
    jdLimit: '',
    cvLimit: '',
    description: '',
    features: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        region: plan.region || '',
        billingCycle: plan.billingCycle || '',
        price: plan.price || '',
        currency: plan.currency || 'USD',
        jdLimit: plan.jdLimit || '',
        cvLimit: plan.cvLimit || '',
        description: plan.description || '',
        features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
        isActive: plan.isActive !== undefined ? plan.isActive : true
      });
    } else {
      // Reset form for new plan
      setFormData({
        name: '',
        region: '',
        billingCycle: '',
        price: '',
        currency: 'USD',
        jdLimit: '',
        cvLimit: '',
        description: '',
        features: '',
        isActive: true
      });
    }
  }, [plan, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Plan name is required';
    if (!formData.region) newErrors.region = 'Region is required';
    
    // Freemium must be free
    if (formData.name === 'Freemium' && formData.price && parseFloat(formData.price) !== 0) {
      newErrors.price = 'Freemium plan must be free';
    }
    
    // Non-Freemium plans should have price
    if (formData.name !== 'Freemium' && formData.name !== 'Enterprise' && !formData.price) {
      newErrors.price = 'Price is required for paid plans';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data
    const submitData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      jdLimit: formData.jdLimit ? parseInt(formData.jdLimit) : null,
      cvLimit: formData.cvLimit ? parseInt(formData.cvLimit) : null,
      features: formData.features.split('\n').filter(f => f.trim()),
      billingCycle: formData.billingCycle || null
    };

    try {
      await onSave(submitData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save plan' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-6">
                    {plan ? 'Edit Plan' : 'Create New Plan'}
                  </h3>
                  
                  {errors.submit && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {errors.submit}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {/* Plan Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Name *
                      </label>
                      <select
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Plan</option>
                        <option value="Freemium">Freemium</option>
                        <option value="Starter">Starter</option>
                        <option value="Growth">Growth</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region *
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Region</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="International">International</option>
                        <option value="Global">Global</option>
                      </select>
                      {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                    </div>

                    {/* Billing Cycle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Cycle
                      </label>
                      <select
                        name="billingCycle"
                        value={formData.billingCycle}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">None (One-time/Custom)</option>
                        <option value="Monthly">Monthly</option>
                        <option value="SixMonth">6 Months</option>
                        <option value="Annual">Annual</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price {formData.name !== 'Freemium' && formData.name !== 'Enterprise' && '*'}
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="USD">USD</option>
                        <option value="PKR">PKR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>

                    {/* JD Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        JD Limit (blank = unlimited)
                      </label>
                      <input
                        type="number"
                        name="jdLimit"
                        value={formData.jdLimit}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    {/* CV Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CV Limit (blank = unlimited)
                      </label>
                      <input
                        type="number"
                        name="cvLimit"
                        value={formData.cvLimit}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Active Plan
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Brief description of the plan"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>

                  {/* Features */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features (one per line)
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {plan ? 'Update Plan' : 'Create Plan'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanFormModal;
