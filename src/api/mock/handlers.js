import { mockUsers, mockToken } from './data/auth.mock'
import { mockProperties, mockPropertyTypes } from './data/properties.mock'
import { mockFavorites } from './data/favorites.mock'
import { mockWallet } from './data/wallet.mock'
import { mockTransactions } from './data/transactions.mock'
import { mockPopular, mockTrends, mockZones, mockPredictions } from './data/analytics.mock'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

let favorites = [...mockFavorites]

export const mockAuth = {
    login: async ({ email, password }) => {
        await delay()
        const user = mockUsers.find((u) => u.email === email)
        if (!user || password !== 'password') throw { message: 'Identifiants incorrects.' }
        return { user, token: mockToken }
    },
    register: async (data) => {
        await delay()
        const user = { id: String(mockUsers.length + 1), ...data, role: 'client', avatar: null }
        return { user, token: mockToken }
    },
    getMe: async () => {
        await delay(100)
        return mockUsers[0]
    },
    updateMe: async (data) => {
        await delay()
        return { ...mockUsers[0], ...data }
    },
}

export const mockPropertiesHandlers = {
    getProperties: async (params) => {
        await delay()
        let results = [...mockProperties]
        if (params?.type) results = results.filter((p) => p.type === params.type)
        if (params?.city) results = results.filter((p) => p.city.toLowerCase().includes(params.city.toLowerCase()))
        if (params?.minPrice) results = results.filter((p) => p.price >= Number(params.minPrice))
        if (params?.maxPrice) results = results.filter((p) => p.price <= Number(params.maxPrice))
        return results
    },
    getPropertyById: async (id) => {
        await delay()
        const property = mockProperties.find((p) => p.id === id)
        if (!property) throw { message: 'Bien introuvable.' }
        return property
    },
    createProperty: async (data) => {
        await delay()
        return { id: String(mockProperties.length + 1), ...data, createdAt: new Date().toISOString() }
    },
    updateProperty: async (id, data) => {
        await delay()
        return { ...mockProperties.find((p) => p.id === id), ...data }
    },
    deleteProperty: async (id) => {
        await delay()
        return { success: true }
    },
    searchProperties: async (params) => {
        await delay()
        return mockProperties.filter((p) =>
            p.title.toLowerCase().includes(params?.q?.toLowerCase() ?? '') ||
            p.city.toLowerCase().includes(params?.q?.toLowerCase() ?? '')
        )
    },
    getPropertyTypes: async () => {
        await delay(100)
        return mockPropertyTypes
    },
    updatePropertyStatus: async (id, status) => {
        await delay()
        return { ...mockProperties.find((p) => p.id === id), status }
    },
}

export const mockFavoritesHandlers = {
    getFavorites: async () => {
        await delay()
        return mockProperties.filter((p) => favorites.includes(p.id))
    },
    addFavorite: async (propertyId) => {
        await delay()
        if (!favorites.includes(propertyId)) favorites.push(propertyId)
        return { success: true }
    },
    removeFavorite: async (propertyId) => {
        await delay()
        favorites = favorites.filter((id) => id !== propertyId)
        return { success: true }
    },
}

export const mockWalletHandlers = {
    getWallet: async () => {
        await delay()
        return mockWallet
    },
    deposit: async ({ amount }) => {
        await delay()
        return { ...mockWallet, balance: mockWallet.balance + Number(amount) }
    },
    withdraw: async ({ amount }) => {
        await delay()
        if (amount > mockWallet.balance) throw { message: 'Solde insuffisant.' }
        return { ...mockWallet, balance: mockWallet.balance - Number(amount) }
    },
}

export const mockTransactionsHandlers = {
    getTransactions: async () => {
        await delay()
        return mockTransactions
    },
    getTransactionById: async (id) => {
        await delay()
        return mockTransactions.find((t) => t.id === id)
    },
    createTransaction: async (data) => {
        await delay()
        return { id: String(mockTransactions.length + 1), ...data, date: new Date().toISOString(), status: 'completed' }
    },
}

export const mockAnalyticsHandlers = {
    getPopular: async () => { await delay(); return mockPopular },
    getTrends: async () => { await delay(); return mockTrends },
    getZones: async () => { await delay(); return mockZones },
    getPredictions: async () => { await delay(); return mockPredictions },
}