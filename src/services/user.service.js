import api from './api'

export const userService = {
  getAll: async () => {
    const res = await api.get('/users')
    return res.data.data
  },

  getById: async (id) => {
    const res = await api.get(`/users/${id}`)
    return res.data.data
  },

  create: async (payload) => {
    const res = await api.post('/users', payload)
    return res.data.data
  },

  update: async (id, payload) => {
    const res = await api.put(`/users/${id}`, payload)
    return res.data.data
  },

  remove: async (id) => {
    const res = await api.delete(`/users/${id}`)
    return res.data
  }
}
