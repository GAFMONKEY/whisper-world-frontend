import axios from 'axios';
import type { UserProfile } from './userService';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Backend-kompatible Match-Interface
export interface Match {
    id: string; // UUID
    user1Id: string;
    user2Id: string;
    createdAt: Date;
    status: 'ACTIVE' | 'UNMATCHED' | 'BLOCKED';
    user1?: UserProfile;
    user2?: UserProfile;
}

export interface DiscoverUser {
    id: string;
    name: string;
    age: number;
    accentColor: string;
    categories: {
        name: string;
        color: string;
        questions: {
            question: string;
            answer?: string;
            hasAudio?: boolean;
            audioUrl?: string;
        }[];
    }[];
    lifestyle: {
        childrenWish: string;
        children: string;
        alcohol: string;
        smoking: string;
        cannabis: string;
        politics: string;
    };
}

export interface DisplayMatch {
    id: string;
    user: {
        id: string;
        name: string;
        age: number;
    };
    matchedAt: Date; // Änderung zu Date-Objekt
    lastMessage?: {
        content: string;
        timestamp: Date; // Änderung zu Date-Objekt
    };
}

export interface LikeResponse {
    matched: boolean;
    matchId?: string;
    message: string;
}

function convertUserToDiscoverUser(user: UserProfile): DiscoverUser {
    // Sichere Konvertierung mit Backend-Struktur
    const birthDate = new Date(user.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    // Erstelle dynamische Kategorien basierend auf den verfügbaren Daten
    const categories = [];

    // Interessen Kategorie
    if (user.interests && Array.isArray(user.interests) && user.interests.length > 0) {
        categories.push({
            name: 'Interessen',
            color: '#BFA9BE',
            questions: [
                {
                    question: 'Was sind deine Hobbys?',
                    answer: user.interests.join(', ')
                }
            ]
        });
    }

    // Persönlichkeit Kategorie
    if (user.likert && typeof user.likert === 'object') {
        categories.push({
            name: 'Persönlichkeit',
            color: '#DAA373',
            questions: [
                {
                    question: 'Wie würdest du dich beschreiben?',
                    answer: `Offenheit: ${user.likert.openness || 0}/5, Nähe: ${user.likert.closeness || 0}/5, Ruhe: ${user.likert.quietness || 0}/5`
                }
            ]
        });
    }

    // Absichten Kategorie
    if (user.intentions && Array.isArray(user.intentions) && user.intentions.length > 0) {
        categories.push({
            name: 'Absichten',
            color: '#BB7D67',
            questions: [
                {
                    question: 'Was suchst du hier?',
                    answer: user.intentions.join(', ')
                }
            ]
        });
    }

    // Antworten Kategorien - gruppiert nach Cluster
    if (user.answers && Array.isArray(user.answers) && user.answers.length > 0) {
        const clusterGroups = new Map<string, any[]>();

        user.answers.forEach((answer) => {
            if (answer && typeof answer === 'object' && answer.cluster) {
                const processedAnswer = {
                    question: answer.question || 'Unbekannte Frage',
                    answer: answer.textAnswer || 'Keine Antwort',
                    hasAudio: !!answer.audioUrl,
                    audioUrl: answer.audioUrl
                };

                if (!clusterGroups.has(answer.cluster)) {
                    clusterGroups.set(answer.cluster, []);
                }
                clusterGroups.get(answer.cluster)!.push(processedAnswer);
            }
        });

        // Erstelle Kategorien für jeden Cluster
        clusterGroups.forEach((questions, clusterName) => {
            categories.push({
                name: clusterName,
                color: user.accentColor || '#F2EEE9',
                questions: questions
            });
        });
    }

    // Normalisiere lifestyle object für Frontend-Display
    const normalizedLifestyle = user.lifestyle ? {
        childrenWish: user.lifestyle.childrenWish || 'not specified',
        children: user.lifestyle.children || 'not specified',
        alcohol: user.lifestyle.alcohol || 'not specified',
        smoking: user.lifestyle.smoking || 'not specified',
        cannabis: user.lifestyle.cannabis || 'not specified',
        politics: user.lifestyle.politics || 'not specified'
    } : {
        childrenWish: 'not specified',
        children: 'not specified',
        alcohol: 'not specified',
        smoking: 'not specified',
        cannabis: 'not specified',
        politics: 'not specified'
    };

    return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        age,
        accentColor: user.accentColor || '#BFA9BE',
        categories,
        lifestyle: normalizedLifestyle
    };
}

function convertMatchToDisplayMatch(match: Match, currentUserId: string): DisplayMatch {
    const otherUser = match.user1Id === currentUserId ? match.user2 : match.user1;

    if (!otherUser) {
        throw new Error('Match data incomplete');
    }

    const age = new Date().getFullYear() - new Date(otherUser.birthDate).getFullYear();

    return {
        id: match.id,
        user: {
            id: otherUser.id,
            name: `${otherUser.firstName} ${otherUser.lastName}`,
            age
        },
        matchedAt: match.createdAt, // Bereits Date-Objekt
        lastMessage: {
            content: 'Noch keine Nachrichten',
            timestamp: match.createdAt // Bereits Date-Objekt
        }
    };
}

