import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, userAPI, planAPI } from '../services/api';

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    totalJDsProcessed: 0,
    totalCVsProcessed: 0
  });
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);

  // Form states for plan management
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    jdLimit: '',
    cvLimit: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly',
    region: 'Global',
    features: [],
    isActive: true
  });

  // User management states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const stats = await adminAPI.getDashboardStats();
      setDashboardStats(stats.stats);

      // Load users
      const usersData = await adminAPI.getAllUsers(1, 10);
      setUsers(usersData.users);

      // Load plans
      const plansData = await adminAPI.getAllPlansAdmin();
      setPlans(plansData.plans);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Admin logout failed:', error);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const newPlan = await adminAPI.createPlan({
        ...planFormData,
        jdLimit: parseInt(planFormData.jdLimit) || -1,
        cvLimit: parseInt(planFormData.cvLimit) || -1,
        price: parseFloat(planFormData.price) || 0,
        features: planFormData.features.filter(f => f.trim() !== '')
      });

      setPlans([...plans, newPlan.plan]);
      resetPlanForm();
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      const updatedPlan = await adminAPI.updatePlan(editingPlan._id, {
        ...planFormData,
        jdLimit: parseInt(planFormData.jdLimit) || -1,
        cvLimit: parseInt(planFormData.cvLimit) || -1,
        price: parseFloat(planFormData.price) || 0,
        features: planFormData.features.filter(f => f.trim() !== '')
      });

      setPlans(plans.map(p => p._id === editingPlan._id ? updatedPlan.plan : p));
      resetPlanForm();
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await adminAPI.deletePlan(planId);
      setPlans(plans.filter(p => p._id !== planId));
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  const resetPlanForm = () => {
    setPlanFormData({
      name: '',
      description: '',
      jdLimit: '',
      cvLimit: '',
      price: '',
      currency: 'USD',
      billingCycle: 'monthly',
      region: 'Global',
      features: [],
      isActive: true
    });
    setEditingPlan(null);
    setShowPlanForm(false);
  };

  const startEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      description: plan.description,
      jdLimit: plan.jdLimit === -1 ? '' : plan.jdLimit.toString(),
      cvLimit: plan.cvLimit === -1 ? '' : plan.cvLimit.toString(),
      price: plan.price.toString(),
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      region: plan.region,
      features: plan.features || [],
      isActive: plan.isActive
    });
    setShowPlanForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-white">
                TalentRanker Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">
                  Administrator: {admin?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                { id: 'users', name: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
                { id: 'plans', name: 'Plans', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { id: 'analytics', name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    activeTab === item.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'dashboard' && (
                      <DashboardTab dashboardStats={dashboardStats} />
                    )}
                    {activeTab === 'users' && (
                      <UsersTab 
                        users={users} 
                        userSearch={userSearch}
                        setUserSearch={setUserSearch}
                        onRefresh={loadDashboardData}
                      />
                    )}
                    {activeTab === 'plans' && (
                      <PlansTab 
                        plans={plans}
                        showPlanForm={showPlanForm}
                        setShowPlanForm={setShowPlanForm}
                        editingPlan={editingPlan}
                        planFormData={planFormData}
                        setPlanFormData={setPlanFormData}
                        onCreatePlan={handleCreatePlan}
                        onUpdatePlan={handleUpdatePlan}
                        onDeletePlan={handleDeletePlan}
                        onEditPlan={startEditPlan}
                        onCancelEdit={resetPlanForm}
                      />
                    )}
                    {activeTab === 'analytics' && (
                      <AnalyticsTab dashboardStats={dashboardStats} />
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ dashboardStats }) => (
  <div>
    <h1 className="text-2xl font-semibold text-white mb-6">Dashboard Overview</h1>
    
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Users"
        value={dashboardStats.totalUsers}
        icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        color="blue"
      />
      <StatsCard
        title="Active Plans"
        value={dashboardStats.activePlans}
        icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        color="green"
      />
      <StatsCard
        title="JDs Processed"
        value={dashboardStats.totalJDsProcessed}
        icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        color="purple"
      />
      <StatsCard
        title="CVs Processed"
        value={dashboardStats.totalCVsProcessed}
        icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        color="orange"
      />
    </div>
    
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          System Status
        </h3>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">All systems operational</p>
            <p className="text-sm text-green-600">Last checked: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className={`h-6 w-6 ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value || 0}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, userSearch, setUserSearch, onRefresh }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-white">User Management</h1>
      <button
        onClick={onRefresh}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Refresh
      </button>
    </div>

    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.plan?.name || 'No Plan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    JD: {user.jdUsed || 0} / CV: {user.cvUsed || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// Plans Tab Component  
const PlansTab = ({ 
  plans, 
  showPlanForm, 
  setShowPlanForm, 
  editingPlan, 
  planFormData, 
  setPlanFormData, 
  onCreatePlan, 
  onUpdatePlan, 
  onDeletePlan, 
  onEditPlan, 
  onCancelEdit 
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-white">Plan Management</h1>
      <button
        onClick={() => setShowPlanForm(true)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Create New Plan
      </button>
    </div>

    {showPlanForm && (
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
          </h3>
          <form onSubmit={editingPlan ? onUpdatePlan : onCreatePlan}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input
                  type="text"
                  value={planFormData.name}
                  onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={planFormData.price}
                  onChange={(e) => setPlanFormData({...planFormData, price: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">JD Limit (-1 for unlimited)</label>
                <input
                  type="number"
                  value={planFormData.jdLimit}
                  onChange={(e) => setPlanFormData({...planFormData, jdLimit: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CV Limit (-1 for unlimited)</label>
                <input
                  type="number"
                  value={planFormData.cvLimit}
                  onChange={(e) => setPlanFormData({...planFormData, cvLimit: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={planFormData.currency}
                  onChange={(e) => setPlanFormData({...planFormData, currency: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="USD">USD</option>
                  <option value="PKR">PKR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <select
                  value={planFormData.region}
                  onChange={(e) => setPlanFormData({...planFormData, region: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Global">Global</option>
                  <option value="Pakistan">Pakistan</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={planFormData.description}
                onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium"
              >
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Price:</span> {plan.currency} {plan.price}/{plan.billingCycle}</p>
                <p><span className="font-medium">JD Limit:</span> {plan.jdLimit === -1 ? 'Unlimited' : plan.jdLimit}</p>
                <p><span className="font-medium">CV Limit:</span> {plan.cvLimit === -1 ? 'Unlimited' : plan.cvLimit}</p>
                <p><span className="font-medium">Region:</span> {plan.region}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => onEditPlan(plan)}
                  className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeletePlan(plan._id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Analytics Tab Component
const AnalyticsTab = ({ dashboardStats }) => (
  <div>
    <h1 className="text-2xl font-semibold text-white mb-6">Analytics</h1>
    
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total JDs Processed</span>
              <span className="text-sm font-medium text-gray-900">{dashboardStats.totalJDsProcessed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total CVs Processed</span>
              <span className="text-sm font-medium text-gray-900">{dashboardStats.totalCVsProcessed || 0}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Update</span>
              <span className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;