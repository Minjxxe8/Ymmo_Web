import client from './client'

export const getUsers = () => client.get('/users')
export const getUserById = (id) => client.get(`/users/${id}`)
export const deleteUser = (id) => client.delete(`/users/${id}`)