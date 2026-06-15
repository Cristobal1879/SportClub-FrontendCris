import { useState, useEffect, useCallback } from 'react'
import Swal from 'sweetalert2'
import { userService } from '../../services/user.service'
import UserModal from '../../components/UserModal'

const ROLE_LABELS = { admin: 'Administrador', coach: 'Coach', user: 'Usuario' }
const ROLE_COLORS = { admin: 'danger', coach: 'success', user: 'primary' }

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getAll()
      setUsers(data)
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo cargar los usuarios.', confirmButtonColor: '#842029' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => { setEditingUser(null); setShowModal(true) }
  const openEdit = (u) => { setEditingUser(u); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingUser(null) }

  const handleSave = async (payload) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, payload)
        Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Usuario actualizado correctamente.', confirmButtonColor: '#842029', timer: 2000, showConfirmButton: false })
      } else {
        await userService.create(payload)
        Swal.fire({ icon: 'success', title: '¡Creado!', text: 'Usuario creado correctamente.', confirmButtonColor: '#842029', timer: 2000, showConfirmButton: false })
      }
      closeModal()
      fetchUsers()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo guardar el usuario.', confirmButtonColor: '#842029' })
      throw err
    }
  }

  const handleDelete = async (u) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Está seguro de eliminar este usuario?',
      text: `"${u.full_name}" será eliminado permanentemente.`,
      showCancelButton: true,
      confirmButtonColor: '#842029',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!result.isConfirmed) return
    try {
      await userService.remove(u.id)
      Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'Usuario eliminado.', confirmButtonColor: '#842029', timer: 1800, showConfirmButton: false })
      fetchUsers()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo eliminar.', confirmButtonColor: '#842029' })
    }
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h5 className="mb-0 fw-bold" style={{ color: '#842029' }}>👥 Gestión de Usuarios</h5>
          <small className="text-muted">Administración de cuentas del sistema</small>
        </div>
        <span className="badge" style={{ background: '#f8d7da', color: '#842029', fontSize: '0.85rem', padding: '6px 12px', borderRadius: 20 }}>
          {users.length} usuarios
        </span>
      </div>

      <div className="page-header">
        <h2>Usuarios</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={fetchUsers} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : '🔄'} Refrescar
          </button>
          <button
            className="btn text-white fw-semibold"
            style={{ background: '#842029', borderColor: '#842029' }}
            onClick={openCreate}
          >
            ➕ Nuevo Usuario
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#842029' }} role="status" />
          <p className="mt-3 text-muted">Cargando usuarios...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>👥</div>
          <h5 className="text-muted mt-2">No hay usuarios registrados</h5>
          <button className="btn btn-danger mt-3" onClick={openCreate}>Agregar primer usuario</button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ paddingLeft: '1.25rem' }}>#</th>
                  <th>Nombre completo</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Fecha nacimiento</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id}>
                    <td style={{ paddingLeft: '1.25rem', color: '#6c757d' }}>{idx + 1}</td>
                    <td className="fw-semibold">{u.full_name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge bg-${ROLE_COLORS[u.role] || 'secondary'}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.88rem' }}>
                      {u.birth_date || '—'}
                    </td>
                    <td className="text-center">
                      <button className="action-btn btn btn-outline-primary" title="Editar" onClick={() => openEdit(u)}>✏️</button>
                      <button className="action-btn btn btn-outline-danger" title="Eliminar" onClick={() => handleDelete(u)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserModal show={showModal} onHide={closeModal} onSave={handleSave} user={editingUser} />
    </div>
  )
}
