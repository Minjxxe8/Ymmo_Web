import client from './client'

export const getPopular = () => client.get('/analytics/popular')
export const getTrends = () => client.get('/analytics/trends')
export const getZones = () => client.get('/analytics/zones')
export const getPredictions = () => client.get('/analytics/predictions')