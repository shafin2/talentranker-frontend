import React from 'react';

const PlanChangeModal = ({ 
  user, 
  plans, 
  isOpen, 
  onClose, 
  onChangePlan 
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Change Plan for {user.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Current Plan: {user.plan?.name || 'No Plan'}
          </p>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {plans.map((plan) => (
              <button
                key={plan._id}
                onClick={() => onChangePlan(plan._id)}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary"
              >
                <div className="font-medium">{plan.name}</div>
                <div className="text-sm text-gray-500">
                  {plan.region} - {plan.billingCycle || 'Custom'} - 
                  {plan.price ? ` ${plan.currency} ${plan.price}` : ' Custom Pricing'}
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;