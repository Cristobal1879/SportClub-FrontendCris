import api from './api'

export const sportService = {
  getAll: async () => {
    const res = await api.get('/sports')
    return res.data.data
  },

  getById: async (id) => {
    const res = await api.get(`/sports/${id}`)
    return res.data.data
  },

  create: async (payload) => {
    const res = await api.post('/sports', payload)
    return res.data.data
  },

  update: async (id, payload) => {
    const res = await api.put(`/sports/${id}`, payload)
    return res.data.data
  },

  remove: async (id) => {
    const res = await api.delete(`/sports/${id}`)
    return res.data
  },

  changeStatus: async (id, status) => {
    const res = await api.patch(`/sports/${id}/status`, { status })
    return res.data.data
  }
}
