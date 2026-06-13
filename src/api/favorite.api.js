import client from './client'
import { mockFavoritesHandlers } from './mock/handlers'

const isMock = import.meta.env.VITE_MOCK === 'true'
const m = mockFavoritesHandlers

export const getFavorites = () => isMock ? m.getFavorites() : client.get('/favorites')
export const addFavorite = (propertyId) => isMock ? m.addFavorite(propertyId) : client.post(`/favorites/${propertyId}`)
export const removeFavorite = (propertyId) => isMock ? m.removeFavorite(propertyId) : client.delete(`/favorites/${propertyId}`)