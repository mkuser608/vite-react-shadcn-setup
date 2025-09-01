# Vite React shadcn/ui Setup

A modern React application built with Vite, shadcn/ui, Redux Toolkit, and Axios, featuring comprehensive permission-based access control.

## 🚀 Features

- **Modern Stack**: Built with Vite + React 18
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Redux Toolkit
- **API Integration**: Axios with interceptors
- **Authentication**: JWT-based authentication
- **Permission System**: Role-based access control (RBAC)
- **Responsive Design**: Mobile-first approach
- **Type Safety**: JSConfig for better IDE support

## 📁 Project Structure

```
src/
├── api/
│   ├── client.js                 # Axios configuration
│   └── services/                 # API service modules
│       ├── auth.js
│       ├── users.js
│       ├── roles.js
│       └── permissions.js
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── common/                  # Shared components
│   │   ├── Layout.jsx
│   │   └── PermissionGuard.jsx
│   ├── sidebar/
│   └── topbar/
├── hooks/
│   ├── useAuth.js               # Authentication hook
│   └── usePermissions.js        # Permission management hook
├── pages/
│   ├── auth/
│   ├── documents/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── stages/
│   └── workflow/
├── store/
│   ├── store.js                 # Redux store configuration
│   └── features/                # Redux slices
│       └── auth/
├── routes/
│   └── index.jsx                # Application routing
├── lib/
│   └── utils.js                 # Utility functions
└── utils/                       # Helper utilities
```

## 🛠 Technologies Used

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Form Handling**: Native React forms
- **Icons**: React Icons

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vite-react-shadcn-setup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_SOCKET_URL=http://localhost:5001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔐 Permission System

This application implements a comprehensive role-based access control (RBAC) system:

### Permission Guard Component
```jsx
import PermissionGuard from '@/components/common/PermissionGuard'

<PermissionGuard 
  permission="users:read"
  fallback={<div>Access Denied</div>}
>
  <UsersList />
</PermissionGuard>
```

### usePermissions Hook
```jsx
import { usePermissions } from '@/hooks/usePermissions'

const { hasPermission, hasRole, hasAnyRole } = usePermissions()

if (hasPermission('users:create')) {
  // Show create button
}
```

### Supported Permission Patterns
- **Resource-based**: `users:read`, `users:create`, `users:update`, `users:delete`
- **Role-based**: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `USER`
- **Combined checks**: Both permissions and roles

## 📡 API Integration

The application includes pre-configured API services that work with the Node.js MongoDB backend:

### Authentication Service
- Login/Register
- Token refresh
- User profile management
- Permission fetching

### User Management Service
- CRUD operations for users
- Search and pagination
- Role assignment

### Role Management Service
- Role CRUD operations
- Permission assignment to roles

## 🎨 UI Components

Built with shadcn/ui, the application includes:
- **Form Components**: Inputs, buttons, selects
- **Layout Components**: Navigation, sidebars, modals
- **Data Display**: Tables, cards, badges
- **Feedback**: Alerts, toasts, loading states

## 🚦 Routing & Navigation

- **Protected Routes**: Require authentication
- **Permission-based Navigation**: Menu items based on user permissions
- **Auto-redirect**: Automatic redirection for unauthenticated users

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗 Project Architecture

### State Management
- **Redux Toolkit** for global state
- **Feature-based slices** for modular state management
- **RTK Query** ready for advanced API caching

### API Layer
- **Axios interceptors** for request/response handling
- **Automatic token attachment**
- **Error handling and retry logic**
- **Base URL configuration**

### Component Architecture
- **Compound components** for complex UI patterns
- **Render props** for flexible data sharing
- **Custom hooks** for logic reuse

## 🔒 Security Features

- **JWT Token Management**: Automatic token refresh
- **Role-based Access Control**: Granular permissions
- **Route Protection**: Authentication guards
- **API Security**: Request/response interceptors
- **Input Validation**: Client-side validation

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5001/api` |
| `VITE_APP_TITLE` | Application title | `Document Management System` |
| `VITE_SOCKET_URL` | Socket.io URL | `http://localhost:5001` |

## 🤝 Backend Integration

This frontend is designed to work with the Node.js MongoDB backend. Ensure your backend includes:

- JWT authentication endpoints
- Role and permission management
- User CRUD operations
- CORS configuration for this frontend

## 📖 Usage Examples

### Protected Component with Permissions
```jsx
const UserManagement = () => {
  const { hasPermission } = usePermissions()
  
  return (
    <div>
      <PermissionGuard permission="users:read">
        <UsersList />
      </PermissionGuard>
      
      {hasPermission('users:create') && (
        <CreateUserButton />
      )}
    </div>
  )
}
```

### API Service Usage
```jsx
import { usersService } from '@/api/services/users'

const fetchUsers = async () => {
  try {
    const response = await usersService.getAllUsers({
      page: 1,
      limit: 10
    })
    setUsers(response.data.users)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Permission errors**: Ensure backend permissions are properly configured
2. **Token expiry**: Check token refresh implementation
3. **CORS issues**: Verify backend CORS configuration
4. **Build errors**: Check environment variables and dependencies

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## 📞 Support

For support and questions, please refer to the documentation or create an issue in the repository.