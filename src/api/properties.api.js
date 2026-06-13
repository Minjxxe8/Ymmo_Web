import client from './client'
import { mockPropertiesHandlers } from './mock/handlers'

const isMock = import.meta.env.VITE_MOCK === 'true'
const m = mockPropertiesHandlers

export const getProperties = (params) => isMock ? m.getProperties(params) : client.get('/properties', { params })
export const getPropertyById = (id) => isMock ? m.getPropertyById(id) : client.get(`/properties/${id}`)
export const createProperty = (data) => isMock ? m.createProperty(data) : client.post('/properties', data)
export const updateProperty = (id, data) => isMock ? m.updateProperty(id, data) : client.put(`/properties/${id}`, data)
export const deleteProperty = (id) => isMock ? m.deleteProperty(id) : client.delete(`/properties/${id}`)
export const searchProperties = (params) => isMock ? m.searchProperties(params) : client.get('/properties/search', { params })
export const getPropertyTypes = () => isMock ? m.getPropertyTypes() : client.get('/properties/types')
export const updatePropertyStatus = (id, status) => isMock ? m.updatePropertyStatus(id, status) : client.patch(`/properties/${id}/status`, { status })