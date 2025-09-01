import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from '@/components/common/Layout'
import Login from '@/pages/auth/Login'
import AllDocuments from '@/pages/documents/AllDocuments'
import UserManagement from '@/pages/users/UserManagement'
import RoleManagement from '@/pages/roles/RoleManagement'
import PermissionManagement from '@/pages/permissions/PermissionManagement'

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />
  }

  const PublicRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/dashboard" />
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<AllDocuments />} />
          <Route path="documents" element={<AllDocuments />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="permissions" element={<PermissionManagement />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes