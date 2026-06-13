import client from './client'

export const getWallet = () => client.get('/wallet')
export const deposit = (data) => client.post('/wallet/deposit', data)
export const withdraw = (data) => client.post('/wallet/withdraw', data)