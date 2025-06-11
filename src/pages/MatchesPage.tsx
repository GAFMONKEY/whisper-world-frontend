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
    IconButton,
    Chip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/matchService';
import type { DiscoverUser } from '../services/matchService';
import { getCurrentUser } from '../utils/setupUser';

const MatchesPage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(1); // Discovery tab aktiv
    const [users, setUsers] = useState<DiscoverUser[]>(() => {
        // Lade gespeicherte Users aus sessionStorage
        const saved = sessionStorage.getItem('discoveryUsers');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentUserIndex, setCurrentUserIndex] = useState(() => {
        // Lade gespeicherten Index aus sessionStorage
        const saved = sessionStorage.getItem('discoveryIndex');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = getCurrentUser();
    const currentUser = users[currentUserIndex];

    // Speichere Users in sessionStorage bei Änderungen
    useEffect(() => {
        if (users.length > 0) {
            sessionStorage.setItem('discoveryUsers', JSON.stringify(users));
        }
    }, [users]);

    // Speichere Index in sessionStorage bei Änderungen
    useEffect(() => {
        sessionStorage.setItem('discoveryIndex', currentUserIndex.toString());
    }, [currentUserIndex]);

    // User zum Discovern laden (nur einmal beim Mount)
    useEffect(() => {
        const loadUsers = async () => {
            if (!user.id) {
                navigate('/login');
                return;
            }

            // Prüfe zuerst sessionStorage
            const savedUsers = sessionStorage.getItem('discoveryUsers');
            const savedIndex = sessionStorage.getItem('discoveryIndex'); if (savedUsers && savedIndex) {
                const parsedUsers = JSON.parse(savedUsers);
                const parsedIndex = parseInt(savedIndex, 10);

                // Nur setzen wenn noch nicht gesetzt
                if (users.length === 0) {
                    setUsers(parsedUsers);
                    setCurrentUserIndex(parsedIndex);
                }
                setLoading(false);
                return;
            }

            // Nur laden wenn wirklich keine Users vorhanden sind
            if (users.length > 0) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const discoverUsers = await matchService.discoverUsers(user.id);
                setUsers(discoverUsers);
                setCurrentUserIndex(0);
            } catch (error) {
                console.error('Error loading users:', error);
                setError('Fehler beim Laden der Profile. Bitte versuche es später nochmal.');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [user.id, navigate]); // ESLint: users.length intentionally excluded to prevent loops

    const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
        setNavValue(newValue);
        switch (newValue) {
            case 0:
                navigate('/dashboard');
                break;
            case 1:
                // Already on discovery page
                break;
            case 2:
                navigate('/chats');
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleLike = async () => {
        if (!currentUser) return;

        try {
            const response = await matchService.likeUser(user.id, currentUser.id);
            if (response.matched) {
                // Navigation zu Match Success Page
                navigate('/match-success', {
                    state: {
                        matchedUser: currentUser,
                        matchId: response.matchId
                    }
                });
            } else {
                // Nächster User
                setCurrentUserIndex(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error liking user:', error);
        }
    };

    const handlePass = async () => {
        if (!currentUser) return;

        try {
            await matchService.passUser(user.id, currentUser.id);
            setCurrentUserIndex(prev => prev + 1);
        } catch (error) {
            console.error('Error passing user:', error);
            // Auch bei Fehler zum nächsten User
            setCurrentUserIndex(prev => prev + 1);
        }
    };

    // Reset Discovery Session
    const resetDiscoverySession = async () => {
        sessionStorage.removeItem('discoveryUsers');
        sessionStorage.removeItem('discoveryIndex');
        setUsers([]);
        setCurrentUserIndex(0);
        setLoading(true);

        // Neue Users laden
        try {
            const discoverUsers = await matchService.discoverUsers(user.id);
            setUsers(discoverUsers);
            setCurrentUserIndex(0);
        } catch (err) {
            setError('Fehler beim Laden neuer Profile.');
        } finally {
            setLoading(false);
        }
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
                    Profile werden geladen...
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

    // No more users
    if (!currentUser || currentUserIndex >= users.length) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    pb: 8,
                    p: 3,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                    🎉 Alle Profile entdeckt!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Du hast alle verfügbaren Profile gesehen. Schaue später wieder vorbei für neue Profile!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/chats')}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            borderRadius: 25,
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        Zu deinen Chats
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={resetDiscoverySession}
                        sx={{
                            borderColor: 'secondary.main',
                            color: 'secondary.main',
                            borderRadius: 25,
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        Neue Profile laden
                    </Button>
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
                    <BottomNavigationAction icon={<HomeIcon />} sx={{ minWidth: 'auto' }} />
                    <BottomNavigationAction icon={<FavoriteIcon />} sx={{ minWidth: 'auto' }} />
                    <BottomNavigationAction icon={<ChatIcon />} sx={{ minWidth: 'auto' }} />
                    <BottomNavigationAction icon={<SettingsIcon />} sx={{ minWidth: 'auto' }} />
                </BottomNavigation>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                pb: 8,
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
                    Profile entdecken
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 3,
                    }}
                >
                    {users.length - currentUserIndex} Profile übrig
                </Typography>
            </Box>

            {/* User Card */}
            <Box sx={{ px: 3, pb: 3 }}>
                <Card
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '2px solid',
                        borderColor: 'secondary.main',
                    }}
                >
                    {/* User Info */}
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: currentUser.accentColor || 'secondary.main',
                                    color: 'white',
                                    fontSize: '2rem',
                                    fontWeight: 600,
                                }}
                            >
                                {currentUser.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                    {currentUser.name}, {currentUser.age}
                                </Typography>

                                {/* Interests */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {currentUser.categories[0]?.questions[0]?.answer?.split(', ').slice(0, 3).map((interest, index) => (
                                        <Chip
                                            key={index}
                                            label={interest}
                                            size="small"
                                            sx={{
                                                backgroundColor: currentUser.accentColor || 'secondary.main',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                    )) || []}
                                </Box>
                            </Box>
                        </Box>

                        {/* Categories */}
                        {currentUser.categories.slice(0, 2).map((category, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: category.color || 'text.primary',
                                        fontWeight: 600,
                                        mb: 1,
                                    }}
                                >
                                    {category.name}
                                </Typography>
                                {category.questions.slice(0, 2).map((qa, qaIndex) => (
                                    <Box key={qaIndex} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                            {qa.question}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {qa.answer}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        mt: 4,
                    }}
                >
                    <IconButton
                        onClick={handlePass}
                        sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'rgba(255,0,0,0.1)',
                            border: '2px solid #ff4444',
                            '&:hover': {
                                backgroundColor: 'rgba(255,0,0,0.2)',
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 30, color: '#ff4444' }} />
                    </IconButton>

                    <IconButton
                        onClick={handleLike}
                        sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'rgba(76, 218, 196, 0.1)',
                            border: '2px solid',
                            borderColor: 'secondary.main',
                            '&:hover': {
                                backgroundColor: 'rgba(76, 218, 196, 0.2)',
                            },
                        }}
                    >
                        <FavoriteBorderIcon sx={{ fontSize: 30, color: 'secondary.main' }} />
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
                <BottomNavigationAction icon={<HomeIcon />} sx={{ minWidth: 'auto' }} />
                <BottomNavigationAction icon={<FavoriteIcon />} sx={{ minWidth: 'auto' }} />
                <BottomNavigationAction icon={<ChatIcon />} sx={{ minWidth: 'auto' }} />
                <BottomNavigationAction icon={<SettingsIcon />} sx={{ minWidth: 'auto' }} />
            </BottomNavigation>
        </Box>
    );
};

export default MatchesPage;
