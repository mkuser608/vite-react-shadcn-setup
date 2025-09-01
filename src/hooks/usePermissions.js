import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { authService } from '@/api/services/auth'

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPermissions()
    }
  }, [isAuthenticated])

  const fetchMyPermissions = async () => {
    try {
      setLoading(true)
      const response = await authService.getMyPermissions()
      setPermissions(response.data.permissions || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
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

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    refetch: fetchMyPermissions
  }
}