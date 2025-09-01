import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import PermissionGuard from '@/components/common/PermissionGuard'
import { usePermissions } from '@/hooks/usePermissions'
import { rolesService } from '@/api/services/roles'
import { permissionsService } from '@/api/services/permissions'

const RoleManagement = () => {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [newRole, setNewRole] = useState({ name: '', description: '' })
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const { hasPermission, loading: permissionsLoading } = usePermissions()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!permissionsLoading && isAuthenticated && hasPermission('roles:read')) {
      fetchRoles()
      fetchPermissions()
    }
  }, [permissionsLoading, isAuthenticated])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await rolesService.getAllRoles()
      setRoles(response.data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await permissionsService.getAllPermissions()
      setPermissions(response.data || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  const handleCreateRole = async (e) => {
    e.preventDefault()
    if (!hasPermission('roles:create')) return

    try {
      await rolesService.createRole(newRole)
      setNewRole({ name: '', description: '' })
      setShowCreateForm(false)
      fetchRoles()
    } catch (error) {
      console.error('Error creating role:', error)
      alert('Error creating role')
    }
  }

  const handleUpdateRole = async (id, roleData) => {
    if (!hasPermission('roles:update')) return

    try {
      await rolesService.updateRole(id, roleData)
      setEditingRole(null)
      fetchRoles()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Error updating role')
    }
  }

  const handleDeleteRole = async (id) => {
    if (!hasPermission('roles:delete')) return

    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await rolesService.deleteRole(id)
        fetchRoles()
      } catch (error) {
        console.error('Error deleting role:', error)
        alert('Error deleting role')
      }
    }
  }

  const handleSetPermissions = async (roleId) => {
    if (!hasPermission('roles:update')) return

    try {
      await rolesService.setRolePermissions(roleId, selectedPermissions)
      alert('Permissions updated successfully')
      fetchRoles()
    } catch (error) {
      console.error('Error updating permissions:', error)
      alert('Error updating permissions')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Role Management</h1>
        
        <PermissionGuard permission="roles:create">
          <Button onClick={() => setShowCreateForm(true)}>
            Create New Role
          </Button>
        </PermissionGuard>
      </div>

      {/* Create Role Form */}
      {showCreateForm && (
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Create New Role</h2>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role Name</label>
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter role name (e.g., MANAGER)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter role description"
                rows={3}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">Create Role</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Roles List */}
      <PermissionGuard 
        permission="roles:read"
        fallback={
          <div className="text-center py-8 bg-card rounded-lg">
            <p className="text-muted-foreground">You do not have permission to view roles</p>
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-8">
            <p>Loading roles...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {roles.map((role) => (
              <div key={role.id} className="bg-card p-6 rounded-lg border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    <p className="text-muted-foreground">{role.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created: {new Date(role.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <PermissionGuard permission="roles:update">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingRole(role)}
                      >
                        Edit
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard permission="roles:delete">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.name === 'SUPER_ADMIN' || role.name === 'ADMIN'}
                      >
                        Delete
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>

                {/* Role Permissions */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Permissions ({role.permissions?.length || 0})</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {role.permissions?.map((permission) => (
                      <span 
                        key={permission.id} 
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                  
                  <PermissionGuard permission="roles:update">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedPermissions(role.permissions?.map(p => p.id) || [])
                        // Show permission selection modal/form
                      }}
                      disabled={role.name === 'SUPER_ADMIN' || role.name === 'ADMIN'}
                    >
                      Manage Permissions
                    </Button>
                  </PermissionGuard>
                </div>
              </div>
            ))}
          </div>
        )}
      </PermissionGuard>

      {/* Edit Role Modal/Form */}
      {editingRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Role</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                handleUpdateRole(editingRole.id, {
                  name: formData.get('name'),
                  description: formData.get('description')
                })
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Role Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingRole.name}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  disabled={editingRole.name === 'SUPER_ADMIN' || editingRole.name === 'ADMIN'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingRole.description}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  required
                  disabled={editingRole.name === 'SUPER_ADMIN' || editingRole.name === 'ADMIN'}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Update Role</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingRole(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagement