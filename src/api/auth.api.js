import client from "./client";
import {mockAuth} from "./mock/handlers";

const isMock = import.meta.env.VITE_MOCK === "true";

export const login = (data) =>
    isMock ? mockAuth.login(data) : client.post("/api/auth/login", data);
export const register = (data) =>
    isMock ? mockAuth.register(data) : client.post("/api/auth/register", data);
export const logout = () =>
    isMock ? Promise.resolve() : client.post("/api/auth/logout");
export const refresh = () =>
    isMock ? Promise.resolve() : client.post("/api/auth/refresh");
export const getMe = () =>
    isMock ? mockAuth.getMe() : client.get("/api/users/me");
export const updateMe = (data) =>
    isMock ? mockAuth.updateMe(data) : client.patch("/api/users/me", data);
