import React, { useState } from 'react';
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
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

interface Message {
    id: string;
    text?: string;
    isAudio?: boolean;
    sender: 'user' | 'other';
    timestamp: Date;
}

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [navValue, setNavValue] = useState(2); // Chat tab aktiv
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hey! Schön, dass wir gematcht haben! 😊',
            sender: 'other',
            timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 Minuten ago
        },
        {
            id: '2',
            text: 'Hi! Freut mich auch sehr! Wie war dein Tag?',
            sender: 'user',
            timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 Minuten ago
        },
    ]);

    // Mock user data - in real app this would come from API
    const chatPartner = {
        name: userId === 'max-26' ? 'Max' : userId === 'emma-24' ? 'Emma' : 'Lukas',
        age: userId === 'max-26' ? 26 : userId === 'emma-24' ? 24 : 29,
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
                // Already on chat page
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message,
                sender: 'user',
                timestamp: new Date(),
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Simulate other person's response
            setTimeout(() => {
                const responses = [
                    'Das klingt toll! 😊',
                    'Interessant, erzähl mehr davon!',
                    'Das kann ich gut verstehen.',
                    'Haha, das ist lustig! 😄',
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];

                const responseMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: randomResponse,
                    sender: 'other',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, responseMessage]);
            }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
        }
    };

    const handleVoiceMessage = () => {
        console.log('Voice message recording...');
        // TODO: Implement voice message recording
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                        {chatPartner.name}, {chatPartner.age}
                    </Typography>
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
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            mb: 2,
                        }}
                    >
                        <Card
                            sx={{
                                maxWidth: '70%',
                                backgroundColor: msg.sender === 'user'
                                    ? 'secondary.main'
                                    : 'rgba(255, 255, 255, 0.9)',
                                color: msg.sender === 'user' ? 'white' : 'text.primary',
                                borderRadius: 3,
                                border: msg.sender === 'other' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="body1">
                                    {msg.text}
                                </Typography>
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
                ))}
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
                        placeholder="Nachricht schreiben..."
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
                        onClick={handleVoiceMessage}
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
                        disabled={!message.trim()}
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
                        <SendIcon />
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
