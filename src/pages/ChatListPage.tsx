import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Badge,
    CircularProgress,
    Alert,
    Divider,
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
        accentColor?: string; // Akzentfarbe hinzufügen
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
                        accentColor: match.user.accentColor || '#BFA9BE' // Akzentfarbe aus Backend
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
                // Already on chats
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
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #DAA373',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: '#2c2c2c',
                    }}
                >
                    Chats
                </Typography>
                <IconButton sx={{ color: '#BFA9BE' }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            <Box sx={{ backgroundColor: 'white' }}>
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
                    <List sx={{ p: 0 }}>
                        {chatItems.map((item, index) => (
                            <React.Fragment key={item.match.id}>
                                <ListItem
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                        py: 2,
                                        px: 3,
                                    }}
                                    onClick={() => handleChatClick(item.match.id)}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            badgeContent={item.unreadCount > 0 ? item.unreadCount : 0}
                                            color="primary"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.75rem',
                                                    minWidth: 18,
                                                    height: 18,
                                                    fontWeight: 600,
                                                    backgroundColor: '#BFA9BE',
                                                },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    backgroundColor: item.match.otherUser.accentColor || '#DAA373',
                                                    color: 'white',
                                                    fontSize: '1.3rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.match.otherUser.firstName.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={item.match.otherUser.firstName}
                                        secondary={
                                            item.conversation?.lastMessage?.type === 'VOICE'
                                                ? '🎤 Sprachnachricht'
                                                : item.conversation?.lastMessage?.content || 'Sagt Hallo!'
                                        }
                                        primaryTypographyProps={{
                                            variant: "body1",
                                            sx: {
                                                fontWeight: item.unreadCount > 0 ? 600 : 400,
                                                color: 'text.primary',
                                                mb: 0.5,
                                            }
                                        }}
                                        secondaryTypographyProps={{
                                            variant: "body2",
                                            sx: {
                                                color: 'text.secondary',
                                                fontWeight: item.unreadCount > 0 ? 500 : 400,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '180px',
                                            }
                                        }}
                                        sx={{ pr: 2 }}
                                    />

                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: item.unreadCount > 0 ? '#BB7D67' : 'text.secondary',
                                                fontWeight: item.unreadCount > 0 ? 600 : 400,
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            {formatTimestamp(item.lastActivity)}
                                        </Typography>
                                    </Box>
                                </ListItem>
                                {index < chatItems.length - 1 && (
                                    <Divider sx={{ ml: 10, borderColor: '#f0f0f0' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
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
