import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const PermissionsContext = createContext()

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPermissions()
    } else {
      setPermissions([])
    }
  }, [isAuthenticated])

  const fetchMyPermissions = async () => {
    try {
      setLoading(true)
      
      // Use mock permissions since backend is not available
      console.log('Using mock permissions for demo purposes')
      const mockPermissions = [
        { id: '1', name: 'users:read', description: 'Read users', resource: 'users', action: 'read' },
        { id: '2', name: 'users:create', description: 'Create users', resource: 'users', action: 'create' },
        { id: '3', name: 'users:update', description: 'Update users', resource: 'users', action: 'update' },
        { id: '4', name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },
        { id: '5', name: 'roles:read', description: 'Read roles', resource: 'roles', action: 'read' },
        { id: '6', name: 'roles:create', description: 'Create roles', resource: 'roles', action: 'create' },
        { id: '7', name: 'roles:update', description: 'Update roles', resource: 'roles', action: 'update' },
        { id: '8', name: 'roles:delete', description: 'Delete roles', resource: 'roles', action: 'delete' },
        { id: '9', name: 'permissions:read', description: 'Read permissions', resource: 'permissions', action: 'read' },
        { id: '10', name: 'documents:read', description: 'Read documents', resource: 'documents', action: 'read' },
        { id: '11', name: 'documents:create', description: 'Create documents', resource: 'documents', action: 'create' },
        { id: '12', name: 'documents:update', description: 'Update documents', resource: 'documents', action: 'update' },
        { id: '13', name: 'documents:delete', description: 'Delete documents', resource: 'documents', action: 'delete' }
      ]
      
      setPermissions(mockPermissions)
    } catch (error) {
      console.error('Error setting mock permissions:', error)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (permissionName) => {
    if (!isAuthenticated) return false
    
    // Super admin has all permissions
    if (user?.role?.name === 'SUPER_ADMIN') return true
    
    // Check if user has specific permission
    return permissions.some(permission => permission.name === permissionName)
  }

  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissionNames) => {
    return permissionNames.every(permission => hasPermission(permission))
  }

  const hasRole = (roleName) => {
    if (!isAuthenticated) return false
    return user?.role?.name === roleName
  }

  const hasAnyRole = (roleNames) => {
    return roleNames.some(role => hasRole(role))
  }

  const value = {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    refetch: fetchMyPermissions
  }

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}

export default PermissionsProvider