const matchService = {
    async discoverUsers(userId: string): Promise<DiscoverUser[]> {
        try {
            console.log(`🚀 Making discover request for user: ${userId}`);
            const response = await api.get(`/users/${userId}/discover`);
            const users: UserProfile[] = response.data;

            console.log(`✅ Discovered ${users.length} users from backend`);
            return users.map(user => convertUserToDiscoverUser(user));
        } catch (error) {
            console.error('❌ Backend error for discover:', error);
            throw new Error('Backend not available for discover');
        }
    },

    async likeUser(sourceUserId: string, targetUserId: string): Promise<LikeResponse> {
        try {
            console.log(`🚀 Making like request: ${sourceUserId} -> ${targetUserId}`);
            const response = await api.post(`/users/${sourceUserId}/like/${targetUserId}`);
            console.log('✅ Like response from backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Backend error for like:', error);
            throw new Error('Backend not available or like failed');
        }
    },

    async passUser(sourceUserId: string, targetUserId: string): Promise<void> {
        try {
            await api.post(`/users/${sourceUserId}/pass/${targetUserId}`);
        } catch (error) {
            console.warn('Backend not available for pass, simulating:', error);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },

    async getMatches(userId: string): Promise<DisplayMatch[]> {
        try {
            const response = await api.get(`/matches/${userId}`);
            const matches: any[] = response.data;

            // Konvertiere Date-Strings zu Date-Objekten
            const convertedMatches: Match[] = matches.map(match => ({
                ...match,
                createdAt: new Date(match.createdAt),
                user1: match.user1 ? {
                    ...match.user1,
                    birthDate: new Date(match.user1.birthDate),
                    lastActive: new Date(match.user1.lastActive),
                    createdAt: new Date(match.user1.createdAt),
                    updatedAt: new Date(match.user1.updatedAt)
                } : undefined,
                user2: match.user2 ? {
                    ...match.user2,
                    birthDate: new Date(match.user2.birthDate),
                    lastActive: new Date(match.user2.lastActive),
                    createdAt: new Date(match.user2.createdAt),
                    updatedAt: new Date(match.user2.updatedAt)
                } : undefined
            }));

            return convertedMatches.map(match => convertMatchToDisplayMatch(match, userId));
        } catch (error) {
            console.error('❌ Backend error for matches:', error);
            throw new Error('Backend not available for matches');
        }
    },

    async unmatchUser(matchId: string): Promise<void> {
        try {
            await api.delete(`/matches/${matchId}`);
        } catch (error) {
            console.warn('Backend not available for unmatch, simulating:', error);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },

    async blockUser(sourceUserId: string, targetUserId: string): Promise<void> {
        try {
            await api.post(`/users/${sourceUserId}/block/${targetUserId}`);
        } catch (error) {
            console.warn('Backend not available for block, simulating:', error);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },

    async reportUser(sourceUserId: string, targetUserId: string, reason: string): Promise<void> {
        try {
            await api.post(`/users/${sourceUserId}/report/${targetUserId}`, { reason });
        } catch (error) {
            console.warn('Backend not available for report, simulating:', error);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },

    async getMatchDetails(matchId: string): Promise<Match> {
        try {
            const response = await api.get(`/matches/${matchId}/details`);
            const matchData = response.data;

            // Konvertiere Date-Strings zu Date-Objekten
            return {
                ...matchData,
                createdAt: new Date(matchData.createdAt),
                user1: matchData.user1 ? {
                    ...matchData.user1,
                    birthDate: new Date(matchData.user1.birthDate),
                    lastActive: new Date(matchData.user1.lastActive),
                    createdAt: new Date(matchData.user1.createdAt),
                    updatedAt: new Date(matchData.user1.updatedAt),
                    answers: matchData.user1.answers?.map((answer: any) => ({
                        ...answer,
                        createdAt: new Date(answer.createdAt),
                        updatedAt: new Date(answer.updatedAt)
                    })) || []
                } : undefined,
                user2: matchData.user2 ? {
                    ...matchData.user2,
                    birthDate: new Date(matchData.user2.birthDate),
                    lastActive: new Date(matchData.user2.lastActive),
                    createdAt: new Date(matchData.user2.createdAt),
                    updatedAt: new Date(matchData.user2.updatedAt),
                    answers: matchData.user2.answers?.map((answer: any) => ({
                        ...answer,
                        createdAt: new Date(answer.createdAt),
                        updatedAt: new Date(answer.updatedAt)
                    })) || []
                } : undefined
            };
        } catch (error) {
            console.error('Error fetching match details:', error);
            throw error;
        }
    }
};

export { matchService };
