import client from './client'

export const getTransactions = () => client.get('/transactions')
export const getTransactionById = (id) => client.get(`/transactions/${id}`)
export const createTransaction = (data) => client.post('/transactions', data)