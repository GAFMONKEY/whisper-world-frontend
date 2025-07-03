import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  audioDuration?: number; // For voice messages in seconds
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
  duration?: number;
}

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
        type: msg.type,
        audioDuration: msg.audioDuration,
        timestamp: (() => {
          const date = new Date(msg.sentAt);
          date.setHours(date.getHours() + 2);
          return date;
        })(),
        isRead: false,
        createdAt: new Date(msg.sentAt),
        updatedAt: new Date(msg.sentAt),
      }));

      // Finde den anderen User aus dem Match
      const otherUserId =
        matchData.user1Id === currentUserId ? matchData.user2Id : matchData.user1Id;

      // Lade User-Details für den anderen User
      let otherUser = {
        id: otherUserId,
        name: 'Match Partner',
        age: 25,
        isOnline: false,
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
          isOnline: Math.random() > 0.5, // Placeholder für Online-Status
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
        unreadCount: messages.filter((msg) => msg.senderId !== currentUserId && !msg.isRead).length,
      };

      return conversation;
    } catch (error) {
      console.warn('Backend not available for chat:', error);
      throw new Error(`Chat conversation for match ${matchId} not found`);
    }
  },

  async sendMessage(messageData: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await api.post(`/matches/${messageData.matchId}/chat-messages`, {
        sender: messageData.senderId,
        message: messageData.content,
        type: messageData.type,
        audioDuration: messageData.duration,
      });

      console.log(response.data);

      const backendMessage = response.data;
      const frontendMessage: ChatMessage = {
        id: backendMessage.id,
        matchId: messageData.matchId,
        senderId: messageData.senderId,
        content: messageData.content,
        type: messageData.type,
        timestamp: new Date(),
        isRead: false,
        createdAt: new Date(backendMessage.sentAt),
        updatedAt: new Date(backendMessage.sentAt),
        audioDuration: messageData.duration,
      };

      return frontendMessage;
    } catch (error) {
      console.warn('Backend not available for sending message:', error);
      throw new Error('Backend not available for sending message');
    }
  },

  async getAllConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const matchesResponse = await api.get(`/matches/user/${userId}`);
      const matches = matchesResponse.data;

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
          updatedAt: new Date(msg.sentAt),
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
            isOnline: Math.random() > 0.5,
          },
          messages,
          lastMessage: messages.length > 0 ? messages[messages.length - 1] : undefined,
          unreadCount: messages.filter((msg) => msg.senderId !== userId && !msg.isRead).length,
        };

        conversations.push(conversation);
      }

      return conversations;
    } catch (error) {
      console.warn('Backend not available for conversations:', error);
      return [];
    }
  },
};

export { chatService };
