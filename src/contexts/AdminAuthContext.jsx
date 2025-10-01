import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, tokenManager } from '../services/auth';

// Admin Auth Context
const AdminAuthContext = createContext();

// Auth Actions
const ADMIN_AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_ADMIN: 'SET_ADMIN',
  SET_LOADING: 'SET_LOADING',
};

// Auth Reducer
const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload.admin,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case ADMIN_AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        admin: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error,
      };
    case ADMIN_AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        admin: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case ADMIN_AUTH_ACTIONS.SET_ADMIN:
      return {
        ...state,
        admin: action.payload.admin,
        isAuthenticated: !!action.payload.admin,
        loading: false,
      };
    case ADMIN_AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Admin Auth Provider Component
export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState);

  // Check for existing admin session on mount
  useEffect(() => {
    checkAdminAuthStatus();
  }, []);

  const checkAdminAuthStatus = async () => {
    dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Try to get admin profile
      if (tokenManager.getAccessToken()) {
        const admin = await authAPI.getAdminProfile();
        dispatch({
          type: ADMIN_AUTH_ACTIONS.SET_ADMIN,
          payload: { admin },
        });
      } else {
        dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      dispatch({ type: ADMIN_AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    dispatch({ type: ADMIN_AUTH_ACTIONS.LOGIN_START });

    try {
      const { user: admin } = await authAPI.adminLogin(credentials);
      dispatch({
        type: ADMIN_AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { admin },
      });
      return admin;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      dispatch({
        type: ADMIN_AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.adminLogout();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      dispatch({ type: ADMIN_AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({
      type: ADMIN_AUTH_ACTIONS.LOGIN_FAILURE,
      payload: { error: null },
    });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    checkAdminAuthStatus,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook to use admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;