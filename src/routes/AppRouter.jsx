import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

import AdminLayout from '../layouts/AdminLayout'
import CoachLayout from '../layouts/CoachLayout'
import UserLayout from '../layouts/UserLayout'

import AdminDashboard from '../pages/admin/AdminDashboard'
import UsersPage from '../pages/admin/UsersPage'
import SportsPage from '../pages/admin/SportsPage'

import CoachDashboard from '../pages/coach/CoachDashboard'
import UserDashboard from '../pages/user/UserDashboard'

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  const map = { admin: '/admin', coach: '/coach', user: '/user' }
  return <Navigate to={map[user.role] || '/login'} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="deportes" element={<SportsPage />} />
        </Route>

        {/* Coach routes */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute roles={['coach']}>
              <CoachLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CoachDashboard />} />
        </Route>

        {/* User routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute roles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
