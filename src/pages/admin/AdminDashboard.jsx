import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div>
      <div className="topbar">
        <div>
          <h5 className="mb-0 fw-bold" style={{ color: '#842029' }}>Dashboard Administrador</h5>
          <small className="text-muted">Gestión general del sistema SportClub</small>
        </div>
        <span className="badge" style={{ background: '#f8d7da', color: '#842029', fontSize: '0.85rem', padding: '6px 12px', borderRadius: 20 }}>
          🔴 Administrador
        </span>
      </div>

      <div className="mb-4">
        <h4 className="fw-bold">¡Bienvenido/a, {user?.full_name}! 👋</h4>
        <p className="text-muted">Tienes acceso completo al sistema.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #842029, #c0392b)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>👥</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Módulo</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Usuarios</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #6f1521, #842029)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏅</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Módulo</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Deportes</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4a0d10, #6f1521)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚙️</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Acceso</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Total</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">🚀 Accesos rápidos</h6>
              <div className="d-grid gap-2">
                <Link to="/admin/usuarios" className="btn btn-outline-danger">
                  👥 Gestión de Usuarios
                </Link>
                <Link to="/admin/deportes" className="btn btn-outline-danger">
                  🏅 Gestión de Deportes
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">📋 Información de sesión</h6>
              <table className="table table-sm mb-0">
                <tbody>
                  <tr><td className="text-muted">Nombre</td><td className="fw-semibold">{user?.full_name}</td></tr>
                  <tr><td className="text-muted">Correo</td><td className="fw-semibold">{user?.email}</td></tr>
                  <tr><td className="text-muted">Rol</td><td><span className="badge bg-danger">Administrador</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
