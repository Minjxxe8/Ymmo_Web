import client from "./client";
import { mockWalletHandlers } from "./mock/handlers";

const isMock = import.meta.env.VITE_MOCK === "true";
const m = mockWalletHandlers;

export const getWallet = () =>
  isMock ? m.getWallet() : client.get("/api/users/me/wallet");
export const deposit = (data) =>
  isMock ? m.deposit(data) : client.patch("/api/users/me/wallet/deposit", data);
export const withdraw = (data) =>
  isMock ? m.withdraw(data) : client.patch("/api/users/me/wallet/withdraw", data);
