import client from './client'
import { mockWalletHandlers } from './mock/handlers'

const isMock = import.meta.env.VITE_MOCK === 'true'
const m = mockWalletHandlers

export const getWallet = () => isMock ? m.getWallet() : client.get('/wallet')
export const deposit = (data) => isMock ? m.deposit(data) : client.post('/wallet/deposit', data)
export const withdraw = (data) => isMock ? m.withdraw(data) : client.post('/wallet/withdraw', data)