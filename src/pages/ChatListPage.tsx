import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
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
        accentColor?: string;
    };
}

const ChatListPage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(2);
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

            let userMatches: Match[] = [];
            try {
                const backendMatches = await matchService.getMatches(user.id);
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
                        interests: [],
                        accentColor: match.user.accentColor || '#BFA9BE'
                    }
                }));
                console.log('✅ Loaded matches from backend:', userMatches.length);
            } catch (matchError) {
                console.warn('❌ Backend not available for matches:', matchError);
                userMatches = [];
            }

            setMatches(userMatches);

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
                navigate('/profile');
                break;
            case 2:
               break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleChatClick = (matchId: string) => {
        navigate(`/chat/${matchId}`);
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            return diffInMinutes <= 1 ? 'Jetzt' : `${diffInMinutes}m`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return diffInDays === 1 ? 'Gestern' : `${diffInDays}d`;
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#F2EEE9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CircularProgress size={60} sx={{ color: '#BFA9BE' }} />
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
                    backgroundColor: '#F2EEE9',
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
                backgroundColor: '#F2EEE9',
                pb: 8,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    px: 3,
                    py: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#2C3E50',
                        letterSpacing: '0.5px',
                    }}
                >
                    Chats
                </Typography>
                <IconButton
                    sx={{
                        color: '#BFA9BE',
                        backgroundColor: 'rgba(191, 169, 190, 0.1)',
                        '&:hover': {
                            backgroundColor: 'rgba(191, 169, 190, 0.2)',
                        }
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* Chat List */}
            <Box sx={{ backgroundColor: 'transparent', px: 2, pt: 2 }}>
                {chatItems.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 3,
                        }}
                    >
                        <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                            Noch keine Chats
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Matches findest du unter dem ❤️ Herz-Symbol
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {chatItems.map((item) => (
                            <Box
                                key={item.match.id}
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: 3,
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    '&:hover': {
                                        backgroundColor: '#fafafa',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                        borderColor: item.match.otherUser.accentColor || '#BFA9BE',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    },
                                    p: 3,
                                }}
                                onClick={() => handleChatClick(item.match.id)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                    {/* Avatar with Badge */}
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                background: `linear-gradient(135deg, ${item.match.otherUser.accentColor || '#BFA9BE'} 0%, ${item.match.otherUser.accentColor || '#BFA9BE'}CC 100%)`,
                                                color: 'white',
                                                fontSize: '1.25rem',
                                                fontWeight: 700,
                                                boxShadow: `0 4px 12px ${item.match.otherUser.accentColor || '#BFA9BE'}30`,
                                                border: '3px solid white',
                                            }}
                                        >
                                            {item.match.otherUser.firstName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        {item.unreadCount > 0 && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -2,
                                                    right: -2,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#FF6B6B',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                                                }}
                                            >
                                                {item.unreadCount > 9 ? '9+' : item.unreadCount}
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Chat Info */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: item.unreadCount > 0 ? 700 : 600,
                                                    color: '#2C3E50',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {item.match.otherUser.firstName}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: item.unreadCount > 0 ? (item.match.otherUser.accentColor || '#BFA9BE') : 'text.secondary',
                                                    fontWeight: item.unreadCount > 0 ? 600 : 400,
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                {formatTimestamp(item.lastActivity)}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: item.unreadCount > 0 ? '#5A6C7D' : 'text.secondary',
                                                fontWeight: item.unreadCount > 0 ? 500 : 400,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {item.conversation?.lastMessage?.type === 'VOICE'
                                                ? '🎤 Sprachnachricht'
                                                : item.conversation?.lastMessage?.content || 'Sagt Hallo!'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <BottomNavigation
                value={navValue}
                onChange={handleNavChange}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTop: '2px solid #DAA373',
                    '& .MuiBottomNavigationAction-root': {
                        color: '#5a5a5a',
                        '&.Mui-selected': {
                            color: '#BFA9BE',
                        },
                    },
                }}
            >
                <BottomNavigationAction icon={<HomeIcon />} />
                <BottomNavigationAction icon={<FavoriteIcon />} />
                <BottomNavigationAction icon={<ChatIcon />} />
                <BottomNavigationAction icon={<SettingsIcon />} />
            </BottomNavigation>
        </Box>
    );
};

export { ChatListPage };
export default ChatListPage;
