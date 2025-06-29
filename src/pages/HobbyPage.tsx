import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const handleHobbyChange = (hobby: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedHobbies(prev => [...prev, hobby]);
    } else {
      setSelectedHobbies(prev => prev.filter(h => h !== hobby));
    }
  };

  const handleContinue = () => {
    // Lade die gespeicherten Daten
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    console.log('Complete profile with hobbies:', {
      ...savedProfile,
      hobbies: selectedHobbies
    });

    // Speichere das komplette Profil
    localStorage.setItem('userProfile', JSON.stringify({
      ...savedProfile,
      hobbies: selectedHobbies
    }));

    // Navigiere zum Dashboard
    navigate('/dashboard');
  };

  const hobbies = [
    { value: 'reading', label: 'Lesen', icon: '📚' },
    { value: 'hiking', label: 'Wandern', icon: '🥾' },
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'cooking', label: 'Kochen', icon: '👨‍🍳' },
    { value: 'traveling', label: 'Reisen', icon: '✈️' },
    { value: 'photography', label: 'Fotografie', icon: '📸' },
    { value: 'music', label: 'Musik', icon: '🎵' },
    { value: 'sports', label: 'Sport', icon: '⚽' },
    { value: 'art', label: 'Kunst', icon: '🎨' },
    { value: 'dancing', label: 'Tanzen', icon: '💃' },
    { value: 'movies', label: 'Filme', icon: '🎬' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'yoga', label: 'Yoga', icon: '🧘‍♀️' },
    { value: 'gardening', label: 'Gärtnern', icon: '🌱' },
    { value: 'wine', label: 'Wein', icon: '🍷' },
    { value: 'coffee', label: 'Kaffee', icon: '☕' },
    { value: 'cycling', label: 'Radfahren', icon: '🚴‍♂️' },
    { value: 'swimming', label: 'Schwimmen', icon: '🏊‍♀️' },
    { value: 'meditation', label: 'Meditation', icon: '🧘' },
    { value: 'volunteering', label: 'Ehrenamt', icon: '🤝' },
    { value: 'writing', label: 'Schreiben', icon: '✍️' },
    { value: 'pets', label: 'Haustiere', icon: '🐕' },
    { value: 'fashion', label: 'Mode', icon: '👗' },
    { value: 'concerts', label: 'Konzerte', icon: '🎤' },
  ];

  const hasMinimumSelection = selectedHobbies.length >= 3;

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
          maxWidth: 650,
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
          Ihre Hobbies
        </Typography>

        {/* Subtext */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mb: 1,
            color: 'text.secondary',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          Wählen Sie mindestens 3 Hobbies aus, die Sie begeistern.
        </Typography>

        {/* Selected count */}
        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: selectedHobbies.length >= 3 ? 'success.main' : 'text.secondary',
            fontWeight: 'bold',
          }}
        >
          {selectedHobbies.length} ausgewählt (mindestens 3 erforderlich)
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
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormGroup
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 1.5,
              }}
            >
              {hobbies.map((hobby) => (
                <FormControlLabel
                  key={hobby.value}
                  control={
                    <Checkbox
                      checked={selectedHobbies.includes(hobby.value)}
                      onChange={handleHobbyChange(hobby.value)}
                      sx={{
                        color: 'primary.main',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                        padding: 0.8,
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {hobby.icon}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.9rem',
                          color: 'text.primary',
                          fontWeight: 500,
                        }}
                      >
                        {hobby.label}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    border: '1px solid',
                    borderColor: selectedHobbies.includes(hobby.value) ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    padding: 1,
                    margin: 0,
                    backgroundColor: selectedHobbies.includes(hobby.value) ? 'primary.light' : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.light',
                    },
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Selected hobbies display */}
          {selectedHobbies.length > 0 && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'text.secondary',
                  fontWeight: 'bold',
                }}
              >
                Ausgewählte Hobbies:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {selectedHobbies.map((hobbyValue) => {
                  const hobby = hobbies.find(h => h.value === hobbyValue);
                  return (
                    <Chip
                      key={hobbyValue}
                      label={`${hobby?.icon} ${hobby?.label}`}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ fontSize: '0.8rem' }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!hasMinimumSelection}
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
          Profil vervollständigen
        </Button>
      </Box>
    </Box>
  );
};

export default HobbyPage;
