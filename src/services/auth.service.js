import api from './api'

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data.data
  },

  register: async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data.data
  },

  me: async () => {
    const res = await api.get('/auth/me')
    return res.data.data
  },

  updateMe: async (payload) => {
    const res = await api.put('/auth/me', payload)
    return res.data.data
  },

  changePassword: async (payload) => {
    const res = await api.put('/auth/me/password', payload)
    return res.data
  }
}
