import React from 'react';

const PlansManagement = ({ plans, onCreatePlan, onEditPlan, onDeletePlan }) => {
  const getPlanBadgeColor = (name) => {
    switch (name) {
      case 'Freemium': return 'bg-gray-100 text-gray-800';
      case 'Starter': return 'bg-blue-100 text-blue-800';
      case 'Growth': return 'bg-green-100 text-green-800';
      case 'Pro': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={onCreatePlan}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Create New Plan
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-lg font-medium">No plans created yet</p>
                      <p className="text-sm mt-1">Click "Create New Plan" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPlanBadgeColor(plan.name)}`}>
                          {plan.name}
                        </div>
                        {plan.description && (
                          <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {plan.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                        {plan.region}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.billingCycle || <span className="text-gray-400">One-time</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.price ? (
                        <div className="text-sm font-semibold text-gray-900">
                          {plan.currency} {plan.price.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Free / Custom</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        <div>
                          <span className="font-medium">JD:</span>{' '}
                          {plan.jdLimit ? plan.jdLimit : <span className="text-green-600">Unlimited</span>}
                        </div>
                        <div>
                          <span className="font-medium">CV:</span>{' '}
                          {plan.cvLimit ? plan.cvLimit : <span className="text-green-600">Unlimited</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ● Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ● Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEditPlan(plan)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeletePlan(plan._id, plan.name)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {plans.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Total Plans: <span className="font-semibold">{plans.length}</span></p>
        </div>
      )}
    </div>
  );
};

export default PlansManagement;