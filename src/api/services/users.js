import apiClient from '../client'

export const usersService = {
  // Create user
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData)
    return response.data
  },

  // Get all users with pagination
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await apiClient.get(`/users${queryParams ? '?' + queryParams : ''}`)
    return response.data
  },

  // Search users
  searchUsers: async (query, params = {}) => {
    const queryParams = new URLSearchParams({ q: query, ...params }).toString()
    const response = await apiClient.get(`/users/search?${queryParams}`)
    return response.data
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },
}

export default usersService