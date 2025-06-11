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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { chatService } from '../services';
import type { ChatConversation } from '../services';
import { getCurrentUser } from '../utils/setupUser';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { matchId } = useParams(); // Verwende matchId statt userId
    const [searchParams] = useSearchParams();
    const startWith = searchParams.get('startWith'); // 'voice' oder 'text'
    const [navValue, setNavValue] = useState(2); // Chat tab aktiv
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState<ChatConversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions] = useState(chatService.getMockSuggestions());
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [showNewMessageNotification, setShowNewMessageNotification] = useState(false);

    // Current user aus localStorage - mit Backend-kompatible UUID
    const user = getCurrentUser();    // Chat-Conversation laden
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
                console.log('🎯 Start with:', startWith);

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
    }, [matchId, user.id, startWith]);

    // Handle startWith intent after conversation is loaded
    useEffect(() => {
        if (conversation && startWith) {
            if (startWith === 'voice') {
                console.log('🎤 Auto-starting voice message recording...');
                // Auto-start voice recording after a short delay
                setTimeout(() => {
                    handleVoiceRecording();
                }, 1000);
            } else if (startWith === 'text') {
                console.log('📝 Auto-focusing text input...');
                // Focus the text input and show welcome message
                setTimeout(() => {
                    const textInput = document.querySelector('#message-input') as HTMLInputElement;
                    if (textInput) {
                        textInput.focus();
                        textInput.placeholder = `Hi ${conversation.otherUser.name}! Schreib deine erste Nachricht...`;
                    }
                }, 500);
            }
        }
    }, [conversation, startWith]);

    // Listen for mock responses in real-time
    useEffect(() => {
        const handleMockMessage = (event: CustomEvent) => {
            const { matchId: eventMatchId, message } = event.detail;
            if (eventMatchId === matchId) {
                console.log('📨 Received mock message:', message);

                // Show typing indicator
                setIsTyping(true);

                // Simulate typing delay
                setTimeout(() => {
                    setIsTyping(false);
                    setConversation(prev => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            messages: [...prev.messages, message],
                            lastMessage: message,
                            unreadCount: prev.unreadCount + 1
                        };
                    });

                    // Show new message notification
                    setShowNewMessageNotification(true);
                    setTimeout(() => setShowNewMessageNotification(false), 3000);
                }, 1500); // 1.5 second typing simulation
            }
        };

        window.addEventListener('newMockMessage', handleMockMessage as EventListener);
        return () => {
            window.removeEventListener('newMockMessage', handleMockMessage as EventListener);
        };
    }, [matchId]);

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
                navigate('/chats');
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
                matchId: matchId!,
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

    const handleVoiceRecording = async () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            setRecordingDuration(0);

            try {
                setSending(true);
                // Mock voice message
                const voiceMessage = await chatService.sendMessage({
                    matchId: matchId!,
                    senderId: user.id,
                    content: 'Sprachnachricht',
                    type: 'VOICE'
                });

                // Update conversation
                setConversation(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        messages: [...prev.messages, voiceMessage],
                        lastMessage: voiceMessage
                    };
                });

                console.log('✅ Voice message sent successfully');
            } catch (err) {
                console.error('❌ Error sending voice message:', err);
                setError('Fehler beim Senden der Sprachnachricht.');
            } finally {
                setSending(false);
            }
        } else {
            // Start recording
            setIsRecording(true);
            setRecordingDuration(0);

            // Mock recording timer
            const timer = setInterval(() => {
                setRecordingDuration(prev => {
                    if (prev >= 30) { // Max 30 seconds
                        clearInterval(timer);
                        handleVoiceRecording(); // Auto-stop
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
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
                '& @keyframes typing': {
                    '0%, 60%, 100%': {
                        transform: 'translateY(0)',
                        opacity: 0.4,
                    },
                    '30%': {
                        transform: 'translateY(-10px)',
                        opacity: 1,
                    },
                },
                '& @keyframes pulse': {
                    '0%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
                    },
                    '70%': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
                    },
                    '100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                    },
                },
                '& @keyframes slideDown': {
                    '0%': {
                        transform: 'translateX(-50%) translateY(-100%)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'translateX(-50%) translateY(0)',
                        opacity: 1,
                    },
                },
            }}
        >
            {/* New Message Notification */}
            {showNewMessageNotification && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 100,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'success.main',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderRadius: 25,
                        boxShadow: 3,
                        zIndex: 1000,
                        animation: 'slideDown 0.3s ease-out',
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        📱 Neue Nachricht von {conversation?.otherUser.name}
                    </Typography>
                </Box>
            )}

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
                        onClick={() => navigate('/chats')}
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            mt: 0.5,
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {formatTime(msg.timestamp)}
                                        {msg.senderId === user.id && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: msg.isRead ? '#4CAF50' : '#FFC107',
                                                    ml: 0.5,
                                                }}
                                                title={msg.isRead ? 'Gelesen' : 'Zugestellt'}
                                            />
                                        )}
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

                {/* Typing Indicator */}
                {isTyping && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            mb: 2,
                        }}
                    >
                        <Card
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: 'text.primary',
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.1)',
                                px: 2,
                                py: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {conversation.otherUser.name} schreibt
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box
                                        key="typing-dot-1"
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            backgroundColor: 'text.secondary',
                                            animation: 'typing 1.4s infinite ease-in-out',
                                            animationDelay: '0s',
                                        }}
                                    />
                                    <Box
                                        key="typing-dot-2"
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            backgroundColor: 'text.secondary',
                                            animation: 'typing 1.4s infinite ease-in-out',
                                            animationDelay: '0.2s',
                                        }}
                                    />
                                    <Box
                                        key="typing-dot-3"
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            backgroundColor: 'text.secondary',
                                            animation: 'typing 1.4s infinite ease-in-out',
                                            animationDelay: '0.4s',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                )}
            </Box>

            {/* Quick Suggestions */}
            {conversation && conversation.messages.length === 1 && !message && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 200, // Above message input
                        left: 0,
                        right: 0,
                        backgroundColor: 'transparent',
                        p: 2,
                        maxHeight: 100,
                        overflowX: 'auto',
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                        Schnelle Antworten:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, pb: 1 }}>
                        {suggestions.slice(0, 3).map((suggestion, suggestionIndex) => (
                            <Button
                                key={`suggestion-${suggestionIndex}-${suggestion.slice(0, 10)}`}
                                variant="outlined"
                                size="small"
                                onClick={async () => {
                                    // Sende die Suggestion direkt ohne das message state zu setzen
                                    if (!conversation || !matchId || sending) return;

                                    try {
                                        setSending(true);

                                        const newMessage = await chatService.sendMessage({
                                            matchId: matchId!,
                                            senderId: user.id,
                                            content: suggestion,
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

                                        console.log('✅ Suggestion sent successfully');
                                    } catch (err) {
                                        console.error('❌ Error sending suggestion:', err);
                                        setError('Fehler beim Senden der Nachricht.');
                                    } finally {
                                        setSending(false);
                                    }
                                }}
                                sx={{
                                    borderRadius: 20,
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    minWidth: 'auto',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                    },
                                }}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

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
                        id="message-input"
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
                        onClick={handleVoiceRecording}
                        disabled={sending}
                        sx={{
                            backgroundColor: isRecording ? '#f44336' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isRecording ? '#d32f2f' : 'primary.dark',
                            },
                            '&:disabled': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                color: 'rgba(0,0,0,0.3)',
                            },
                            animation: isRecording ? 'pulse 1s infinite' : 'none',
                        }}
                    >
                        <MicIcon />
                        {isRecording && recordingDuration > 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: '#f44336',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {recordingDuration}s
                            </Typography>
                        )}
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
