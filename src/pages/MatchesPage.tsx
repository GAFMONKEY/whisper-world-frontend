import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/matchService';
import type { DisplayMatch } from '../services/matchService';

const MatchesPage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(2); // Chat tab aktiv
    const [matches, setMatches] = useState<DisplayMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User laden aus localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Matches vom Backend laden
    useEffect(() => {
        const loadMatches = async () => {
            if (!user.id) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const userMatches = await matchService.getMatches(user.id);
                setMatches(userMatches);
            } catch (err) {
                console.error('Error loading matches:', err);
                setError('Fehler beim Laden der Matches. Bitte versuche es später nochmal.');
            } finally {
                setLoading(false);
            }
        };

        loadMatches();
    }, [user.id, navigate]);

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
                // Already on matches/chat page
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleChatClick = (matchUserId: string) => {
        navigate(`/chat/${matchUserId}`);
    };

    const formatLastMessage = (match: DisplayMatch) => {
        if (!match.lastMessage) {
            return 'Schreibt die erste Nachricht! 💬';
        }

        const timeAgo = new Date().getTime() - new Date(match.lastMessage.timestamp).getTime();
        const hoursAgo = Math.floor(timeAgo / (1000 * 60 * 60));
        const daysAgo = Math.floor(hoursAgo / 24);

        let timeString = '';
        if (daysAgo > 0) {
            timeString = `vor ${daysAgo} Tag${daysAgo > 1 ? 'en' : ''}`;
        } else if (hoursAgo > 0) {
            timeString = `vor ${hoursAgo} Stunde${hoursAgo > 1 ? 'n' : ''}`;
        } else {
            timeString = 'gerade eben';
        }

        return `${match.lastMessage.content} • ${timeString}`;
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
                    Matches werden geladen...
                </Typography>
            </Box>
        );
    }

    // Error State
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
                <Alert severity="error">
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                        }}
                    >
                        Nochmal versuchen
                    </Button>
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                pb: 8, // Platz für Bottom Navigation
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, pt: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 1,
                    }}
                >
                    Deine Matches
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 3,
                    }}
                >
                    {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
                </Typography>
            </Box>

            {/* Matches List */}
            <Box sx={{ px: 3, pb: 3 }}>
                {matches.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                            Noch keine Matches 💔
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                            Gehe zurück zu den Profilen und finde dein erstes Match!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/profile')}
                            sx={{
                                backgroundColor: 'secondary.main',
                                color: 'white',
                                borderRadius: 25,
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: 'secondary.dark',
                                },
                            }}
                        >
                            Profile entdecken
                        </Button>
                    </Box>
                ) : (
                    matches.map((match) => (
                        <Card
                            key={match.id}
                            onClick={() => handleChatClick(match.user.id)}
                            sx={{
                                mb: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: 'secondary.main',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            backgroundColor: 'secondary.main',
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {match.user.name.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                mb: 0.5,
                                            }}
                                        >
                                            {match.user.name}, {match.user.age}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {formatLastMessage(match)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: match.lastMessage ? 'rgba(0,0,0,0.3)' : 'secondary.main',
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
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

export default MatchesPage;
