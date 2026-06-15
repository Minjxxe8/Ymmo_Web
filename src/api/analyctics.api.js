import client from './client'
import { mockAnalyticsHandlers } from './mock/handlers'

const isMock = import.meta.env.VITE_MOCK === 'true'
const m = mockAnalyticsHandlers

export const getPopular = () => isMock ? m.getPopular() : client.get('/analytics/popular')
export const getTrends = () => isMock ? m.getTrends() : client.get('/analytics/trends')
export const getZones = () => isMock ? m.getZones() : client.get('/analytics/zones')
export const getPredictions = () => isMock ? m.getPredictions() : client.get('/analytics/predictions')