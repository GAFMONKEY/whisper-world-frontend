import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import MicIcon from '@mui/icons-material/Mic';
import { getCurrentUser } from '../utils/setupUser';

const ChatDemoPage: React.FC = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const demoScenarios = [
        {
            id: 'demo-text-match',
            title: 'Text Chat Demo',
            description: 'Starte einen Demo-Chat mit Textnachrichten',
            icon: <ChatIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            action: () => navigate('/chat/demo-match-1?startWith=text')
        },
        {
            id: 'demo-voice-match',
            title: 'Voice Chat Demo',
            description: 'Teste die Sprachnachrichten-Funktion',
            icon: <MicIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            action: () => navigate('/chat/demo-match-2?startWith=voice')
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 2,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Chat Demo
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    mb: 4,
                    textAlign: 'center',
                    color: 'text.secondary',
                    maxWidth: 600
                }}
            >
                Teste die Mock-Chat-Funktionalität von Whisper World. Die Demo simuliert
                echte Gespräche mit automatischen Antworten und Interaktionen.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 500 }}>
                {demoScenarios.map((scenario) => (
                    <Card
                        key={scenario.id}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            },
                        }}
                        onClick={scenario.action}
                    >
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Box sx={{ mb: 2 }}>
                                {scenario.icon}
                            </Box>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                {scenario.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                {scenario.description}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1,
                                    borderRadius: 25,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                                    },
                                }}
                            >
                                Demo starten
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Aktuelle Demo-Features:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {[
                        '🤖 Automatische Antworten',
                        '⏱️ Tipp-Indikator',
                        '🎤 Mock-Sprachnachrichten',
                        '💬 Intelligente Gesprächsführung',
                        '🎯 Quick-Antworten',
                        '📱 Push-Benachrichtigungen'
                    ].map((feature, index) => (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                px: 2,
                                py: 0.5,
                                borderRadius: 15,
                                fontSize: '0.875rem',
                                border: '1px solid rgba(0,0,0,0.1)',
                            }}
                        >
                            {feature}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{ mt: 4, borderRadius: 25, px: 4 }}
            >
                Zurück zum Dashboard
            </Button>
        </Box>
    );
};

export default ChatDemoPage;
