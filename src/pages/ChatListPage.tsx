import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Badge,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { chatService, matchService } from '../services';
import type { ChatConversation } from '../services';
import { getCurrentUser } from '../utils/setupUser';

interface Match {
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: string;
    otherUser: {
        id: string;
        firstName: string;
        lastName: string;
        age: number;
        interests: string[];
    };
}

const ChatListPage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(2); // Chat tab aktiv
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = getCurrentUser();

    useEffect(() => {
        loadChatsAndMatches();
    }, []);

    const loadChatsAndMatches = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📋 Loading chats and matches for user:', user.id);

            // Versuche zuerst Matches vom Backend zu laden
            let userMatches: Match[] = [];
            try {
                const backendMatches = await matchService.getMatches(user.id);
                // Konvertiere DisplayMatch zu Match format
                userMatches = backendMatches.map(match => ({
                    id: match.id,
                    user1Id: user.id,
                    user2Id: match.user.id,
                    createdAt: match.matchedAt ? match.matchedAt.toISOString() : new Date().toISOString(),
                    otherUser: {
                        id: match.user.id,
                        firstName: match.user.name.split(' ')[0] || 'User',
                        lastName: match.user.name.split(' ')[1] || '',
                        age: match.user.age,
                        interests: [] // DisplayMatch hat keine interests, daher leer lassen
                    }
                }));
                console.log('✅ Loaded matches from backend:', userMatches.length);
            } catch (matchError) {
                console.warn('❌ Backend not available for matches:', matchError);
                // Keine Mock-Matches erstellen, nur leere Liste
                userMatches = [];
            }

            setMatches(userMatches);

            // Lade Conversations (Mock-System funktioniert bereits)
            const userConversations = await chatService.getAllConversations(user.id);
            setConversations(userConversations);

            console.log('📋 Final state - Matches:', userMatches.length, 'Conversations:', userConversations.length);
        } catch (err) {
            console.error('❌ Error loading chats and matches:', err);
            setError('Fehler beim Laden der Chats. Versuche es später nochmal.');
        } finally {
            setLoading(false);
        }
    };

    const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
        setNavValue(newValue);
        switch (newValue) {
            case 0:
                navigate('/dashboard');
                break;
            case 1:
                navigate('/matches');
                break;
            case 2:
                // Already on chat list
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleChatClick = (matchId: string) => {
        navigate(`/chat/${matchId}`);
    };

    const formatLastMessage = (conversation: ChatConversation) => {
        if (!conversation.lastMessage) return 'Noch keine Nachrichten';

        const { content, type, senderId } = conversation.lastMessage;
        const isFromMe = senderId === user.id;
        const prefix = isFromMe ? 'Du: ' : '';

        if (type === 'VOICE') {
            return `${prefix}🎤 Sprachnachricht`;
        } else if (type === 'IMAGE') {
            return `${prefix}📷 Bild`;
        } else {
            return `${prefix}${content.length > 30 ? content.substring(0, 30) + '...' : content}`;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'jetzt';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString('de-DE');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CircularProgress size={60} sx={{ color: 'secondary.main' }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Lade deine Chats...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                }}
            >
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    <Typography variant="body1">{error}</Typography>
                </Alert>
            </Box>
        );
    }

    // Kombiniere Matches und Conversations
    const chatItems = matches.map(match => {
        const existingConversation = conversations.find(conv => conv.matchId === match.id);
        return {
            match,
            conversation: existingConversation,
            hasMessages: existingConversation && existingConversation.messages.length > 0,
            unreadCount: existingConversation?.unreadCount || 0,
            lastActivity: existingConversation?.lastMessage?.timestamp || new Date(match.createdAt),
        };
    }).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                pb: 8, // Space for bottom navigation
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    pt: 4,
                    backgroundColor: 'secondary.main',
                    color: 'white',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Deine Chats
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {chatItems.length} {chatItems.length === 1 ? 'Match' : 'Matches'}
                </Typography>
            </Box>

            {/* Chat List */}
            <Box sx={{ p: 2 }}>
                {chatItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                            Noch keine Chats
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Matches findest du unter dem Herz-Symbol
                        </Typography>
                    </Box>
                ) : (
                    chatItems.map((item, index) => (
                        <Box key={item.match.id}>
                            <Card
                                sx={{
                                    mb: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: item.unreadCount > 0 ? 'rgba(76, 218, 196, 0.1)' : 'white',
                                    border: item.unreadCount > 0 ? '1px solid rgba(76, 218, 196, 0.3)' : '1px solid rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        transform: 'translateX(5px)',
                                        boxShadow: 2,
                                    },
                                }}
                                onClick={() => handleChatClick(item.match.id)}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {/* Avatar */}
                                        <Badge
                                            badgeContent={item.unreadCount > 0 ? item.unreadCount : 0}
                                            color="error"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.75rem',
                                                    minWidth: 18,
                                                    height: 18,
                                                },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    backgroundColor: 'secondary.main',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.match.otherUser.firstName[0]}
                                            </Avatar>
                                        </Badge>

                                        {/* Chat Info */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: item.unreadCount > 0 ? 600 : 500,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    {item.match.otherUser.firstName} {item.match.otherUser.lastName}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontWeight: item.unreadCount > 0 ? 600 : 400,
                                                    }}
                                                >
                                                    {formatTime(item.lastActivity)}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: item.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                                                    fontWeight: item.unreadCount > 0 ? 500 : 400,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.conversation
                                                    ? formatLastMessage(item.conversation)
                                                    : '👋 Sagt Hallo!'}
                                            </Typography>

                                            {/* Interests Preview */}
                                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                                {item.match.otherUser.interests.slice(0, 2).map((interest, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            backgroundColor: 'rgba(76, 218, 196, 0.1)',
                                                            color: 'secondary.main',
                                                            px: 1,
                                                            py: 0.2,
                                                            borderRadius: 1,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {interest}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                            {index < chatItems.length - 1 && <Divider sx={{ my: 1, opacity: 0.3 }} />}
                        </Box>
                    ))
                )}
            </Box>

            {/* Bottom Navigation */}
            <BottomNavigation
                value={navValue}
                onChange={handleNavChange}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'background.default',
                    borderTop: '1px solid',
                    borderColor: 'secondary.main',
                    '& .MuiBottomNavigationAction-root': {
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'secondary.main',
                        },
                    },
                }}
            >
                <BottomNavigationAction
                    icon={<HomeIcon />}
                    sx={{ minWidth: 'auto' }}
                />
                <BottomNavigationAction
                    icon={<FavoriteIcon />}
                    sx={{ minWidth: 'auto' }}
                />
                <BottomNavigationAction
                    icon={<ChatIcon />}
                    sx={{ minWidth: 'auto' }}
                />
                <BottomNavigationAction
                    icon={<SettingsIcon />}
                    sx={{ minWidth: 'auto' }}
                />
            </BottomNavigation>
        </Box>
    );
};

export default ChatListPage;
