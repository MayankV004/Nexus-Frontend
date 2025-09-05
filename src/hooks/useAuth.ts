import { useAppSelector, useAppDispatch } from './redux';
import { useCallback } from 'react';
import {
  loginUser,
  signUpUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  clearError,
  clearCredentials,
  setCredentials,
  updateUser,
  type LoginFormData,
  type SignUpFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type ChangePasswordFormData,
  type VerifyEmailFormData,
} from '../store/slices/authSlice';
import axios from '@/lib/axios';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  // Check for stored tokens on mount and refresh user data
  const initializeAuth = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenStored = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshTokenStored) {
      try {
        // Try to fetch user profile with existing token
        const response = await axios.get('/api/v1/user/profile');
        
        dispatch(setCredentials({
          user: response.data.data,
          tokens: {
            accessToken,
            refreshToken: refreshTokenStored
          }
        }));
      } catch{
        // If profile fetch fails, try to refresh token
        try {
          const refreshResult = await dispatch(refreshToken());
          if (refreshResult.meta.requestStatus === 'fulfilled') {
            // After successful refresh, fetch profile again
            const profileResponse = await axios.get('/api/v1/user/profile');
            dispatch(updateUser(profileResponse.data.data));
          }
        } catch {
          // If refresh also fails, clear everything
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(clearCredentials());
        }
      }
    }
  }, [dispatch]);

  // Fetch current user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/user/profile');
      dispatch(updateUser(response.data.data));
      console.log('User profile fetched successfully:', response.data.user);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }, [dispatch]);

  const login = useCallback(
    async (formData: LoginFormData) => {
      const result = await dispatch(loginUser(formData));
      if (result.meta.requestStatus === 'fulfilled') {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', result.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', result.payload.tokens.refreshToken);
      }
      return result;
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (formData: SignUpFormData) => {
      return dispatch(signUpUser(formData));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutUser());
    // Clear localStorage regardless of API response
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return result;
  }, [dispatch]);

  const refresh = useCallback(async () => {
    const result = await dispatch(refreshToken());
    if (result.meta.requestStatus === 'fulfilled') {
      // Update stored tokens
      localStorage.setItem('accessToken', result.payload.tokens.accessToken);
      localStorage.setItem('refreshToken', result.payload.tokens.refreshToken);
    }
    return result;
  }, [dispatch]);

  const forgotPass = useCallback(
    async (formData: ForgotPasswordFormData) => {
      return dispatch(forgotPassword(formData));
    },
    [dispatch]
  );

  const resetPass = useCallback(
    async (formData: ResetPasswordFormData) => {
      return dispatch(resetPassword(formData));
    },
    [dispatch]
  );

  const changePass = useCallback(
    async (formData: ChangePasswordFormData) => {
      return dispatch(changePassword(formData));
    },
    [dispatch]
  );

  const verifyUserEmail = useCallback(
    async (formData: VerifyEmailFormData) => {
      return dispatch(verifyEmail(formData));
    },
    [dispatch]
  );

  const resendVerification = useCallback(
    async (email: string) => {
      return dispatch(resendVerificationEmail(email));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(clearCredentials());
  }, [dispatch]);

  return {
    ...auth,
    login,
    signUp,
    logout,
    refresh,
    forgotPass,
    resetPass,
    changePass,
    verifyUserEmail,
    resendVerification,
    clearAuthError,
    clearAuth,
    initializeAuth,
    fetchUserProfile,
  };
};