import apiClient from '../client'

export const permissionsService = {
  // Get all permissions
  getAllPermissions: async () => {
    const response = await apiClient.get('/permissions')
    return response.data
  },

  // Get current user's permissions
  getMyPermissions: async () => {
    const response = await apiClient.get('/permissions/my-permissions')
    return response.data
  },
}

export default permissionsService