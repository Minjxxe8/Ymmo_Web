import client from './client'
import { mockAuth } from './mock/handlers'

const isMock = import.meta.env.VITE_MOCK === 'true'

export const login = (data) => isMock ? mockAuth.login(data) : client.post('/auth/login', data)
export const register = (data) => isMock ? mockAuth.register(data) : client.post('/auth/register', data)
export const logout = () => isMock ? Promise.resolve() : client.post('/auth/logout')
export const refresh = () => isMock ? Promise.resolve() : client.post('/auth/refresh')
export const getMe = () => isMock ? mockAuth.getMe() : client.get('/users/me')
export const updateMe = (data) => isMock ? mockAuth.updateMe(data) : client.put('/users/me', data)