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
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    birthDate: string;
    interests: string[];
    datingPreferences: string[];
    likert: {
        openness: number;
        closeness: number;
        quietness: number;
    };
    likedUsers: string[];
    passedUsers: string[];
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
