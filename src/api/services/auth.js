import apiClient from '../client'

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  logout: async (refreshToken) => {
    const response = await apiClient.post('/auth/logout', { refreshToken })
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken })
    return response.data
  },

  // Verify token - using profile endpoint as verify endpoint may not exist
  verifyToken: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  // Get current user's permissions
  getMyPermissions: async () => {
    const response = await apiClient.get('/permissions/my-permissions')
    return response.data
  },
}

export default authService