import client from './client'
import { mockTransactionsHandlers } from './mock/handlers'

const isMock = import.meta.env.VITE_MOCK === 'true'
const m = mockTransactionsHandlers

export const getTransactions = () => isMock ? m.getTransactions() : client.get('/transactions')
export const getTransactionById = (id) => isMock ? m.getTransactionById(id) : client.get(`/transactions/${id}`)
export const createTransaction = (data) => isMock ? m.createTransaction(data) : client.post('/transactions', data)