import client from './client'

export const getProperties = (params) => client.get('/properties', { params })
export const getPropertyById = (id) => client.get(`/properties/${id}`)
export const createProperty = (data) => client.post('/properties', data)
export const updateProperty = (id, data) => client.put(`/properties/${id}`, data)
export const deleteProperty = (id) => client.delete(`/properties/${id}`)
export const searchProperties = (params) => client.get('/properties/search', { params })
export const getPropertyTypes = () => client.get('/properties/types')
export const updatePropertyStatus = (id, status) => client.patch(`/properties/${id}/status`, { status })