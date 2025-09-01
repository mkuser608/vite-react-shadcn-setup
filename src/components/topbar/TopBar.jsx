import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const TopBar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b shadow-sm z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Document Management System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar