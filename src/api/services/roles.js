import apiClient from '../client'

export const rolesService = {
  // Create role
  createRole: async (roleData) => {
    const response = await apiClient.post('/roles', roleData)
    return response.data
  },

  // Get all roles
  getAllRoles: async () => {
    const response = await apiClient.get('/roles')
    return response.data
  },

  // Search roles
  searchRoles: async (query) => {
    const response = await apiClient.get(`/roles/search?q=${query}`)
    return response.data
  },

  // Get role by ID
  getRoleById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`)
    return response.data
  },

  // Update role
  updateRole: async (id, roleData) => {
    const response = await apiClient.put(`/roles/${id}`, roleData)
    return response.data
  },

  // Delete role
  deleteRole: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`)
    return response.data
  },

  // Set role permissions
  setRolePermissions: async (id, permissionIds) => {
    const response = await apiClient.post(`/roles/${id}/permissions`, {
      permissionIds
    })
    return response.data
  },
}

export default rolesService