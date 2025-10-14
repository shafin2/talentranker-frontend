import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, tokenManager } from '../services/auth';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        loading: false,
      };
    case AUTH_ACTIONS.SET_LOADING:
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
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Check if we have a token from OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        tokenManager.setAccessToken(token);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Only try to get user profile if we have a token
      const accessToken = tokenManager.getAccessToken();
      if (accessToken) {
        try {
          const user = await authAPI.getProfile();
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: { user },
          });
        } catch (error) {
          // If profile fetch fails, clear invalid token
          console.error('Failed to fetch profile:', error);
          tokenManager.clearTokens();
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: { user: null },
          });
        }
      } else {
        // No token, user is not authenticated
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: null },
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenManager.clearTokens();
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user: null },
      });
    }
  };

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const { user } = await authAPI.login(credentials);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const { user } = await authAPI.signup(userData);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  const googleLogin = async (credentialToken) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const { user } = await authAPI.googleAuth(credentialToken);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({
      type: AUTH_ACTIONS.LOGIN_FAILURE,
      payload: { error: null },
    });
  };

  const refreshUser = async () => {
    try {
      if (tokenManager.getAccessToken()) {
        const user = await authAPI.getProfile();
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user },
        });
        return user;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    signup,
    googleLogin,
    logout,
    clearError,
    checkAuthStatus,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;