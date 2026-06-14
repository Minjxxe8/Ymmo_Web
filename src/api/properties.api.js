import client from "./client";
import { mockPropertiesHandlers } from "./mock/handlers";

const isMock = import.meta.env.VITE_MOCK === "true";
const m = mockPropertiesHandlers;

export const getProperties = (params) =>
  isMock ? m.getProperties(params) : client.get("/api/properties", { params });
export const getPropertyById = (id) =>
  isMock ? m.getPropertyById(id) : client.get(`/api/properties/${id}`);
export const createProperty = (data) =>
  isMock ? m.createProperty(data) : client.post("/api/properties", data);
export const updateProperty = (id, data) =>
  isMock
    ? m.updateProperty(id, data)
    : client.patch(`/api/properties/${id}`, data);
export const deleteProperty = (id) =>
  isMock ? m.deleteProperty(id) : client.delete(`/api/properties/${id}`);
export const searchProperties = (params) =>
  isMock
    ? m.searchProperties(params)
    : client.get("/api/properties/search", { params });
export const getPropertyTypes = () =>
  isMock ? m.getPropertyTypes() : client.get("/api/properties/types");
export const updatePropertyStatus = (id, status) =>
  isMock
    ? m.updatePropertyStatus(id, status)
    : client.patch(`/api/properties/${id}/status`, { status });
