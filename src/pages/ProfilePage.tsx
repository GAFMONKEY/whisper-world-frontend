import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    BottomNavigation,
    BottomNavigationAction,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/matchService';
import type { DiscoverUser } from '../services/matchService';
import { getCurrentUser } from '../utils/setupUser';

// ProfileData interface wird jetzt von DiscoverUser aus matchingService verwendet

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(1); // Hearts tab aktiv
    const [profileIndex, setProfileIndex] = useState(0);
    const [profiles, setProfiles] = useState<DiscoverUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<{ categoryIndex: number, questionIndex: number } | null>(null);
    const [showMatchMessage, setShowMatchMessage] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [isActualMatch, setIsActualMatch] = useState(false);

    const currentProfile = profiles[profileIndex];
    const totalProfiles = profiles.length;

    // User laden aus localStorage - mit Backend-kompatible UUID
    const user = getCurrentUser();

    // Profile vom Backend laden
    useEffect(() => {
        const loadProfiles = async () => {
            if (!user.id) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const discoveredUsers = await matchService.discoverUsers(user.id);
                setProfiles(discoveredUsers);

                if (discoveredUsers.length === 0) {
                    setError('Keine neuen Profile verfügbar. Schaue später nochmal vorbei!');
                }
            } catch (err) {
                console.error('Error loading profiles:', err);
                setError('Fehler beim Laden der Profile. Bitte versuche es später nochmal.');
            } finally {
                setLoading(false);
            }
        };

        loadProfiles();
    }, [user.id, navigate]);

    const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
        setNavValue(newValue);
        switch (newValue) {
            case 0:
                navigate('/dashboard');
                break;
            case 1:
                // Already on profile page
                break;
            case 2:
                navigate('/matches');
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleSkip = async () => {
        if (!currentProfile) return;

        try {
            // Pass API call zum Backend
            await matchService.passUser(user.id, currentProfile.id);
            console.log('Profil übersprungen:', currentProfile.name);

            // Nächstes Profil laden oder zurück zum Dashboard
            if (profileIndex < totalProfiles - 1) {
                setProfileIndex(profileIndex + 1);
                // Reset match states für neues Profil
                setShowMatchMessage(false);
                setIsActualMatch(false);
            } else {
                // Alle Profile durchgeschaut, zurück zum Dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error passing user:', error);
            // Bei Fehler trotzdem weiter zum nächsten Profil
            if (profileIndex < totalProfiles - 1) {
                setProfileIndex(profileIndex + 1);
                setShowMatchMessage(false);
                setIsActualMatch(false);
            } else {
                navigate('/dashboard');
            }
        }
    };

    const handleRequestMatch = async () => {
        if (!currentProfile || isMatching) return;

        try {
            setIsMatching(true);
            console.log('Match angefragt für:', currentProfile.name);

            // Like API call zum Backend
            const response = await matchService.likeUser(user.id, currentProfile.id);

            // Debug-Logs hinzugefügt
            console.log('🔍 Like response:', response);
            console.log('📊 Current profile index:', profileIndex, 'Total profiles:', totalProfiles);
            console.log('👤 Current profile:', currentProfile.name);

            if (response.matched) {
                // Es ist ein Match! 🎉
                console.log('🎉 IT\'S A MATCH! Redirecting to match success page...');
                setIsActualMatch(true);
                setShowMatchMessage(true);

                // Nach 3 Sekunden zur Match Success Page weiterleiten
                setTimeout(() => {
                    setShowMatchMessage(false);
                    console.log('Navigating to match success page with matchId:', response.matchId);
                    navigate(`/match-success?matchId=${response.matchId || currentProfile.id}&partnerName=${encodeURIComponent(currentProfile.name)}`);
                }, 3000);
            } else {
                // Like gesendet, warten auf Gegenseitigkeit
                console.log('💌 Like sent, no match yet. Moving to next profile...');
                setIsActualMatch(false);
                setShowMatchMessage(true);

                // Verstecke die Match-Nachricht nach 2 Sekunden
                setTimeout(() => {
                    setShowMatchMessage(false);
                    // Weiter zum nächsten Profil oder Dashboard wenn keine mehr da sind
                    if (profileIndex < totalProfiles - 1) {
                        console.log('Moving to next profile...');
                        setProfileIndex(profileIndex + 1);
                        setIsActualMatch(false);
                    } else {
                        // Alle Profile durch - zurück zum Dashboard
                        console.log('⚠️ No more profiles, returning to dashboard');
                        navigate('/dashboard');
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('❌ Error liking user:', error);
            setError('Fehler beim Senden des Likes. Versuche es nochmal.');
        } finally {
            setIsMatching(false);
        }
    };

    const handlePlayAudio = (categoryIndex: number, questionIndex: number) => {
        console.log(`Audio abspielen: Kategorie ${categoryIndex}, Frage ${questionIndex}`);
        setPlayingAudio({ categoryIndex, questionIndex });

        // Simuliere Audio-Wiedergabe (3 Sekunden)
        setTimeout(() => {
            setPlayingAudio(null);
        }, 3000);

        // TODO: Echte Audio-Wiedergabe implementieren
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
                <Alert
                    severity="info"
                    sx={{
                        maxWidth: 400,
                        '& .MuiAlert-message': {
                            textAlign: 'center',
                        }
                    }}
                >
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                            },
                        }}
                    >
                        Zurück zum Dashboard
                    </Button>
                </Alert>
            </Box>
        );
    }

    // No current profile available
    if (!currentProfile) {
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
                <Alert severity="info">
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Keine Profile mehr verfügbar!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                        }}
                    >
                        Zurück zum Dashboard
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
            <Box sx={{ p: 3, pt: 4, textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 2,
                    }}
                >
                    {currentProfile?.name || 'Unbekannt'}, {currentProfile?.age || 0}
                </Typography>

                {/* Match Success Message */}
                {showMatchMessage && (
                    <Box
                        sx={{
                            backgroundColor: isActualMatch ? '#4CAF50' : '#2196F3',
                            color: 'white',
                            borderRadius: 3,
                            p: 2,
                            mb: 2,
                            animation: 'fadeIn 0.5s ease-in-out',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(-10px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {isActualMatch ? (
                                `🎉 IT'S A MATCH! Du und ${currentProfile?.name || 'dieser Nutzer'} mögt euch!`
                            ) : (
                                `💌 Like gesendet! Warte auf Antwort von ${currentProfile?.name || 'diesem Nutzer'}`
                            )}
                        </Typography>
                        {isActualMatch && (
                            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                Ihr werdet automatisch zum Chat weitergeleitet...
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>

            {/* Scrollable Content */}
            <Box sx={{
                px: 3,
                pb: 3,
                transition: 'all 0.3s ease-in-out',
                opacity: playingAudio ? 0.9 : 1,
                transform: showMatchMessage ? 'scale(0.98)' : 'scale(1)',
            }}>
                {/* Categories mit Fragen */}
                {currentProfile && currentProfile.categories && Array.isArray(currentProfile.categories) && currentProfile.categories.length > 0 ? (
                    currentProfile.categories.map((category, categoryIndex) => (
                        <Box key={categoryIndex} sx={{ mb: 3 }}>
                            {/* Category Tag */}
                            <Chip
                                label={category?.name || 'Unbekannt'}
                                sx={{
                                    backgroundColor: category?.color || '#BFA9BE',
                                    color: 'white',
                                    fontWeight: 600,
                                    mb: 2,
                                    fontSize: '0.9rem',
                                }}
                            />

                            {/* Questions */}
                            {category?.questions && Array.isArray(category.questions) && category.questions.map((q, questionIndex) => (
                                <Card
                                    key={questionIndex}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 3,
                                        border: '2px solid',
                                        borderColor: category.color,
                                        mb: 2,
                                        transition: 'all 0.3s ease-in-out',
                                        cursor: q.hasAudio ? 'pointer' : 'default',
                                        '&:hover': {
                                            transform: q.hasAudio ? 'translateY(-2px)' : 'none',
                                            boxShadow: q.hasAudio ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
                                        },
                                    }}
                                    onClick={q.hasAudio ? () => handlePlayAudio(categoryIndex, questionIndex) : undefined}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 500,
                                                mb: (q?.answer && typeof q.answer === 'string') || q?.hasAudio ? 2 : 0,
                                            }}
                                        >
                                            {q?.question || 'Frage ohne Text'}
                                        </Typography>

                                        {q?.answer && typeof q.answer === 'string' && (
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'text.primary',
                                                    fontStyle: 'italic',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                    border: `2px solid ${category?.color || '#BFA9BE'}`,
                                                    borderRadius: 2,
                                                    p: 2,
                                                }}
                                            >
                                                {q.answer}
                                            </Typography>
                                        )}

                                        {q.hasAudio && (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                                <IconButton
                                                    onClick={() => handlePlayAudio(categoryIndex, questionIndex)}
                                                    sx={{
                                                        backgroundColor: category.color,
                                                        color: 'white',
                                                        width: 60,
                                                        height: 60,
                                                        animation: playingAudio?.categoryIndex === categoryIndex &&
                                                            playingAudio?.questionIndex === questionIndex
                                                            ? 'pulse 1.5s infinite' : 'none',
                                                        '@keyframes pulse': {
                                                            '0%': { transform: 'scale(1)' },
                                                            '50%': { transform: 'scale(1.1)' },
                                                            '100%': { transform: 'scale(1)' },
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: category.color,
                                                            opacity: 0.8,
                                                            transform: 'scale(1.05)',
                                                        },
                                                        transition: 'all 0.2s ease-in-out',
                                                    }}
                                                >
                                                    {playingAudio?.categoryIndex === categoryIndex &&
                                                        playingAudio?.questionIndex === questionIndex ? (
                                                        <PauseIcon sx={{ fontSize: 30 }} />
                                                    ) : (
                                                        <PlayArrowIcon sx={{ fontSize: 30 }} />
                                                    )}
                                                </IconButton>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ))
                ) : (
                    <Card
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: 'secondary.main',
                            mb: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                                🎭 Profil wird geladen...
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {currentProfile?.name || 'Dieser Nutzer'} hat noch keine Inhalte hinzugefügt.
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {/* Lifestyle Section */}
                <Card
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        mb: 3,
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        {currentProfile && currentProfile.lifestyle ? (
                            <>
                                {/* Dating & Lifestyle Info */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                                        💫 Lifestyle & Dating
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                                        {currentProfile.lifestyle.childrenWish && currentProfile.lifestyle.childrenWish !== 'not specified' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                                    👶 Kinderwunsch
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {currentProfile.lifestyle.childrenWish === 'yes' ? 'Ja' :
                                                        currentProfile.lifestyle.childrenWish === 'no' ? 'Nein' :
                                                            currentProfile.lifestyle.childrenWish === 'maybe' ? 'Vielleicht' :
                                                                currentProfile.lifestyle.childrenWish}
                                                </Typography>
                                            </Box>
                                        )}

                                        {currentProfile.lifestyle.children && currentProfile.lifestyle.children !== 'not specified' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                                    👶 Hat Kinder
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {currentProfile.lifestyle.children === 'yes' ? 'Ja' :
                                                        currentProfile.lifestyle.children === 'no' ? 'Nein' :
                                                            currentProfile.lifestyle.children}
                                                </Typography>
                                            </Box>
                                        )}

                                        {currentProfile.lifestyle.politics && currentProfile.lifestyle.politics !== 'not specified' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                                    🗳️ Politik
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {currentProfile.lifestyle.politics === 'left' ? 'Links' :
                                                        currentProfile.lifestyle.politics === 'right' ? 'Rechts' :
                                                            currentProfile.lifestyle.politics === 'center' ? 'Mitte' :
                                                                currentProfile.lifestyle.politics === 'not political' ? 'Unpolitisch' :
                                                                    currentProfile.lifestyle.politics}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                {/* Substances & Health */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                                        🏃‍♀️ Gesundheit & Substanzen
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        {currentProfile.lifestyle.alcohol && currentProfile.lifestyle.alcohol !== 'not specified' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                                    🍷 Alkohol
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {currentProfile.lifestyle.alcohol === 'yes' ? 'Ja' :
                                                        currentProfile.lifestyle.alcohol === 'no' ? 'Nein' :
                                                            currentProfile.lifestyle.alcohol === 'sometimes' ? 'Manchmal' :
                                                                currentProfile.lifestyle.alcohol}
                                                </Typography>
                                            </Box>
                                        )}

                                        {currentProfile.lifestyle.smoking && currentProfile.lifestyle.smoking !== 'not specified' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                                    🚬 Rauchen
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {currentProfile.lifestyle.smoking === 'yes' ? 'Ja' :
                                                        currentProfile.lifestyle.smoking === 'no' ? 'Nein' :
                                                            currentProfile.lifestyle.smoking === 'sometimes' ? 'Manchmal' :
                                                                currentProfile.lifestyle.smoking}
                                                </Typography>
                                            </Box>
                                        )}

                                        {currentProfile.lifestyle.cannabis && currentProfile.lifestyle.cannabis !== 'not specified' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                                    🌿 Cannabis
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {currentProfile.lifestyle.cannabis === 'yes' ? 'Ja' :
                                                        currentProfile.lifestyle.cannabis === 'no' ? 'Nein' :
                                                            currentProfile.lifestyle.cannabis === 'sometimes' ? 'Manchmal' :
                                                                currentProfile.lifestyle.cannabis}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Lifestyle-Informationen werden geladen...
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Progress Indicator */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Profil {profileIndex + 1} von {totalProfiles} für heute
                    </Typography>

                    {profileIndex === totalProfiles - 1 && (
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 2,
                                color: 'secondary.main',
                                fontWeight: 600,
                            }}
                        >
                            🔥 Letztes kostenloses Profil! Mehr mit Premium
                        </Typography>
                    )}

                    {profileIndex < totalProfiles - 1 && (
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Du möchtest mehr entdecken?
                        </Typography>
                    )}

                    {/* Progress Dots */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                        {profiles.map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: index === profileIndex
                                        ? 'secondary.main'
                                        : index < profileIndex
                                            ? 'rgba(191, 169, 190, 0.6)' // Viewed profiles
                                            : 'rgba(0,0,0,0.2)', // Unviewed profiles
                                    transition: 'all 0.3s ease-in-out',
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleSkip}
                        sx={{
                            flex: 1,
                            backgroundColor: '#F5F5DC', // Beige
                            color: 'text.primary',
                            borderRadius: 25,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#F0F0DC',
                            },
                        }}
                    >
                        {profileIndex === totalProfiles - 1 ? 'Zurück zum Dashboard' : 'Überspringen'}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleRequestMatch}
                        disabled={isMatching}
                        sx={{
                            flex: 1,
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            borderRadius: 25,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                                transform: 'scale(1.02)',
                            },
                            '&:disabled': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                            },
                        }}
                    >
                        {isMatching ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                Sende Like...
                            </Box>
                        ) : (
                            '❤️ Match anfragen'
                        )}
                    </Button>
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

export default ProfilePage;
