import client from './client'

export const getFavorites = () => client.get('/favorites')
export const addFavorite = (propertyId) => client.post(`/favorites/${propertyId}`)
export const removeFavorite = (propertyId) => client.delete(`/favorites/${propertyId}`)