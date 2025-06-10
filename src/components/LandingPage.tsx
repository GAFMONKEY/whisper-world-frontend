import React from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const LandingPage: React.FC = () => {
    const handleLogin = () => {
        // TODO: Implement login logic
        console.log('Login clicked');
    };

    const handleRegister = () => {
        // TODO: Implement register logic
        console.log('Register clicked');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.default',
                margin: 0,
                padding: 0,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 3,
                    py: 4,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                {/* Willkommen Text */}
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        color: 'text.secondary',
                        fontWeight: 400,
                    }}
                >
                    Willkommen bei
                </Typography>

                {/* App Titel */}
                <Typography
                    variant="h1"
                    sx={{
                        textAlign: 'center',
                        mb: 1,
                        color: 'text.primary',
                        fontWeight: 'bold',
                    }}
                >
                    Whisper
                </Typography>

                <Typography
                    variant="h1"
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        color: 'text.primary',
                        fontWeight: 'bold',
                    }}
                >
                    World
                </Typography>

                {/* Mikrofon Icon */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 6,
                    }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            border: '3px solid',
                            borderColor: 'text.primary',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MicIcon
                            sx={{
                                fontSize: 60,
                                color: 'text.primary',
                            }}
                        />
                    </Box>
                </Box>

                {/* Buttons */}
                <Stack spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                        }}
                    >
                        Einloggen
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={handleRegister}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            backgroundColor: 'transparent',
                        }}
                    >
                        Registrieren
                    </Button>
                </Stack>

                {/* AGB Text */}
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        mt: 4,
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                    }}
                >
                    Mit der Registrierung akzeptierst du unsere AGB
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;
