import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'

const emptyForm = { full_name: '', email: '', password: '', role: 'user', birth_date: '' }

export default function UserModal({ show, onHide, onSave, user }) {
  const isEdit = Boolean(user)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        birth_date: user.birth_date || ''
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [user, show])

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'El nombre completo es obligatorio.'
    else if (form.full_name.trim().length < 3) e.full_name = 'Mínimo 3 caracteres.'
    if (!form.email.trim()) e.email = 'El correo es obligatorio.'
    if (!isEdit && !form.password) e.password = 'La contraseña es obligatoria.'
    if (form.password && form.password.length < 8) e.password = 'Mínimo 8 caracteres.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        role: form.role,
        ...(form.birth_date && { birth_date: form.birth_date }),
        ...(form.password && { password: form.password })
      }
      await onSave(payload)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton style={{ background: '#f8d7da', borderBottom: '2px solid #f5c2c7' }}>
        <Modal.Title style={{ color: '#842029', fontWeight: 700 }}>
          {isEdit ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label className="fw-semibold">Nombre completo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Juan Pérez González"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                isInvalid={Boolean(errors.full_name)}
              />
              <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Correo electrónico <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="correo@ejemplo.cl"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                isInvalid={Boolean(errors.email)}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">
                Contraseña {isEdit ? <small className="text-muted">(dejar en blanco para no cambiar)</small> : <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={isEdit ? 'Nueva contraseña (opcional)' : 'Mínimo 8 caracteres'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                isInvalid={Boolean(errors.password)}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Rol</Form.Label>
              <Form.Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={form.birth_date}
                onChange={e => setForm({ ...form, birth_date: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: '#842029', borderColor: '#842029' }}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
            : isEdit ? '💾 Guardar cambios' : '➕ Crear usuario'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
