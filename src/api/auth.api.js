import client from './client'

export const register = (data) => client.post('/auth/register', data)
export const login = (data) => client.post('/auth/login', data)
export const logout = () => client.post('/auth/logout')
export const refresh = () => client.post('/auth/refresh')
export const getMe = () => client.get('/users/me')
export const updateMe = (data) => client.put('/users/me', data)