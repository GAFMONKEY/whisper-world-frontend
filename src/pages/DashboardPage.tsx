import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    BottomNavigation,
    BottomNavigationAction,
    Stack,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    birthDate: string;
    interests: string[];
    datingPreferences: string[];
    likert: {
        openness: number;
        closeness: number;
        quietness: number;
    };
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [navValue, setNavValue] = useState(0);

    useEffect(() => {
        // Lade Benutzerdaten aus localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            // Fallback: Zurück zum Login wenn keine Daten vorhanden
            navigate('/login');
        }
    }, [navigate]);

    const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
        setNavValue(newValue);
        switch (newValue) {
            case 0:
                // Already on dashboard
                break;
            case 1:
                navigate('/profile');
                break;
            case 2:
                navigate('/matches');
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>Lade...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#F2EEE9',
                pb: 8, // Platz für Bottom Navigation
                background: '#F2EEE9',
            }}
        >
            {/* Header */}
            <Box sx={{ 
                p: 3, 
                pt: 4,
                backgroundColor: 'transparent',
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 1,
                    }}
                >
                    Hallo {user.firstName}!
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        mb: 3,
                    }}
                >
                    Schön, dass du da bist.
                </Typography>

                {/* Impuls des Tages Card */}
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                        borderRadius: 4,
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        mb: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                }}
                            >
                                Impuls des Tages:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                }}
                            >
                                Info
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                                border: '2px solid',
                                borderColor: 'secondary.main',
                                borderRadius: 3,
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 500,
                                }}
                            >
                                Was hat dich heute zum lächeln gebracht?
                            </Typography>
                        </Box>

                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    background: 'linear-gradient(135deg, #BFA9BE 0%, #A693A1 100%)',
                                    color: 'white',
                                    borderRadius: 25,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(191, 169, 190, 0.3)',
                                    border: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #A693A1 0%, #96818A 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px rgba(191, 169, 190, 0.4)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                Sprachnachricht aufnehmen
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    background: 'linear-gradient(135deg, #BFA9BE 0%, #A693A1 100%)',
                                    color: 'white',
                                    borderRadius: 25,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(191, 169, 190, 0.3)',
                                    border: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #A693A1 0%, #96818A 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px rgba(191, 169, 190, 0.4)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                Text eingeben
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Premium Card */}
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                        borderRadius: 4,
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        mb: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <LockIcon sx={{ mr: 1, color: 'text.primary' }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                }}
                            >
                                Noch mehr Impulse, noch tiefere Gespräche
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                mb: 3,
                            }}
                        >
                            Mit Premium bekommst du täglich 3 Gesprächsimpulse zur Auswahl.
                        </Typography>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                background: 'linear-gradient(135deg, #D4A574 0%, #C69C6D 100%)',
                                color: 'white',
                                borderRadius: 25,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)',
                                border: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #C69C6D 0%, #B8926B 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 6px 20px rgba(212, 165, 116, 0.4)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            Mehr zu Premium erfahren
                        </Button>
                    </CardContent>
                </Card>
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

export default DashboardPage;
