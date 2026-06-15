import client from "./client";
import {mockPropertiesHandlers} from "./mock/handlers";

const isMock = import.meta.env.VITE_MOCK === "true";
const m = mockPropertiesHandlers;

export const getProperties = (params) =>
    isMock ? m.getProperties(params) : client.get("/api/properties", {params});
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
        : client.get("/api/properties/search", {params});
export const getPropertyTypes = () =>
    isMock ? m.getPropertyTypes() : client.get("/api/properties/types");
export const updatePropertyStatus = (id, status) =>
    isMock
        ? m.updatePropertyStatus(id, status)
        : client.patch(`/api/properties/${id}/status`, {status});
export const addPropertyImage = (id, data) => {
    if (isMock) {
        return Promise.resolve({ success: true })
    }
    const token = localStorage.getItem("accessToken");
    const form = new FormData()
    if (data && typeof data.length !== 'undefined') {
        for (let i = 0; i < data.length; i++) {
            const file = data[i]
            if (file) form.append('pictures', file)
        }
    } else if (data instanceof File) {
        form.append('pictures', data)
    }
    return fetch(`/api/properties/${id}/pictures`, {
        method: "POST",
        body: form,
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
};
export const deletePropertyImage = (id, path) => {
    if (isMock) return Promise.resolve({ success: true })
    const token = localStorage.getItem("accessToken");
    return fetch(`/api/properties/${id}/pictures?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
};
