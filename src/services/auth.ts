import api from './api';

interface LoginResponse {
    token: string;
}

interface LoginData {
    username: string;
    password: string;
}

export const login = async (data: LoginData): Promise<string> => {
    try {
        const response = await api.post<LoginResponse>('/token/', data);
        const token = response.data.token;
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
}; 