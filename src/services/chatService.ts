import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface ChatMessage {
    id: string; // UUID
    matchId: string;
    senderId: string;
    content: string;
    type: 'TEXT' | 'VOICE' | 'IMAGE'; // Backend-Enums
    timestamp: Date; // Date-Objekt statt String
    isRead: boolean;
    audioUrl?: string;
    imageUrl?: string;
    duration?: number; // For voice messages in seconds
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatConversation {
    matchId: string;
    otherUser: {
        id: string;
        name: string;
        age: number;
        lastSeen?: Date; // Date-Objekt
        isOnline?: boolean;
    };
    messages: ChatMessage[];
    lastMessage?: ChatMessage;
    unreadCount: number;
}

export interface SendMessageRequest {
    matchId: string;
    senderId: string;
    content: string;
    type: 'TEXT' | 'VOICE' | 'IMAGE'; // Backend-kompatible Enums
    audioFile?: File;
    imageFile?: File;
}

// Mock data für erweiterten Chat
const mockResponses = [
    "Das klingt ja interessant! Erzähl mir mehr davon 😊",
    "Haha, das kann ich gut verstehen!",
    "Oh wow, das hätte ich nicht gedacht!",
    "Das ist ja eine tolle Idee!",
    "Sehr cool! Wo hast du das denn gemacht?",
    "Das würde ich auch gerne mal ausprobieren!",
    "Stimmt, das sehe ich genauso!",
    "Ich mag deine Art zu denken 😄",
    "Das passt ja perfekt zu dem, was ich auch interessant finde!",
    "Erzähl ruhig weiter, ich höre zu!",
    "Das erinnert mich an etwas Ähnliches, was mir auch passiert ist...",
    "Du scheinst wirklich vielseitig interessiert zu sein!",
    "Das finde ich sehr sympathisch an dir!",
    "Hast du Lust, das mal zusammen zu machen?",
    "Das wäre doch mal ein tolles Date, oder? 😉"
];

const mockVoiceResponses = [
    "Schön, deine Stimme zu hören! 🎤",
    "Eine Sprachnachricht! Das ist ja mal was Besonderes 😊",
    "Ich liebe es, wenn Leute Sprachnachrichten schicken!",
    "Deine Stimme klingt sehr sympathisch!",
    "Soll ich dir auch eine Sprachnachricht zurückschicken?",
    "Das war eine sehr süße Nachricht! 💕"
];

const mockQuestions = [
    "Was machst du denn beruflich?",
    "Hast du heute schon was Schönes erlebt?",
    "Was ist denn dein Lieblingshobby?",
    "Wo würdest du am liebsten mal hinreisen?",
    "Was für Musik hörst du gerne?",
    "Bist du eher ein Morgen- oder Abendmensch?",
    "Was ist dein Lieblingsgericht?",
    "Gehst du gerne ins Kino oder schaust lieber zu Hause?",
    "Sport oder entspannen auf der Couch?",
    "Hund oder Katze? 🐕🐱"
];

// Global store für Mock-Conversations
const mockConversationStore = new Map<string, ChatMessage[]>();
let messageIdCounter = 1000;

// Export für externe Verwendung
export { mockConversationStore };

const chatService = {
    async getChatConversation(matchId: string, currentUserId: string): Promise<ChatConversation> {
        try {
            // Lade Match-Details inkl. Chat-Nachrichten direkt vom Backend
            console.log('📡 Loading match with chat messages from backend:', matchId);
            const response = await api.get(`/matches/${matchId}`);
            const matchData = response.data;

            console.log('✅ Loaded match data from backend:', matchData);

            // Konvertiere Backend-Nachrichten zu Frontend-Format
            const messages: ChatMessage[] = matchData.chatMessages.map((msg: any) => ({
                id: msg.id,
                matchId: matchId,
                senderId: msg.senderId,
                content: msg.message,
                type: 'TEXT' as const,
                timestamp: new Date(msg.sentAt),
                isRead: false, // Backend hat kein read-status, daher default false
                createdAt: new Date(msg.sentAt),
                updatedAt: new Date(msg.sentAt)
            }));

            // Finde den anderen User aus dem Match
            const otherUserId = matchData.user1Id === currentUserId ? matchData.user2Id : matchData.user1Id;

            // Lade User-Details für den anderen User
            let otherUser = {
                id: otherUserId,
                name: 'Match Partner',
                age: 25,
                isOnline: false
            };

            try {
                const userResponse = await api.get(`/users/${otherUserId}`);
                const userData = userResponse.data;

                const birthDate = new Date(userData.birthDate);
                const age = new Date().getFullYear() - birthDate.getFullYear();

                otherUser = {
                    id: otherUserId,
                    name: `${userData.firstName} ${userData.lastName}`,
                    age: age,
                    isOnline: Math.random() > 0.5 // Placeholder für Online-Status
                };
                console.log('✅ Loaded user details for:', otherUser.name);
            } catch (userErr) {
                console.warn('Could not load user details:', userErr);
            }

            const conversation: ChatConversation = {
                matchId,
                otherUser,
                messages,
                lastMessage: messages.length > 0 ? messages[messages.length - 1] : undefined,
                unreadCount: messages.filter(msg => msg.senderId !== currentUserId && !msg.isRead).length
            };

            return conversation;
        } catch (error) {
            console.warn('Backend not available for chat:', error);
            throw new Error(`Chat conversation for match ${matchId} not found`);
        }
    },

    async sendMessage(messageData: SendMessageRequest): Promise<ChatMessage> {
        try {
            if (messageData.type === 'VOICE' || messageData.type === 'IMAGE') {
                console.warn('Voice and image messages not yet supported by backend, using mock response');
                throw new Error('Voice/Image not supported yet');
            }

            console.log('📤 Sending text message via backend API:', messageData);

            const response = await api.post(`/matches/${messageData.matchId}/chat-messages`, {
                sender: messageData.senderId,
                message: messageData.content
            });

            console.log('✅ Message sent via backend:', response.data);

            const backendMessage = response.data;
            const frontendMessage: ChatMessage = {
                id: backendMessage.id,
                matchId: messageData.matchId,
                senderId: messageData.senderId,
                content: messageData.content,
                type: 'TEXT',
                timestamp: new Date(backendMessage.sentAt),
                isRead: false,
                createdAt: new Date(backendMessage.sentAt),
                updatedAt: new Date(backendMessage.sentAt)
            };

            return frontendMessage;
        } catch (error) {
            console.warn('Backend not available for sending message, using enhanced mock:', error);

            const mockMessage: ChatMessage = {
                id: `msg-${messageIdCounter++}`,
                matchId: messageData.matchId,
                senderId: messageData.senderId,
                content: messageData.content,
                type: messageData.type,
                timestamp: new Date(),
                isRead: false,
                audioUrl: messageData.type === 'VOICE' ? '/mock-audio.mp3' : undefined,
                imageUrl: messageData.type === 'IMAGE' ? '/mock-image.jpg' : undefined,
                duration: messageData.type === 'VOICE' ? Math.floor(Math.random() * 20) + 5 : undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const conversationKey = `${messageData.matchId}-${messageData.senderId}`;
            const existingMessages = mockConversationStore.get(conversationKey) || [];
            existingMessages.push(mockMessage);
            mockConversationStore.set(conversationKey, existingMessages);

            setTimeout(() => {
                this.generateMockResponse(messageData.matchId, messageData.senderId, messageData.type, messageData.content);
            }, Math.random() * 3000 + 2000);

            return mockMessage;
        }
    },

    async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
        try {
            await api.put(`/chats/${matchId}/read`, { userId });
        } catch (error) {
            console.warn('Backend not available for marking messages as read:', error);
        }
    },

    async deleteMessage(messageId: string): Promise<void> {
        try {
            await api.delete(`/chats/messages/${messageId}`);
        } catch (error) {
            console.warn('Backend not available for deleting message:', error);
        }
    },

    async getAllConversations(userId: string): Promise<ChatConversation[]> {
        try {
            console.log('📡 Loading all matches with chat messages from backend for user:', userId);
            const matchesResponse = await api.get(`/matches/user/${userId}`);
            const matches = matchesResponse.data;

            console.log('✅ Loaded matches from backend:', matches.length);

            const conversations: ChatConversation[] = [];

            for (const match of matches) {
                const messages: ChatMessage[] = match.chatMessages.map((msg: any) => ({
                    id: msg.id,
                    matchId: match.id,
                    senderId: msg.senderId,
                    content: msg.message,
                    type: 'TEXT' as const,
                    timestamp: new Date(msg.sentAt),
                    isRead: false,
                    createdAt: new Date(msg.sentAt),
                    updatedAt: new Date(msg.sentAt)
                }));

                const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;

                let otherUserName = 'Match Partner';
                let otherUserAge = 25;

                try {
                    const userResponse = await api.get(`/users/${otherUserId}`);
                    const userData = userResponse.data;

                    const birthDate = new Date(userData.birthDate);
                    const age = new Date().getFullYear() - birthDate.getFullYear();

                    otherUserName = `${userData.firstName} ${userData.lastName}`;
                    otherUserAge = age;
                } catch (userErr) {
                    console.warn(`Could not load user details for ${otherUserId}:`, userErr);
                }

                const conversation: ChatConversation = {
                    matchId: match.id,
                    otherUser: {
                        id: otherUserId,
                        name: otherUserName,
                        age: otherUserAge,
                        lastSeen: new Date(Date.now() - 10 * 60 * 1000),
                        isOnline: Math.random() > 0.5
                    },
                    messages,
                    lastMessage: messages.length > 0 ? messages[messages.length - 1] : undefined,
                    unreadCount: messages.filter(msg => msg.senderId !== userId && !msg.isRead).length
                };

                conversations.push(conversation);
            }

            console.log('✅ Created conversations from backend data:', conversations.length);
            return conversations;
        } catch (error) {
            console.warn('Backend not available for conversations:', error);
            return [];
        }
    },

    async recordVoiceMessage(duration: number): Promise<Blob> {
        // Client-side voice recording implementation
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            return new Promise((resolve, reject) => {
                mediaRecorder.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    stream.getTracks().forEach(track => track.stop());
                    resolve(blob);
                };

                mediaRecorder.onerror = (error) => {
                    reject(error);
                };

                mediaRecorder.start();

                // Stop recording after specified duration
                setTimeout(() => {
                    mediaRecorder.stop();
                }, duration * 1000);
            });
        } catch (error) {
            console.error('Error recording voice message:', error);
            throw error;
        }
    },

    async playVoiceMessage(audioUrl: string): Promise<void> {
        try {
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error('Error playing voice message:', error);
            throw error;
        }
    },

    // Enhanced mock response system
    generateMockResponse(matchId: string, currentUserId: string, messageType: 'TEXT' | 'VOICE' | 'IMAGE', userMessage: string): void {
        const conversationKey = `${matchId}-${currentUserId}`;
        const existingMessages = mockConversationStore.get(conversationKey) || [];

        // Finde den anderen User
        const otherUserId = existingMessages.find(msg => msg.senderId !== currentUserId)?.senderId || 'other-user';

        let responseContent = '';

        if (messageType === 'VOICE') {
            // Antwort auf Sprachnachricht
            responseContent = mockVoiceResponses[Math.floor(Math.random() * mockVoiceResponses.length)];
        } else {
            // Intelligente Textantwort basierend auf Inhalt
            const userMessageLower = userMessage.toLowerCase();

            if (userMessageLower.includes('hallo') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
                responseContent = "Hallo! Schön von dir zu hören! 😊";
            } else if (userMessageLower.includes('wie geht') || userMessageLower.includes('wie gehts')) {
                responseContent = "Mir geht es super, danke der Nachfrage! Und dir?";
            } else if (userMessageLower.includes('?')) {
                // Auf Fragen antworten und eine Gegenfrage stellen
                responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            } else if (Math.random() > 0.7) {
                // 30% Chance auf eine Frage zurück
                responseContent = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
            } else {
                // Normale Antwort
                responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            }
        }

        const mockResponse: ChatMessage = {
            id: `msg-${messageIdCounter++}`,
            matchId,
            senderId: otherUserId,
            content: responseContent,
            type: 'TEXT',
            timestamp: new Date(),
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        existingMessages.push(mockResponse);
        mockConversationStore.set(conversationKey, existingMessages);

        // Simuliere automatisches "Lesen" der Nachrichten nach kurzer Zeit
        setTimeout(() => {
            const updatedMessages = mockConversationStore.get(conversationKey) || [];
            updatedMessages.forEach(msg => {
                if (msg.senderId === otherUserId) {
                    msg.isRead = true;
                }
            });
            mockConversationStore.set(conversationKey, updatedMessages);
        }, 5000); // Nach 5 Sekunden als "gelesen" markieren

        // Trigger ein Event für Live-Updates (falls der Chat offen ist)
        window.dispatchEvent(new CustomEvent('newMockMessage', {
            detail: { matchId, message: mockResponse }
        }));
    },

    // Hole Mock-Antworten für automatische Vervollständigung
    getMockSuggestions(): string[] {
        return [
            "Das klingt interessant!",
            "Erzähl mir mehr davon",
            "Wie war dein Tag?",
            "Hast du Lust auf ein Date?",
            "Das würde ich auch gerne mal machen!",
            "Du bist wirklich sympathisch 😊"
        ];
    }
};

export { chatService };
