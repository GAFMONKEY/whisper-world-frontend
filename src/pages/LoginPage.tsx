import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: 'alice.anderson@example.com',
        password: 'password123',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const userData = await authService.login(formData.email, formData.password);
            console.log('Login successful:', userData);

            // Speichere Benutzerdaten im localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            // Navigiere zum Dashboard
            navigate('/dashboard');

        } catch (error: unknown) {
            console.error('Login error:', error);

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status === 401) {
                    setError('Ungültige E-Mail oder Passwort');
                } else if (axiosError.response?.status === 500) {
                    setError('Server-Fehler. Bitte versuchen Sie es später erneut.');
                } else {
                    setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
                }
            } else if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
                setError('Verbindung zum Server fehlgeschlagen. Ist das Backend gestartet?');
            } else {
                setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // TODO: Navigate to forgot password page
        console.log('Forgot password clicked');
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

                {/* Login Form */}
                <Stack spacing={3} sx={{ width: '100%', maxWidth: 300 }}>
                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="E-Mail"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        fullWidth
                        variant="outlined"
                        disabled={loading}
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
                        disabled={loading}
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

                    {/* Passwort vergessen Link */}
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleForgotPassword}
                            sx={{
                                color: 'text.primary',
                                textDecoration: 'underline',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none',
                                fontFamily: 'inherit',
                                '&:hover': {
                                    color: 'secondary.dark',
                                },
                            }}
                        >
                            Passwort vergessen?
                        </Link>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || !formData.email || !formData.password}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 3,
                            mt: 3,
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'grey.300',
                                color: 'grey.500',
                            },
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                Wird geladen...
                            </Box>
                        ) : (
                            'Weiter'
                        )}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default LoginPage;
