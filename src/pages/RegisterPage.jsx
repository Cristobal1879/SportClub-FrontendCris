import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirmPassword: '', role: 'user', birth_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'El nombre completo es obligatorio.'
    else if (form.full_name.trim().length < 3) e.full_name = 'Mínimo 3 caracteres.'
    if (!form.email.trim()) e.email = 'El correo es obligatorio.'
    if (!form.password) e.password = 'La contraseña es obligatoria.'
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.'
    if (!form.confirmPassword) e.confirmPassword = 'Confirma tu contraseña.'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.birth_date && { birth_date: form.birth_date })
      }
      const user = await register(payload)
      Swal.fire({ icon: 'success', title: '¡Registro exitoso!', text: `Bienvenido/a, ${user.full_name}`, confirmButtonColor: '#0d6efd', timer: 2000, showConfirmButton: false })
      setTimeout(() => {
        const map = { admin: '/admin', coach: '/coach', user: '/user' }
        navigate(map[user.role] || '/login')
      }, 2000)
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo completar el registro.'
      Swal.fire({ icon: 'error', title: 'Error en registro', text: msg, confirmButtonColor: '#0d6efd' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ maxWidth: 480 }}>
        <div className="login-logo">
          <h1>Sport<span>Club</span></h1>
          <p className="text-muted mb-0">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input
              type="text"
              className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
              placeholder="Juan Pérez"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
            />
            {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
          </div>

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

          <div className="row g-3 mb-3">
            <div className="col">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Mín. 8 caracteres"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="col">
              <label className="form-label fw-semibold">Confirmar contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Repite la contraseña"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col">
              <label className="form-label fw-semibold">Rol</label>
              <select
                className="form-select"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="col">
              <label className="form-label fw-semibold">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={form.birth_date}
                onChange={e => setForm({ ...form, birth_date: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold py-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
