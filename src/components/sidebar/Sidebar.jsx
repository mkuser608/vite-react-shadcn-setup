import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/usePermissions'
import PermissionGuard from '@/components/common/PermissionGuard'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊', permission: null },
  { name: 'Documents', href: '/documents', icon: '📄', permission: 'documents:read' },
  { name: 'User Management', href: '/users', icon: '👥', permission: 'users:read' },
  { name: 'Role Management', href: '/roles', icon: '🔐', permission: 'roles:read' },
  { name: 'Permissions', href: '/permissions', icon: '🛡️', permission: 'permissions:read' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="fixed left-0 top-16 w-64 h-full bg-card border-r shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            if (item.permission) {
              return (
                <PermissionGuard key={item.name} permission={item.permission}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </PermissionGuard>
              )
            }
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar