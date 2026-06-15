import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#842029',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        logout()
        navigate('/login')
      }
    })
  }

  return (
    <div className="theme-admin d-flex">
      <div className="sidebar">
        <div className="sidebar-brand">
          🏋️ SportClub
          <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400, marginTop: 2 }}>Panel Administrador</div>
        </div>

        <ul className="sidebar-nav">
          <li>
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? 'active' : ''}>
              👥 Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/deportes" className={({ isActive }) => isActive ? 'active' : ''}>
              🏅 Deportes
            </NavLink>
          </li>
        </ul>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: 8 }}>
            👤 {user?.full_name}
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 6, padding: '6px 14px', fontSize: '0.85rem', cursor: 'pointer', width: '100%' }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  )
}
