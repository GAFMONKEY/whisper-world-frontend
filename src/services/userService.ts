import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Backend-kompatible Union Types (wegen erasableSyntaxOnly)
export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY';
export type Intentions = 'FRIENDS' | 'HOOKUPS' | 'CASUAL_DATING' | 'OPEN_TO_ANYTHING' | 'SHORT_TERM_RELATIONSHIP' | 'LONG_TERM_RELATIONSHIP';
export type YesNo = 'YES' | 'NO';
export type YesNoSometimes = 'YES' | 'NO' | 'SOMETIMES';
export type YesNoMaybe = 'YES' | 'NO' | 'MAYBE';
export type Politics = 'LEFT' | 'RIGHT' | 'CENTER' | 'NOT_POLITICAL' | 'NOT_SPECIFIED';

export interface LikertQuestions {
    closeness: number;
    openness: number;
    quietness: number;
}

export interface Lifestyle {
    childrenWish: YesNoMaybe;
    children: YesNo;
    alcohol: YesNoSometimes;
    smoking: YesNoSometimes;
    cannabis: YesNoSometimes;
    politics: Politics;
}

// Backend-kompatible Answer-Struktur
export interface Answer {
    id: string;
    cluster: string;
    question: string;
    textAnswer?: string;
    audioUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Frontend-kompatible User-Struktur basierend auf Backend-Entity
export interface UserProfile {
    id: string; // UUID
    firstName: string;
    lastName: string;
    gender: Gender;
    email: string;
    birthDate: Date; // Date-Objekt statt String
    interests: string[];
    intentions: Intentions[];
    answers: Answer[];
    datingPreferences: Gender[];
    lifestyle: Lifestyle;
    likert: LikertQuestions;
    accentColor: string;
    likedUsers: string[]; // User-IDs
    passedUsers: string[]; // User-IDs
    profilePictureUrl?: string;
    isVerified: boolean;
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    interests?: string[];
    intentions?: Intentions[];
    answers?: Partial<Answer>[];
    datingPreferences?: Gender[];
    lifestyle?: Partial<Lifestyle>;
    likert?: Partial<LikertQuestions>;
    accentColor?: string;
    profilePictureUrl?: string;
}

// Utility-Funktionen für Type-Konvertierung
export const convertGenderToBackend = (gender: string): Gender => {
    switch (gender.toLowerCase()) {
        case 'male': return 'MALE';
        case 'female': return 'FEMALE';
        case 'non-binary': return 'NON_BINARY';
        default: return 'MALE';
    }
};

export const convertGenderFromBackend = (gender: Gender): string => {
    switch (gender) {
        case 'MALE': return 'male';
        case 'FEMALE': return 'female';
        case 'NON_BINARY': return 'non-binary';
        default: return 'male';
    }
};

export const convertIntentionsToBackend = (intention: string): Intentions => {
    switch (intention.toLowerCase().replace(/\s+/g, '_')) {
        case 'friends': return 'FRIENDS';
        case 'hookups': return 'HOOKUPS';
        case 'casual_dating': return 'CASUAL_DATING';
        case 'open_to_anything': return 'OPEN_TO_ANYTHING';
        case 'short_term_relationship': return 'SHORT_TERM_RELATIONSHIP';
        case 'long_term_relationship': return 'LONG_TERM_RELATIONSHIP';
        default: return 'FRIENDS';
    }
};

export const convertIntentionsFromBackend = (intention: Intentions): string => {
    switch (intention) {
        case 'FRIENDS': return 'friends';
        case 'HOOKUPS': return 'hookups';
        case 'CASUAL_DATING': return 'casual dating';
        case 'OPEN_TO_ANYTHING': return 'open to anything';
        case 'SHORT_TERM_RELATIONSHIP': return 'short-term relationship';
        case 'LONG_TERM_RELATIONSHIP': return 'long-term relationship';
        default: return 'friends';
    }
};

const userService = {
    async getUserProfile(userId: string): Promise<UserProfile> {
        try {
            const response = await api.get(`/users/${userId}`);
            const userData = response.data;

            // Konvertiere Date-Strings zu Date-Objekten
            return {
                ...userData,
                birthDate: new Date(userData.birthDate),
                lastActive: new Date(userData.lastActive),
                createdAt: new Date(userData.createdAt),
                updatedAt: new Date(userData.updatedAt),
                answers: userData.answers?.map((answer: any) => ({
                    ...answer,
                    createdAt: new Date(answer.createdAt),
                    updatedAt: new Date(answer.updatedAt)
                })) || []
            };
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    async updateUserProfile(userId: string, profileData: UpdateProfileData): Promise<UserProfile> {
        try {
            // Konvertiere Date-Objekte zu ISO-Strings für das Backend
            const backendData = {
                ...profileData,
                answers: profileData.answers?.map(answer => ({
                    ...answer,
                    createdAt: answer.createdAt || new Date(),
                    updatedAt: new Date()
                }))
            };

            const response = await api.put(`/users/${userId}`, backendData);
            const userData = response.data;

            // Konvertiere Response zurück zu Frontend-Format
            return {
                ...userData,
                birthDate: new Date(userData.birthDate),
                lastActive: new Date(userData.lastActive),
                createdAt: new Date(userData.createdAt),
                updatedAt: new Date(userData.updatedAt),
                answers: userData.answers?.map((answer: any) => ({
                    ...answer,
                    createdAt: new Date(answer.createdAt),
                    updatedAt: new Date(answer.updatedAt)
                })) || []
            };
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    async createAnswer(userId: string, answerData: {
        cluster: string;
        question: string;
        textAnswer?: string;
        audioUrl?: string;
    }): Promise<Answer> {
        try {
            const response = await api.post(`/users/${userId}/answers`, answerData);
            const answer = response.data;
            return {
                ...answer,
                createdAt: new Date(answer.createdAt),
                updatedAt: new Date(answer.updatedAt)
            };
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    },

    async updateAnswer(userId: string, answerId: string, answerData: {
        textAnswer?: string;
        audioUrl?: string;
    }): Promise<Answer> {
        try {
            const response = await api.put(`/users/${userId}/answers/${answerId}`, answerData);
            const answer = response.data;
            return {
                ...answer,
                createdAt: new Date(answer.createdAt),
                updatedAt: new Date(answer.updatedAt)
            };
        } catch (error) {
            console.error('Error updating answer:', error);
            throw error;
        }
    },

    async deleteAnswer(userId: string, answerId: string): Promise<void> {
        try {
            await api.delete(`/users/${userId}/answers/${answerId}`);
        } catch (error) {
            console.error('Error deleting answer:', error);
            throw error;
        }
    },

    async deleteUser(userId: string): Promise<void> {
        try {
            await api.delete(`/users/${userId}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    async uploadProfilePicture(userId: string, imageFile: File): Promise<{ imageUrl: string }> {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await api.post(`/users/${userId}/upload-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw error;
        }
    },

    async getUserSettings(userId: string): Promise<{
        notifications: boolean;
        discoveryRadius: number;
        ageRange: { min: number; max: number };
        showOnlineStatus: boolean;
    }> {
        try {
            const response = await api.get(`/users/${userId}/settings`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user settings:', error);
            throw error;
        }
    },

    async updateUserSettings(userId: string, settings: {
        notifications?: boolean;
        discoveryRadius?: number;
        ageRange?: { min: number; max: number };
        showOnlineStatus?: boolean;
    }): Promise<void> {
        try {
            await api.put(`/users/${userId}/settings`, settings);
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw error;
        }
    }
};

export { userService };
