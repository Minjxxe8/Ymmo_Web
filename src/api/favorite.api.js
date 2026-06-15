import client from "./client";
import {mockFavoritesHandlers} from "./mock/handlers";

const isMock = import.meta.env.VITE_MOCK === "true";
const m = mockFavoritesHandlers;

export const getFavorites = () =>
    isMock ? m.getFavorites() : client.get("/api/users/me/favorites");
export const addFavorite = (propertyId) =>
    isMock
        ? m.addFavorite(propertyId)
        : client.post(`/api/users/me/favorites`, {id: propertyId});
export const removeFavorite = (propertyId) =>
    isMock
        ? m.removeFavorite(propertyId)
        //TODO : change this way of deleting favorite in api
        : client.delete(`/api/users/me/favorites/${propertyId}`);
