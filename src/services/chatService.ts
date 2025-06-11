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

// Mock data für Fallback
const mockMessages: ChatMessage[] = [
    {
        id: 'msg-1',
        matchId: 'match-1',
        senderId: 'other-user',
        content: 'Hey! Wie geht es dir denn so?',
        type: 'TEXT',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
        id: 'msg-2',
        matchId: 'match-1',
        senderId: 'current-user',
        content: 'Hi! Mir geht es gut, danke! Wie war dein Tag?',
        type: 'TEXT',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        isRead: true,
        createdAt: new Date(Date.now() - 90 * 60 * 1000),
        updatedAt: new Date(Date.now() - 90 * 60 * 1000)
    },
    {
        id: 'msg-3',
        matchId: 'match-1',
        senderId: 'other-user',
        content: 'Hier ist eine Sprachnachricht für dich!',
        type: 'VOICE',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        audioUrl: '/mock-audio.mp3',
        duration: 15,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000)
    }
];

const chatService = {
    async getChatConversation(matchId: string, currentUserId: string): Promise<ChatConversation> {
        try {
            const response = await api.get(`/chats/${matchId}`);
            const conversationData = response.data;

            // Konvertiere Date-Strings zu Date-Objekten
            return {
                ...conversationData,
                otherUser: {
                    ...conversationData.otherUser,
                    lastSeen: conversationData.otherUser.lastSeen ? new Date(conversationData.otherUser.lastSeen) : undefined
                },
                messages: conversationData.messages?.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                    createdAt: new Date(msg.createdAt),
                    updatedAt: new Date(msg.updatedAt)
                })) || [],
                lastMessage: conversationData.lastMessage ? {
                    ...conversationData.lastMessage,
                    timestamp: new Date(conversationData.lastMessage.timestamp),
                    createdAt: new Date(conversationData.lastMessage.createdAt),
                    updatedAt: new Date(conversationData.lastMessage.updatedAt)
                } : undefined
            };
        } catch (error) {
            console.warn('Backend not available for chat, using mock data:', error);

            // Erstelle intelligente Mock-Conversation basierend auf matchId
            console.log('🔍 Creating mock conversation for matchId:', matchId);
            console.log('📱 Current user ID:', currentUserId);

            // Versuche den anderen User aus dem Backend zu holen
            let otherUserName = 'Match Partner';
            let otherUserAge = 25;
            let otherUserId = 'unknown';

            // Lade alle User und finde den Match-Partner
            try {
                const allUsersResponse = await fetch('http://localhost:3000/users');
                const allUsers = await allUsersResponse.json();

                // Wenn matchId eine echte Match-ID ist, versuche den Match zu finden
                if (matchId && matchId.startsWith('match-')) {
                    // Versuche den Match aus dem Backend zu holen
                    try {
                        const matchResponse = await fetch(`http://localhost:3000/matches/${currentUserId}`);
                        const matches = await matchResponse.json();
                        const targetMatch = matches.find((m: any) => m.id === matchId);

                        if (targetMatch) {
                            // Finde den anderen User aus dem Match
                            const otherUserId_fromMatch = targetMatch.user1Id === currentUserId ? targetMatch.user2Id : targetMatch.user1Id;
                            const otherUser = allUsers.find((u: any) => u.id === otherUserId_fromMatch);

                            if (otherUser) {
                                otherUserName = `${otherUser.firstName} ${otherUser.lastName}`;
                                otherUserAge = new Date().getFullYear() - new Date(otherUser.birthDate).getFullYear();
                                otherUserId = otherUser.id;
                                console.log('✅ Found actual match partner from backend:', otherUserName);
                            }
                        }
                    } catch (matchErr) {
                        console.log('Could not fetch match data, falling back to user lookup');
                    }
                }

                // Fallback: Wenn matchId ein User-ID ist, verwende diese direkt
                if (otherUserId === 'unknown' && matchId && !matchId.startsWith('match-')) {
                    const otherUser = allUsers.find((u: any) => u.id === matchId);
                    if (otherUser) {
                        otherUserName = `${otherUser.firstName} ${otherUser.lastName}`;
                        otherUserAge = new Date().getFullYear() - new Date(otherUser.birthDate).getFullYear();
                        otherUserId = otherUser.id;
                        console.log('✅ Found match partner by ID:', otherUserName);
                    }
                }

                // Final fallback: Finde irgendeinen anderen User
                if (otherUserId === 'unknown') {
                    const otherUser = allUsers.find((u: any) => u.id !== currentUserId);
                    if (otherUser) {
                        otherUserName = `${otherUser.firstName} ${otherUser.lastName}`;
                        otherUserAge = new Date().getFullYear() - new Date(otherUser.birthDate).getFullYear();
                        otherUserId = otherUser.id;
                        console.log('⚠️ Using fallback match partner:', otherUserName);
                    }
                }
            } catch (err) {
                console.log('Could not fetch users for mock data');
            }

            // Mock conversation für Fallback
            console.log('🎭 Creating mock conversation with user:', otherUserName, 'ID:', otherUserId);

            return {
                matchId,
                otherUser: {
                    id: otherUserId,
                    name: otherUserName,
                    age: otherUserAge,
                    lastSeen: new Date(Date.now() - 10 * 60 * 1000),
                    isOnline: Math.random() > 0.5 // Random online status
                },
                messages: [
                    {
                        ...mockMessages[0],
                        matchId,
                        content: `Hey ${JSON.parse(localStorage.getItem('user') || '{}').firstName || 'there'}! Schön, dass wir gematcht haben! 😊`
                    },
                    {
                        ...mockMessages[1],
                        matchId,
                        senderId: currentUserId,
                        content: `Hi ${otherUserName.split(' ')[0]}! Freut mich auch sehr! 🎉`
                    }
                ],
                lastMessage: {
                    ...mockMessages[1],
                    matchId,
                    senderId: currentUserId,
                    content: `Hi ${otherUserName.split(' ')[0]}! Freut mich auch sehr! 🎉`
                },
                unreadCount: 0
            };
        }
    },

    async sendMessage(messageData: SendMessageRequest): Promise<ChatMessage> {
        try {
            if (messageData.type === 'VOICE' && messageData.audioFile) {
                // Voice message upload
                const formData = new FormData();
                formData.append('audio', messageData.audioFile);
                formData.append('matchId', messageData.matchId);
                formData.append('senderId', messageData.senderId);
                formData.append('content', messageData.content);

                const response = await api.post('/chats/send-voice', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const messageResponse = response.data;
                return {
                    ...messageResponse,
                    timestamp: new Date(messageResponse.timestamp),
                    createdAt: new Date(messageResponse.createdAt),
                    updatedAt: new Date(messageResponse.updatedAt)
                };

            } else if (messageData.type === 'IMAGE' && messageData.imageFile) {
                // Image message upload
                const formData = new FormData();
                formData.append('image', messageData.imageFile);
                formData.append('matchId', messageData.matchId);
                formData.append('senderId', messageData.senderId);
                formData.append('content', messageData.content);

                const response = await api.post('/chats/send-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const messageResponse = response.data;
                return {
                    ...messageResponse,
                    timestamp: new Date(messageResponse.timestamp),
                    createdAt: new Date(messageResponse.createdAt),
                    updatedAt: new Date(messageResponse.updatedAt)
                };

            } else {
                // Text message
                const response = await api.post('/chats/send-text', {
                    matchId: messageData.matchId,
                    senderId: messageData.senderId,
                    content: messageData.content
                });

                const messageResponse = response.data;
                return {
                    ...messageResponse,
                    timestamp: new Date(messageResponse.timestamp),
                    createdAt: new Date(messageResponse.createdAt),
                    updatedAt: new Date(messageResponse.updatedAt)
                };
            }
        } catch (error) {
            console.warn('Backend not available for sending message, simulating:', error);

            // Mock response für Fallback
            const mockMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                matchId: messageData.matchId,
                senderId: messageData.senderId,
                content: messageData.content,
                type: messageData.type,
                timestamp: new Date(),
                isRead: false,
                audioUrl: messageData.type === 'VOICE' ? '/mock-audio.mp3' : undefined,
                imageUrl: messageData.type === 'IMAGE' ? '/mock-image.jpg' : undefined,
                duration: messageData.type === 'VOICE' ? 10 : undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            };

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
            const response = await api.get(`/chats/user/${userId}`);
            const conversationsData = response.data;

            // Konvertiere Date-Strings zu Date-Objekten
            return conversationsData.map((conversation: any) => ({
                ...conversation,
                otherUser: {
                    ...conversation.otherUser,
                    lastSeen: conversation.otherUser.lastSeen ? new Date(conversation.otherUser.lastSeen) : undefined
                },
                messages: conversation.messages?.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                    createdAt: new Date(msg.createdAt),
                    updatedAt: new Date(msg.updatedAt)
                })) || [],
                lastMessage: conversation.lastMessage ? {
                    ...conversation.lastMessage,
                    timestamp: new Date(conversation.lastMessage.timestamp),
                    createdAt: new Date(conversation.lastMessage.createdAt),
                    updatedAt: new Date(conversation.lastMessage.updatedAt)
                } : undefined
            }));
        } catch (error) {
            console.warn('Backend not available for conversations, using mock data:', error);

            // Mock conversations für Fallback
            return [
                {
                    matchId: 'match-1',
                    otherUser: {
                        id: 'max-26',
                        name: 'Max',
                        age: 26,
                        lastSeen: new Date(Date.now() - 10 * 60 * 1000),
                        isOnline: false
                    },
                    messages: mockMessages,
                    lastMessage: mockMessages[mockMessages.length - 1],
                    unreadCount: 1
                }
            ];
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
    }
};

export { chatService };
