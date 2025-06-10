import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Axios Instanz mit Basis-Konfiguration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        name?: string;
    };
    token?: string; // Optional, weg machen
    message?: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
