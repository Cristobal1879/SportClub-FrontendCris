import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'El correo es obligatorio.'
    if (!form.password) e.password = 'La contraseña es obligatoria.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const map = { admin: '/admin', coach: '/coach', user: '/user' }
      navigate(map[user.role] || '/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas.'
      Swal.fire({ icon: 'error', title: 'Error al iniciar sesión', text: msg, confirmButtonColor: '#0d6efd' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          <h1>Sport<span>Club</span></h1>
          <p className="text-muted mb-0">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo electrónico</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="correo@ejemplo.cl"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold py-2"
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary fw-semibold text-decoration-none">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
