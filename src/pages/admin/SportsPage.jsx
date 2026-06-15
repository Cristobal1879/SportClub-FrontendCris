import { useState, useEffect, useCallback } from 'react'
import { Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { sportService } from '../../services/sport.service'
import SportModal from '../../components/SportModal'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  const day = String(date.getDate()).padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month} de ${year}`
}

export default function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSport, setEditingSport] = useState(null)

  const fetchSports = useCallback(async () => {
    setLoading(true)
    try {
      const data = await sportService.getAll()
      setSports(data)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo cargar la lista de deportes.',
        confirmButtonColor: '#842029'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSports() }, [fetchSports])

  const openCreate = () => { setEditingSport(null); setShowModal(true) }
  const openEdit = (sport) => { setEditingSport(sport); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingSport(null) }

  const handleSave = async (payload) => {
    try {
      if (editingSport) {
        await sportService.update(editingSport.id, payload)
        Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'El deporte fue actualizado correctamente.', confirmButtonColor: '#842029', timer: 2000, showConfirmButton: false })
      } else {
        await sportService.create(payload)
        Swal.fire({ icon: 'success', title: '¡Creado!', text: 'El deporte fue creado correctamente.', confirmButtonColor: '#842029', timer: 2000, showConfirmButton: false })
      }
      closeModal()
      fetchSports()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo guardar el deporte.',
        confirmButtonColor: '#842029'
      })
      throw err
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Está seguro de eliminar este deporte?',
      text: `"${sport.name}" será eliminado permanentemente.`,
      showCancelButton: true,
      confirmButtonColor: '#842029',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!result.isConfirmed) return
    try {
      await sportService.remove(sport.id)
      Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'El deporte fue eliminado.', confirmButtonColor: '#842029', timer: 1800, showConfirmButton: false })
      fetchSports()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo eliminar.', confirmButtonColor: '#842029' })
    }
  }

  const handleStatusChange = async (sport, newStatus) => {
    // Optimistic update
    setSports(prev => prev.map(s => s.id === sport.id ? { ...s, status: newStatus } : s))
    try {
      await sportService.changeStatus(sport.id, newStatus)
      Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: `"${sport.name}" ahora está ${newStatus ? 'activo' : 'inactivo'}.`,
        confirmButtonColor: '#842029',
        timer: 1800,
        showConfirmButton: false
      })
    } catch (err) {
      // Rollback on error
      setSports(prev => prev.map(s => s.id === sport.id ? { ...s, status: !newStatus } : s))
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado.', confirmButtonColor: '#842029' })
    }
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h5 className="mb-0 fw-bold" style={{ color: '#842029' }}>🏅 Gestión de Deportes</h5>
          <small className="text-muted">Módulo exclusivo para administradores</small>
        </div>
        <span className="badge" style={{ background: '#f8d7da', color: '#842029', fontSize: '0.85rem', padding: '6px 12px', borderRadius: 20 }}>
          {sports.length} deportes
        </span>
      </div>

      <div className="page-header">
        <h2>Deportes</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={fetchSports}
            disabled={loading}
            title="Refrescar lista"
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : '🔄'} Refrescar
          </button>
          <button
            className="btn text-white fw-semibold"
            style={{ background: '#842029', borderColor: '#842029' }}
            onClick={openCreate}
          >
            ➕ Nuevo Deporte
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#842029' }} role="status" />
          <p className="mt-3 text-muted">Cargando deportes...</p>
        </div>
      ) : sports.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🏅</div>
          <h5 className="text-muted mt-2">No hay deportes registrados</h5>
          <button className="btn btn-danger mt-3" onClick={openCreate}>Agregar primer deporte</button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ paddingLeft: '1.25rem' }}>#</th>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sports.map((sport, idx) => (
                  <tr key={sport.id}>
                    <td style={{ paddingLeft: '1.25rem', color: '#6c757d' }}>{idx + 1}</td>
                    <td className="fw-semibold">{sport.name}</td>
                    <td style={{ maxWidth: 280 }}>
                      <span className="text-muted" style={{ fontSize: '0.88rem' }}>
                        {sport.objective.length > 80 ? sport.objective.slice(0, 80) + '...' : sport.objective}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">⏱ {sport.duration} min</span>
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`status-switch-${sport.id}`}
                        checked={sport.status}
                        onChange={e => handleStatusChange(sport, e.target.checked)}
                        label={sport.status
                          ? <span className="badge-active">Activo</span>
                          : <span className="badge-inactive">Inactivo</span>
                        }
                      />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                      {formatDate(sport.created_at)}
                    </td>
                    <td className="text-center">
                      <button
                        className="action-btn btn btn-outline-primary"
                        title="Editar"
                        onClick={() => openEdit(sport)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn btn btn-outline-danger"
                        title="Eliminar"
                        onClick={() => handleDelete(sport)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SportModal
        show={showModal}
        onHide={closeModal}
        onSave={handleSave}
        sport={editingSport}
      />
    </div>
  )
}
