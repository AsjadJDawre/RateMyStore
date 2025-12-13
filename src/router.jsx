import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import Stores from './pages/Stores.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import NotFound from './pages/NotFound.jsx'
import CreateUser from './pages/admin/CreateUser.jsx'
import CreateStore from './pages/admin/CreateStore.jsx'
import AdminStores from './pages/admin/AdminStores.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminUserDetails from './pages/admin/AdminUserDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleBasedRedirect from './components/RoleBasedRedirect.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// A wrapper so AuthProvider sits ABOVE all routes
function RootWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <RootWrapper />,   // <-- AuthProvider lives here
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },

      {
        path: '/app',
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { 
            index: true, 
            element: (
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            )
          },

          {
            path: 'admin/dashboard',
            element: (
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/users',
            element: (
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/users/create',
            element: (
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CreateUser />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/users/:id',
            element: (
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUserDetails />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/stores',
            element: (
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminStores />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/stores/create',
            element: (
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CreateStore />
              </ProtectedRoute>
            ),
          },

          {
            path: 'owner/dashboard',
            element: (
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            ),
          },

          {
            path: 'stores',
            element: (
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <Stores />
              </ProtectedRoute>
            ),
          },

          {
            path: 'account/change-password',
            element: (
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'OWNER']}>
                <ChangePassword />
              </ProtectedRoute>
            ),
          },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
