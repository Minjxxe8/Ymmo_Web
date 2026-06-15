import client from "./client";
import { mockTransactionsHandlers } from "./mock/handlers";

const isMock = import.meta.env.VITE_MOCK === "true";
const m = mockTransactionsHandlers;

export const getTransactions = () =>
  isMock ? m.getTransactions() : client.get("/api/transactions");
export const getTransactionById = (id) =>
  isMock ? m.getTransactionById(id) : client.get(`/api/transactions/${id}`);
export const createTransaction = (data) =>
  isMock ? m.createTransaction(data) : client.post("/api/transactions", data);
export const getUserTransaction = (userId) =>
    client.get(`/api/transactions/user/${userId}`);
