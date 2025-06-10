import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = () => {
        // TODO: Implement registration logic
        console.log('Register:', formData);
        // Hier würde die Registration API aufgerufen
    };

    const handleBackToLogin = () => {
        navigate('/');
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
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
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
                                fontSize: 40,
                                color: 'text.primary',
                            }}
                        />
                    </Box>
                </Box>

                {/* Registration Form */}
                <Stack spacing={3} sx={{ width: '100%', maxWidth: 300 }}>
                    <TextField
                        label="E-Mail"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '& fieldset': {
                                    borderColor: 'secondary.main',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: 'secondary.dark',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'secondary.dark',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'secondary.dark',
                                '&.Mui-focused': {
                                    color: 'secondary.dark',
                                },
                            },
                        }}
                    />

                    <TextField
                        label="Passwort"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '& fieldset': {
                                    borderColor: 'secondary.main',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: 'secondary.dark',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'secondary.dark',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'secondary.dark',
                                '&.Mui-focused': {
                                    color: 'secondary.dark',
                                },
                            },
                        }}
                    />

                    <TextField
                        label="Passwort bestätigen"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '& fieldset': {
                                    borderColor: 'secondary.main',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: 'secondary.dark',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'secondary.dark',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'secondary.dark',
                                '&.Mui-focused': {
                                    color: 'secondary.dark',
                                },
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 3,
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                            },
                        }}
                    >
                        Weiter
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default RegisterPage;
