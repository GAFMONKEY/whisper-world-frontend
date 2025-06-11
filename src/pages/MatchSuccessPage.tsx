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
        // Navigiere zum Chat mit Voice-Message Intent
        navigate(`/chat/${matchId}?startWith=voice`);
    };

    const handleTextMessage = () => {
        // Navigiere zum Chat mit Text-Message Intent
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
                        left: 20
                    }}
                >
                    <Typography
                        variant="body2"
                        onClick={handleBack}
                        sx={{
                            color: '#D4A574',
                            cursor: 'pointer',
                            textDecoration: 'underline'
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
                        fontFamily: 'Inter, sans-serif'
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
                        fontWeight: 500
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
                        height: 120
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
                            top: 10
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
                            top: 10
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
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
                        lineHeight: 1.6
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
                        gap: 2
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
                            '&:hover': {
                                backgroundColor: '#C19660'
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
                            '&:hover': {
                                backgroundColor: '#A67F5B'
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
