import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

const AuthProvider = ({ children }) => {
  const { checkAuth } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for existing authentication on app startup
      await checkAuth()
      setIsInitialized(true)
    }
    
    initializeAuth()
  }, [])

  // Show loading state while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}

export default AuthProvider