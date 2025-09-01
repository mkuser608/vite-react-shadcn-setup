import { usePermissions } from '@/hooks/usePermissions'

const PermissionGuard = ({ 
  children, 
  permission = null, 
  permissions = [], 
  role = null, 
  roles = [], 
  requireAll = false,
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = usePermissions()

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return fallback
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    
    if (!hasAccess) {
      return fallback
    }
  }

  // Check single role
  if (role && !hasRole(role)) {
    return fallback
  }

  // Check multiple roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return fallback
  }

  return children
}

export default PermissionGuard