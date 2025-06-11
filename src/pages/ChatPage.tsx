import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    BottomNavigation,
    BottomNavigationAction,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../services';
import type { ChatConversation } from '../services';
import { getCurrentUser } from '../utils/setupUser';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { matchId } = useParams(); // Verwende matchId statt userId
    const [navValue, setNavValue] = useState(2); // Chat tab aktiv
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState<ChatConversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    // Current user aus localStorage - mit Backend-kompatible UUID
    const user = getCurrentUser();

    // Chat-Conversation laden
    useEffect(() => {
        const loadConversation = async () => {
            if (!matchId || !user.id) {
                setError('Fehler: Match-ID oder User-ID fehlt');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('🔍 Loading conversation for matchId:', matchId);
                console.log('📱 Current user:', user.id);

                const conv = await chatService.getChatConversation(matchId, user.id);
                setConversation(conv);

                console.log('✅ Conversation loaded:', conv);
            } catch (err) {
                console.error('❌ Error loading conversation:', err);
                setError('Fehler beim Laden des Chats. Versuche es später nochmal.');
            } finally {
                setLoading(false);
            }
        };

        loadConversation();
    }, [matchId, user.id]);

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
                // Already on chat page
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !conversation || !matchId || sending) return;

        try {
            setSending(true);

            console.log('📤 Sending message:', message);

            const newMessage = await chatService.sendMessage({
                matchId,
                senderId: user.id,
                content: message.trim(),
                type: 'TEXT'
            });

            // Update conversation with new message
            setConversation(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, newMessage],
                    lastMessage: newMessage
                };
            });

            setMessage('');
            console.log('✅ Message sent successfully');

        } catch (err) {
            console.error('❌ Error sending message:', err);
            setError('Fehler beim Senden der Nachricht.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading State
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
                    Chat wird geladen...
                </Typography>
            </Box>
        );
    }

    // Error State
    if (error || !conversation) {
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
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {error || 'Chat konnte nicht geladen werden'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={() => navigate('/matches')}>
                            Zu Matches
                        </Button>
                        <Button onClick={() => navigate('/dashboard')}>
                            Zum Dashboard
                        </Button>
                    </Box>
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'secondary.main',
                    boxShadow: 'none',
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/profile')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {conversation.otherUser.name}, {conversation.otherUser.age}
                    </Typography>
                    {conversation.otherUser.isOnline && (
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: '#4CAF50',
                                mr: 1,
                            }}
                        />
                    )}
                </Toolbar>
            </AppBar>

            {/* Messages */}
            <Box
                sx={{
                    flex: 1,
                    p: 2,
                    overflowY: 'auto',
                    pb: 10, // Space for input and bottom nav
                }}
            >
                {conversation.messages && conversation.messages.length > 0 ? (
                    conversation.messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                                mb: 2,
                            }}
                        >
                            <Card
                                sx={{
                                    maxWidth: '70%',
                                    backgroundColor: msg.senderId === user.id
                                        ? 'secondary.main'
                                        : 'rgba(255, 255, 255, 0.9)',
                                    color: msg.senderId === user.id ? 'white' : 'text.primary',
                                    borderRadius: 3,
                                    border: msg.senderId !== user.id ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    {msg.type === 'TEXT' && (
                                        <Typography variant="body1">
                                            {msg.content}
                                        </Typography>
                                    )}
                                    {msg.type === 'VOICE' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton size="small" sx={{ color: 'inherit' }}>
                                                <MicIcon />
                                            </IconButton>
                                            <Typography variant="body2">
                                                Sprachnachricht ({msg.duration || 0}s)
                                            </Typography>
                                        </Box>
                                    )}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            opacity: 0.7,
                                            display: 'block',
                                            mt: 0.5,
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                            🎉 Es ist ein Match!
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Startet die Unterhaltung mit {conversation.otherUser.name}!
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Message Input */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 80, // Above bottom navigation
                    left: 0,
                    right: 0,
                    backgroundColor: 'background.default',
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    p: 2,
                }}
            >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder={`Nachricht an ${conversation.otherUser.name}...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        multiline
                        maxRows={3}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 25,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                        }}
                    />
                    <IconButton
                        onClick={() => console.log('Voice recording not implemented yet')}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        <MicIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sending}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                            },
                            '&:disabled': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                color: 'rgba(0,0,0,0.3)',
                            },
                        }}
                    >
                        {sending ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                </Box>
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

export default ChatPage;
