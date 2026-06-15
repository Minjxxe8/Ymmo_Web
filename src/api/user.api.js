import client from "./client";

export const getUsers = () => client.get("/api/users");
export const getUserById = (id) => client.get(`/api/users/${id}`);
export const deleteUser = (id) => client.delete(`/api/users/${id}`);
export const toggleRoleUser = (id) => client.patch(`api/users/${id}/role`)
