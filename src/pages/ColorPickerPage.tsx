import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ColorPickerPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('#2196F3');

  const handleContinue = () => {
    // Lade die gespeicherten Daten
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    console.log('Complete profile with accent color:', {
      ...savedProfile,
      accentColor: selectedColor
    });

    // Speichere das komplette Profil
    localStorage.setItem('userProfile', JSON.stringify({
      ...savedProfile,
      accentColor: selectedColor
    }));

    // Navigiere zum Dashboard
    navigate('/dashboard');
  };

  // Vordefinierte beliebte Farben für schnelle Auswahl
  const presetColors = [
    '#2196F3', '#4CAF50', '#9C27B0', '#FF9800',
    '#E91E63', '#F44336', '#00BCD4', '#3F51B5',
    '#8BC34A', '#FFC107', '#009688', '#673AB7',
    '#795548', '#607D8B', '#FF5722', '#CDDC39',
    '#000000', '#424242', '#757575', '#FFFFFF'
  ];

  const isCompleted = selectedColor !== '';

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
          maxWidth: 600,
          width: '100%',
        }}
      >
        {/* Headline */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 1,
            color: 'text.primary',
            fontWeight: 'bold',
          }}
        >
          Ihre persönliche Akzentfarbe
        </Typography>

        {/* Subtext */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'text.secondary',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          Wählen Sie eine Farbe, die Ihre Persönlichkeit widerspiegelt und Ihre App-Erfahrung personalisiert.
        </Typography>

        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'grey.200',
            width: '100%',
            mb: 3,
          }}
        >
          {/* Aktuelle Farbvorschau */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: selectedColor,
                borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                border: '3px solid white',
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 'bold',
                }}
              >
                Gewählte Farbe
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'monospace',
                }}
              >
                {selectedColor.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          {/* Farbwähler */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: 'left',
                mb: 2,
                color: 'text.primary',
                fontWeight: 'bold',
              }}
            >
              Farbwähler
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                sx={{
                  width: 80,
                  '& input': {
                    height: 50,
                    padding: 0,
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                  },
                  '& .MuiOutlinedInput-root': {
                    padding: 0,
                    borderRadius: 2,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Klicken Sie hier, um eine beliebige Farbe auszuwählen
              </Typography>
            </Box>
          </Box>

          {/* Vordefinierte Farben */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: 'left',
                mb: 2,
                color: 'text.primary',
                fontWeight: 'bold',
              }}
            >
              Beliebte Farben
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
                gap: 1,
              }}
            >
              {presetColors.map((color) => (
                <Paper
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    cursor: 'pointer',
                    borderRadius: 2,
                    border: selectedColor === color ? '3px solid #000' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!isCompleted}
          sx={{
            mt: 2,
            py: 2,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 600,
            borderRadius: 4,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            backgroundColor: selectedColor,
            '&:hover': {
              backgroundColor: selectedColor,
              opacity: 0.9,
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
          Registrierung abschließen
        </Button>
      </Box>
    </Box>
  );
};

export default ColorPickerPage;
