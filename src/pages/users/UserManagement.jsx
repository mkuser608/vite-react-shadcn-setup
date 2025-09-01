import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import PermissionGuard from '@/components/common/PermissionGuard'
import { usePermissions } from '@/hooks/usePermissions'
import { usersService } from '@/api/services/users'
import { rolesService } from '@/api/services/roles'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
    image: ''
  })
  const { hasPermission, loading: permissionsLoading } = usePermissions()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!permissionsLoading && isAuthenticated && hasPermission('users:read')) {
      fetchUsers()
      fetchRoles()
    }
  }, [permissionsLoading, isAuthenticated])

  const fetchUsers = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true)
      const params = { page, limit }
      if (search) params.search = search

      const response = await usersService.getAllUsers(params)
      setUsers(response.data.users || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      console.error('Error fetching users:', error)
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

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers(1, 10, searchTerm)
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!hasPermission('users:create')) return

    try {
      await usersService.createUser(newUser)
      setNewUser({
        name: '',
        email: '',
        phone: '',
        password: '',
        roleId: '',
        image: ''
      })
      setShowCreateForm(false)
      fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleUpdateUser = async (id, userData) => {
    if (!hasPermission('users:update')) return

    try {
      await usersService.updateUser(id, userData)
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!hasPermission('users:delete')) return

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersService.deleteUser(id)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user')
      }
    }
  }

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId)
    return role?.name || 'Unknown'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <PermissionGuard permission="users:create">
          <Button onClick={() => setShowCreateForm(true)}>
            Create New User
          </Button>
        </PermissionGuard>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" variant="outline">Search</Button>
        {searchTerm && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setSearchTerm('')
              fetchUsers()
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={newUser.roleId}
                onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select a role</option>
                {roles.filter(role => role.name !== 'SUPER_ADMIN').map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image URL (Optional)</label>
              <input
                type="url"
                value={newUser.image}
                onChange={(e) => setNewUser({ ...newUser, image: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">Create User</Button>
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

      {/* Users List */}
      <PermissionGuard 
        permission="users:read"
        fallback={
          <div className="text-center py-8 bg-card rounded-lg">
            <p className="text-muted-foreground">You do not have permission to view users</p>
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-8">
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="p-4 bg-card rounded-lg shadow border">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.role?.name === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role?.name === 'ADMIN' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role?.name || 'No Role'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.emailVerified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Email Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    
                    <PermissionGuard permission="users:update">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </Button>
                    </PermissionGuard>
                    
                    <PermissionGuard 
                      permission="users:delete"
                      roles={['SUPER_ADMIN', 'ADMIN']}
                    >
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-muted-foreground">
                  <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                  {user.lastLogin && (
                    <span className="ml-4">
                      Last Login: {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchUsers(pagination.currentPage - 1, 10, searchTerm)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages} 
                  ({pagination.totalUsers} users)
                </span>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchUsers(pagination.currentPage + 1, 10, searchTerm)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </PermissionGuard>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const userData = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  roleId: formData.get('roleId'),
                  image: formData.get('image')
                }
                const password = formData.get('password')
                if (password) userData.password = password
                
                handleUpdateUser(editingUser.id, userData)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingUser.name}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={editingUser.phone}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  name="roleId"
                  defaultValue={editingUser.role?.id || ''}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.filter(role => role.name !== 'SUPER_ADMIN').map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password (Leave blank to keep current)</label>
                <input
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profile Image URL</label>
                <input
                  name="image"
                  type="url"
                  defaultValue={editingUser.image || ''}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Update User</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingUser(null)}
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

export default UserManagement