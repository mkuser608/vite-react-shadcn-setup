import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/features/auth/authSlice'
import { authService } from '@/api/services/auth'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const login = async (credentials) => {
    dispatch(loginStart())
    
    // Skip API call and use mock authentication directly
    // since we know the backend is not available
    console.log('Using mock authentication for demo purposes')
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: credentials.email || credentials.phone,
      role: { name: 'ADMIN', description: 'Administrator' }
    }
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    localStorage.setItem('token', mockToken)
    localStorage.setItem('refreshToken', 'mock-refresh-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    dispatch(loginSuccess({
      user: mockUser,
      token: mockToken
    }))
    
    navigate('/dashboard')
  }

  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      dispatch(logout())
      navigate('/login')
    }
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    console.log('CheckAuth: Token exists:', !!storedToken)
    console.log('CheckAuth: User data exists:', !!storedUser)
    
    if (storedToken && storedUser) {
      try {
        // Parse stored user data
        const userData = JSON.parse(storedUser)
        console.log('CheckAuth: Using stored user data:', userData)
        
        // For now, skip backend verification since API is not available
        // Just validate that we have valid token and user data
        dispatch(loginSuccess({
          user: userData,
          token: storedToken
        }))
        console.log('CheckAuth: Success - user authenticated from storage')
        return true
      } catch (error) {
        console.error('CheckAuth: Failed to parse stored data:', error)
        console.log('CheckAuth: Clearing invalid tokens and logging out')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        dispatch(logout())
        return false
      }
    }
    console.log('CheckAuth: No valid token or user data found')
    return false
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout: logoutUser,
    checkAuth,
  }
}