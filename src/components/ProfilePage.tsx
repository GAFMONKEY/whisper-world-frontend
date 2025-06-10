import React, { useState } from 'react';
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
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
    id: string;
    name: string;
    age: number;
    categories: {
        name: string;
        color: string;
        questions: {
            question: string;
            answer?: string;
            hasAudio?: boolean;
        }[];
    }[];
    lifestyle: {
        relationship: string;
        children: string[];
        lifestyle: string[];
        politics: string;
    };
}

// Mock Data für verschiedene Profile
const mockProfiles: ProfileData[] = [
    {
        id: 'max-26',
        name: 'Max',
        age: 26,
        categories: [
            {
                name: 'Musik',
                color: '#BFA9BE', // Lila
                questions: [
                    {
                        question: 'Wenn dein Leben einen Soundtrack hätte – wie würde er klingen?',
                        hasAudio: true
                    }
                ]
            },
            {
                name: 'Achtsamkeit',
                color: '#DAA373', // Helles Orange
                questions: [
                    {
                        question: 'Gibt es ein Ziel, das du dir gerade gesetzt hast?',
                        answer: 'Ich versuche gerade, weniger zu müssen und mehr zu wollen.'
                    }
                ]
            },
            {
                name: 'Ziele & Visionen',
                color: '#BB7D67', // Dunkles Orange
                questions: [
                    {
                        question: 'Gibt es kleine Rituale, die dir helfen, im Moment zu sein?',
                        hasAudio: true
                    }
                ]
            }
        ],
        lifestyle: {
            relationship: 'Eine feste Beziehung',
            children: ['Ich wünsche mir Kinder', 'Ich habe keine Kinder'],
            lifestyle: ['Alkohol gelegentlich', 'Rauchen nie', 'Cannabis nie'],
            politics: 'Nicht politisch / neutral'
        }
    },
    {
        id: 'emma-24',
        name: 'Emma',
        age: 24,
        categories: [
            {
                name: 'Reisen',
                color: '#BFA9BE', // Lila
                questions: [
                    {
                        question: 'Was war das schönste Erlebnis auf deiner letzten Reise?',
                        answer: 'Der Sonnenaufgang über den Bergen in Nepal – ich war sprachlos vor Schönheit.'
                    }
                ]
            },
            {
                name: 'Kreativität',
                color: '#DAA373', // Helles Orange
                questions: [
                    {
                        question: 'Wann fühlst du dich am kreativsten?',
                        hasAudio: true
                    }
                ]
            }
        ],
        lifestyle: {
            relationship: 'Etwas Lockeres',
            children: ['Ich bin offen für Kinder'],
            lifestyle: ['Alkohol regelmäßig', 'Rauchen nie', 'Cannabis gelegentlich'],
            politics: 'Progressiv / links'
        }
    },
    {
        id: 'lukas-29',
        name: 'Lukas',
        age: 29,
        categories: [
            {
                name: 'Sport & Fitness',
                color: '#BB7D67', // Dunkles Orange
                questions: [
                    {
                        question: 'Welcher Sport bringt dich richtig in Fahrt?',
                        hasAudio: true
                    }
                ]
            },
            {
                name: 'Kochen',
                color: '#DAA373', // Helles Orange
                questions: [
                    {
                        question: 'Was ist dein Lieblingsgericht zum Kochen?',
                        answer: 'Ich liebe es, traditionelle italienische Pasta von Grund auf zu machen – der Duft von frischen Kräutern erfüllt die ganze Küche.'
                    }
                ]
            }
        ],
        lifestyle: {
            relationship: 'Eine feste Beziehung',
            children: ['Ich wünsche mir Kinder'],
            lifestyle: ['Alkohol nie', 'Rauchen nie', 'Cannabis nie'],
            politics: 'Konservativ / rechts'
        }
    }
];

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(1); // Hearts tab aktiv
    const [profileIndex, setProfileIndex] = useState(0);
    const [hasMatched, setHasMatched] = useState(false);
    const [matchedProfiles, setMatchedProfiles] = useState<string[]>([]);
    const [playingAudio, setPlayingAudio] = useState<{ categoryIndex: number, questionIndex: number } | null>(null);
    const [showMatchMessage, setShowMatchMessage] = useState(false);

    const currentProfile = mockProfiles[profileIndex];
    const totalProfiles = mockProfiles.length;

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
                navigate('/chat/max-26');
                break;
            case 3:
                navigate('/settings');
                break;
        }
    };

    const handleSkip = () => {
        console.log('Profil übersprungen');
        // Nächstes Profil laden oder zurück zum Dashboard
        if (profileIndex < totalProfiles - 1) {
            setProfileIndex(profileIndex + 1);
            setHasMatched(false);
        } else {
            // Alle Profile durchgeschaut, zurück zum Dashboard
            navigate('/dashboard');
        }
    };

    const handleRequestMatch = () => {
        console.log('Match angefragt');
        setHasMatched(true);
        setMatchedProfiles([...matchedProfiles, currentProfile.id]);
        setShowMatchMessage(true);

        // Verstecke die Match-Nachricht nach 2 Sekunden
        setTimeout(() => {
            setShowMatchMessage(false);
        }, 2000);

        // TODO: API Call zum Match anfragen
    };

    const handleStartConversation = () => {
        console.log('Gespräch beginnen mit', currentProfile.name);
        navigate(`/chat/${currentProfile.id}`);
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
                    {currentProfile.name}, {currentProfile.age}
                </Typography>

                {/* Match Success Message */}
                {showMatchMessage && (
                    <Box
                        sx={{
                            backgroundColor: '#4CAF50',
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
                            🎉 Match angefragt! Warte auf Antwort von {currentProfile.name}
                        </Typography>
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
                {currentProfile.categories.map((category, categoryIndex) => (
                    <Box key={categoryIndex} sx={{ mb: 3 }}>
                        {/* Category Tag */}
                        <Chip
                            label={category.name}
                            sx={{
                                backgroundColor: category.color,
                                color: 'white',
                                fontWeight: 600,
                                mb: 2,
                                fontSize: '0.9rem',
                            }}
                        />

                        {/* Questions */}
                        {category.questions.map((q, questionIndex) => (
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
                                            mb: q.answer || q.hasAudio ? 2 : 0,
                                        }}
                                    >
                                        {q.question}
                                    </Typography>

                                    {q.answer && (
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                fontStyle: 'italic',
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: `2px solid ${category.color}`,
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
                ))}

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
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Was ich suche:
                            </Typography>
                            <Chip
                                label={currentProfile.lifestyle.relationship}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    borderRadius: 4,
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Kinderwunsch:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {currentProfile.lifestyle.children.map((child, index) => (
                                    <Chip
                                        key={index}
                                        label={child}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            color: 'white',
                                            borderRadius: 4,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Mein Lifestyle:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {currentProfile.lifestyle.lifestyle.map((style, index) => (
                                    <Chip
                                        key={index}
                                        label={style}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            color: 'white',
                                            borderRadius: 4,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Politische Haltung:
                            </Typography>
                            <Chip
                                label={currentProfile.lifestyle.politics}
                                size="small"
                                sx={{
                                    backgroundColor: 'secondary.main',
                                    color: 'white',
                                    borderRadius: 4,
                                }}
                            />
                        </Box>
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
                        {mockProfiles.map((_, index) => (
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
                        onClick={hasMatched ? handleStartConversation : handleRequestMatch}
                        sx={{
                            flex: 1,
                            backgroundColor: hasMatched ? '#4CAF50' : 'secondary.main', // Grün für "Gespräch beginnen"
                            color: 'white',
                            borderRadius: 25,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: hasMatched ? '#45a049' : 'secondary.dark',
                                transform: 'scale(1.02)',
                            },
                        }}
                    >
                        {hasMatched ? '💬 Gespräch beginnen' : '❤️ Match anfragen'}
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
