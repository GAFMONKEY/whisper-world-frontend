import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MatchSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const matchId = searchParams.get('matchId');
    const partnerName = searchParams.get('partnerName') || 'deinem Match';

    const handleVoiceMessage = () => {
        navigate(`/chat/${matchId}?startWith=voice`);
    };

    const handleTextMessage = () => {
        navigate(`/chat/${matchId}?startWith=text`);
    };

    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: 'background.default',
                    px: 3
                }}
            >
                {/* Back Link */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 60,
                        left: 20,
                        animation: 'fadeIn 0.6s ease-out 0.2s both',
                        '@keyframes fadeIn': {
                            '0%': {
                                opacity: 0
                            },
                            '100%': {
                                opacity: 1
                            }
                        }
                    }}
                >
                    <Typography
                        variant="body2"
                        onClick={handleBack}
                        sx={{
                            color: '#D4A574',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: '#C19660',
                                transform: 'translateX(-2px)'
                            }
                        }}
                    >
                        ← Zurück
                    </Typography>
                </Box>

                {/* Main Title */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 4,
                        fontFamily: 'Inter, sans-serif',
                        animation: 'fadeInDown 0.8s ease-out',
                        '@keyframes fadeInDown': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(-20px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    Ihr mögt euch beide!
                </Typography>

                {/* Partner Name Display */}
                <Typography
                    variant="h5"
                    sx={{
                        color: 'text.secondary',
                        mb: 4,
                        fontWeight: 500,
                        animation: 'fadeIn 1s ease-out 0.3s both',
                        '@keyframes fadeIn': {
                            '0%': {
                                opacity: 0
                            },
                            '100%': {
                                opacity: 1
                            }
                        }
                    }}
                >
                    Du und {partnerName}
                </Typography>

                {/* Overlapping Circles with Heart */}
                <Box
                    sx={{
                        position: 'relative',
                        mb: 6,
                        width: 200,
                        height: 120,
                        animation: 'slideInUp 0.8s ease-out 0.5s both',
                        '@keyframes slideInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(30px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    {/* Left Circle */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            backgroundColor: '#D4A574', // Beige/Brown
                            left: 0,
                            top: 10,
                            animation: 'slideInLeft 1s ease-out 0.7s both',
                            '@keyframes slideInLeft': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateX(-50px) scale(0.8)'
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateX(0) scale(1)'
                                }
                            }
                        }}
                    />

                    {/* Right Circle */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            backgroundColor: '#C8A8D8', // Light Purple
                            right: 0,
                            top: 10,
                            // Right circle slides in from right
                            animation: 'slideInRight 1s ease-out 0.9s both',
                            '@keyframes slideInRight': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateX(50px) scale(0.8)'
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateX(0) scale(1)'
                                }
                            }
                        }}
                    />

                    {/* Heart Icon */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            width: 60,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            animation: 'heartAppear 1.2s ease-out 1.3s both, heartPulse 2s ease-in-out 2.5s infinite',
                            '@keyframes heartAppear': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translate(-50%, -50%) scale(0.3)',
                                },
                                '50%': {
                                    transform: 'translate(-50%, -50%) scale(1.3)',
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translate(-50%, -50%) scale(1)',
                                }
                            },
                            '@keyframes heartPulse': {
                                '0%, 100%': {
                                    transform: 'translate(-50%, -50%) scale(1)',
                                },
                                '50%': {
                                    transform: 'translate(-50%, -50%) scale(1.1)',
                                }
                            }
                        }}
                    >
                        <FavoriteIcon
                            sx={{
                                fontSize: 32,
                                color: '#E91E63' // Pink heart color
                            }}
                        />
                    </Box>
                </Box>

                {/* Description Text */}
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 6,
                        fontStyle: 'italic',
                        maxWidth: 300,
                        lineHeight: 1.6,
                        animation: 'fadeInUp 0.8s ease-out 1.5s both',
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    Schicke eine Text- oder Sprachnachricht um das Gespräch zu beginnen.
                </Typography>

                {/* Action Buttons */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        animation: 'slideInUp 0.8s ease-out 1.8s both',
                        '@keyframes slideInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(30px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleVoiceMessage}
                        sx={{
                            backgroundColor: '#D4A574',
                            color: 'white',
                            py: 2,
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            boxShadow: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#C19660',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(196, 150, 96, 0.3)'
                            }
                        }}
                    >
                        Sprachnachricht aufnehmen
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleTextMessage}
                        sx={{
                            backgroundColor: '#B8906B',
                            color: 'white',
                            py: 2,
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            boxShadow: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#A67F5B',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(166, 127, 91, 0.3)'
                            }
                        }}
                    >
                        Textnachricht eingeben
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default MatchSuccessPage;
