import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

// Layout Components
import AdminLayout from '../components/admin/layout/AdminLayout';

// Dashboard Components
import DashboardOverview from '../components/admin/dashboard/DashboardOverview';
import AnalyticsOverview from '../components/admin/dashboard/AnalyticsOverview';

// User Management Components
import UsersManagement from '../components/admin/users/UsersManagement';

// Plan Management Components
import PlansManagement from '../components/admin/plans/PlansManagement';

// Modal Components
import UserEditModal from '../components/admin/modals/UserEditModal';
import PlanChangeModal from '../components/admin/modals/PlanChangeModal';
import PlanFormModal from '../components/admin/modals/PlanFormModal';

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

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

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

  // User Management Functions
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;
    
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      
      // Refresh dashboard stats
      const stats = await adminAPI.getDashboardStats();
      setDashboardStats(stats.stats);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleChangePlan = (user) => {
    setSelectedUser(user);
    setShowPlanChangeModal(true);
  };

  const handleUpdateUserPlan = async (planId) => {
    try {
      await adminAPI.updateUser(selectedUser._id, { planId });
      
      // Refresh users list
      const usersData = await adminAPI.getAllUsers(userPage, 10, userSearch);
      setUsers(usersData.users);
      
      setShowPlanChangeModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user plan:', error);
      alert('Failed to update user plan. Please try again.');
    }
  };

  const handleUpdateUser = async (updatedUserData) => {
    try {
      await adminAPI.updateUser(editingUser._id, updatedUserData);
      
      // Refresh users list
      const usersData = await adminAPI.getAllUsers(userPage, 10, userSearch);
      setUsers(usersData.users);
      
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  // Plan Management Functions
  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowPlanModal(true);
  };

  const handleSavePlan = async (planData) => {
    try {
      if (editingPlan) {
        // Update existing plan
        await adminAPI.updatePlan(editingPlan._id, planData);
      } else {
        // Create new plan
        await adminAPI.createPlan(planData);
      }
      
      // Refresh plans list
      const plansData = await adminAPI.getAllPlansAdmin();
      setPlans(plansData.plans);
      
      setShowPlanModal(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Failed to save plan:', error);
      throw error; // Re-throw to let modal handle error display
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!confirm(`Are you sure you want to delete the "${planName}" plan? This action cannot be undone.`)) return;
    
    try {
      await adminAPI.deletePlan(planId);
      setPlans(plans.filter(p => p._id !== planId));
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
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
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      admin={admin} 
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && (
        <DashboardOverview dashboardStats={dashboardStats} />
      )}
      
      {activeTab === 'users' && (
        <UsersManagement 
          users={users} 
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          onRefresh={loadDashboardData}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onChangePlan={handleChangePlan}
        />
      )}
      
      {activeTab === 'plans' && (
        <PlansManagement 
          plans={plans}
          onCreatePlan={handleCreatePlan}
          onEditPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
        />
      )}
      
      {activeTab === 'analytics' && (
        <AnalyticsOverview dashboardStats={dashboardStats} />
      )}

      {/* Modals */}
      <UserEditModal 
        user={editingUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSave={handleUpdateUser}
      />

      <PlanChangeModal 
        user={selectedUser}
        plans={plans}
        isOpen={showPlanChangeModal}
        onClose={() => {
          setShowPlanChangeModal(false);
          setSelectedUser(null);
        }}
        onChangePlan={handleUpdateUserPlan}
      />

      <PlanFormModal 
        plan={editingPlan}
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;