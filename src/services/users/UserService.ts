import publicApi from "../publicApi";
import api from "../api";
import type { UserCreateOrEdit } from "../../components/Dashbords/User";

export const getAllUsers = async (page: number = 1) => {
    const response = await publicApi.get(`/users/?page=${page}`);
    return response.data;
};

export const getUserById = async (profile_id: number) => {
    const response = await publicApi.get(`/users/${profile_id}/`);
    return response.data;
};

export const createUser = async (userData: UserCreateOrEdit) => {
    const response = await api.post('/users/', userData);
    return response.data;
};

export const updateUser = async (profile_id: number, userData: UserCreateOrEdit) => {
    const response = await api.put(`/users/${profile_id}/`, userData);
    return response.data;
};

export const deleteUser = async (profile_id: number) => {
    const response = await api.delete(`/users/${profile_id}/`);
    return response.data;
};

export const getAllGestionnaires = async () => {
    const response = await api.get('/users/allGestionnaires/');
    return response.data;
};








