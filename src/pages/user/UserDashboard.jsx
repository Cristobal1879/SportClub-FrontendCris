import { useAuth } from '../../context/AuthContext'

export default function UserDashboard() {
  const { user } = useAuth()
  return (
    <div>
      <div className="topbar">
        <div>
          <h5 className="mb-0 fw-bold" style={{ color: '#0d6efd' }}>Dashboard Usuario</h5>
          <small className="text-muted">Panel de usuarios</small>
        </div>
        <span className="badge" style={{ background: '#cfe2ff', color: '#084298', fontSize: '0.85rem', padding: '6px 12px', borderRadius: 20 }}>
          🔵 Usuario
        </span>
      </div>
      <h4 className="fw-bold">¡Bienvenido/a, {user?.full_name}! 👤</h4>
      <p className="text-muted">Consulta tus deportes y actividades disponibles.</p>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⭐</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Tu rol</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Usuario</div>
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
                  <tr><td className="text-muted">Rol</td><td><span className="badge bg-primary">Usuario</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
