import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import PermissionGuard from '@/components/common/PermissionGuard'
import { usePermissions } from '@/hooks/usePermissions'
import { permissionsService } from '@/api/services/permissions'
import { rolesService } from '@/api/services/roles'

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [rolePermissions, setRolePermissions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { hasPermission, hasRole, loading: permissionsLoading } = usePermissions()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!permissionsLoading && isAuthenticated && hasPermission('permissions:read')) {
      fetchPermissions()
      fetchRoles()
    }
  }, [permissionsLoading, isAuthenticated])

  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const response = await permissionsService.getAllPermissions()
      setPermissions(response.data || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await rolesService.getAllRoles()
      setRoles(response.data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId)
    const role = roles.find(r => r.id === roleId)
    setRolePermissions(role?.permissions?.map(p => p.id) || [])
  }

  const handlePermissionToggle = (permissionId) => {
    if (!hasPermission('roles:update')) return

    setRolePermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSaveRolePermissions = async () => {
    if (!selectedRole || !hasPermission('roles:update')) return

    const role = roles.find(r => r.id === selectedRole)
    if (role?.name === 'SUPER_ADMIN' || role?.name === 'ADMIN') {
      alert('Cannot modify admin role permissions')
      return
    }

    try {
      await rolesService.setRolePermissions(selectedRole, rolePermissions)
      alert('Permissions updated successfully')
      fetchRoles() // Refresh roles to get updated permissions
    } catch (error) {
      console.error('Error updating permissions:', error)
      alert('Error updating permissions')
    }
  }

  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.resource.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group permissions by resource
  const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
    const resource = permission.resource
    if (!groups[resource]) {
      groups[resource] = []
    }
    groups[resource].push(permission)
    return groups
  }, {})

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permission Management</h1>
        <div className="text-sm text-muted-foreground">
          Total Permissions: {permissions.length}
        </div>
      </div>

      {/* Search and Role Selection */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <PermissionGuard permission="roles:update">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Manage Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {selectedRole && (
              <Button onClick={handleSaveRolePermissions} size="sm">
                Save Permissions
              </Button>
            )}
          </div>
        </PermissionGuard>
      </div>

      {/* My Permissions Display */}
      <PermissionGuard permission="permissions:read">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">Your Current Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {permissions
              .filter(p => hasPermission(p.name))
              .map(permission => (
                <span 
                  key={permission.id}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                >
                  {permission.name}
                </span>
              ))}
          </div>
        </div>
      </PermissionGuard>

      {/* Permissions List */}
      <PermissionGuard 
        permission="permissions:read"
        fallback={
          <div className="text-center py-8 bg-card rounded-lg">
            <p className="text-muted-foreground">You do not have permission to view permissions</p>
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-8">
            <p>Loading permissions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
              <div key={resource} className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {resource} Permissions
                </h3>
                <div className="grid gap-3">
                  {resourcePermissions.map((permission) => (
                    <div 
                      key={permission.id} 
                      className="flex items-center justify-between p-3 bg-background rounded border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {selectedRole && hasPermission('roles:update') && (
                            <input
                              type="checkbox"
                              checked={rolePermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="h-4 w-4"
                              disabled={
                                roles.find(r => r.id === selectedRole)?.name === 'SUPER_ADMIN' ||
                                roles.find(r => r.id === selectedRole)?.name === 'ADMIN'
                              }
                            />
                          )}
                          <div>
                            <h4 className="font-medium">{permission.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {permission.action}
                        </span>
                        {hasPermission(permission.name) && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            ✓ You have this
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PermissionGuard>

      {/* Role Permission Summary */}
      {selectedRole && (
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {roles.find(r => r.id === selectedRole)?.name} - Permission Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">
                Assigned Permissions ({rolePermissions.length})
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {permissions
                  .filter(p => rolePermissions.includes(p.id))
                  .map(permission => (
                    <div key={permission.id} className="text-sm text-green-600">
                      ✓ {permission.name}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">
                Not Assigned ({permissions.length - rolePermissions.length})
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {permissions
                  .filter(p => !rolePermissions.includes(p.id))
                  .map(permission => (
                    <div key={permission.id} className="text-sm text-red-600">
                      ✗ {permission.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Object.keys(groupedPermissions).length}
          </div>
          <div className="text-sm text-muted-foreground">Resources</div>
        </div>
        <div className="bg-card p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">
            {permissions.filter(p => hasPermission(p.name)).length}
          </div>
          <div className="text-sm text-muted-foreground">Your Permissions</div>
        </div>
        <div className="bg-card p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {selectedRole ? rolePermissions.length : 0}
          </div>
          <div className="text-sm text-muted-foreground">Selected Role Permissions</div>
        </div>
      </div>
    </div>
  )
}

export default PermissionManagement