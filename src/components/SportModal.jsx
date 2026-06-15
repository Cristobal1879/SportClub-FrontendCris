import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'

const emptyForm = { name: '', objective: '', duration: '', status: true }

export default function SportModal({ show, onHide, onSave, sport }) {
  const isEdit = Boolean(sport)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sport) {
      setForm({
        name: sport.name || '',
        objective: sport.objective || '',
        duration: sport.duration?.toString() || '',
        status: sport.status ?? true
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [sport, show])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'El nombre es obligatorio.'
    if (!form.objective.trim()) e.objective = 'El objetivo es obligatorio.'
    if (!form.duration) {
      e.duration = 'La duración es obligatoria.'
    } else if (isNaN(form.duration) || Number(form.duration) <= 0) {
      e.duration = 'Ingresa una duración válida en minutos.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await onSave({
        name: form.name.trim(),
        objective: form.objective.trim(),
        duration: Number(form.duration),
        status: form.status
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton style={{ background: '#f8d7da', borderBottom: '2px solid #f5c2c7' }}>
        <Modal.Title style={{ color: '#842029', fontWeight: 700 }}>
          {isEdit ? '✏️ Editar Deporte' : '➕ Nuevo Deporte'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-3">
          <Col md={8}>
            <Form.Group>
              <Form.Label className="fw-semibold">Nombre del deporte <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: CrossFit, Natación..."
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                isInvalid={Boolean(errors.name)}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold">Duración (minutos) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 60"
                min={1}
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                isInvalid={Boolean(errors.duration)}
              />
              <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="fw-semibold">Objetivo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe el objetivo principal del deporte..."
                value={form.objective}
                onChange={e => setForm({ ...form, objective: e.target.value })}
                isInvalid={Boolean(errors.objective)}
              />
              <Form.Control.Feedback type="invalid">{errors.objective}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="fw-semibold d-block">Estado</Form.Label>
              <Form.Check
                type="switch"
                id="sport-status-switch"
                label={form.status ? '✅ Activo' : '❌ Inactivo'}
                checked={form.status}
                onChange={e => setForm({ ...form, status: e.target.checked })}
                style={{ fontSize: '0.95rem' }}
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
            : isEdit ? '💾 Guardar cambios' : '➕ Crear deporte'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
