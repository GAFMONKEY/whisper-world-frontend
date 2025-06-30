import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
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
    console.log('Register:', formData);
    // Speichere Email und Passwort für das finale Profil
    localStorage.setItem('userProfile', JSON.stringify({
      email: formData.email,
      password: formData.password
    }));
    // Nach Formularverarbeitung zur NameAgePage weiterleiten
    navigate('/name-age');
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
        padding: 2,
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
          maxWidth: 500,
          width: '100%',
        }}
      >
        {/* Headline */}
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 1,
            color: 'text.primary',
            fontWeight: 'bold',
          }}
        >
          Willkommen bei<br />Whisper World
        </Typography>

        {/* Subtext */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'text.secondary',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          Erstellen Sie Ihr Konto und beginnen Sie<br />
          Ihre Dating-Reise mit Sprachnachrichten.
        </Typography>

        {/* Registration Card */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: 5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'grey.200',
            width: '100%',
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'text.primary',
              fontWeight: 'bold',
            }}
          >
            Registrierung
          </Typography>

          <Stack spacing={3}>
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
                  backgroundColor: 'background.default',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                  backgroundColor: 'background.default',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                  backgroundColor: 'background.default',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                },
              }}
            />
          </Stack>
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.email || !formData.password || !formData.confirmPassword}
          sx={{
            mt: 2,
            py: 2,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 600,
            borderRadius: 4,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              backgroundColor: 'grey.400',
              color: 'grey.600',
              boxShadow: 'none',
            },
          }}
        >
          Registrieren
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;