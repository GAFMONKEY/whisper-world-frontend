import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

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

    // Navigiere zur Farbauswahl-Seite
    navigate('/color-picker');
  };

  const hobbies = [
    // Kreatives & Kulturelles
    { value: 'music', label: 'Musik', category: 'Kreatives & Kulturelles' },
    { value: 'movies', label: 'Filme & Serien', category: 'Kreatives & Kulturelles' },
    { value: 'art', label: 'Kunst & Design', category: 'Kreatives & Kulturelles' },
    { value: 'reading', label: 'Bücher & Lesen', category: 'Kreatives & Kulturelles' },
    { value: 'podcasts', label: 'Podcasts & Hörbücher', category: 'Kreatives & Kulturelles' },
    { value: 'writing', label: 'Schreiben & Storytelling', category: 'Kreatives & Kulturelles' },

    // Achtsamkeit & Reflexion
    { value: 'meditation', label: 'Achtsamkeit', category: 'Achtsamkeit & Reflexion' },
    { value: 'mindfulness', label: 'Meditation', category: 'Achtsamkeit & Reflexion' },
    { value: 'journaling', label: 'Journaling', category: 'Achtsamkeit & Reflexion' },
    { value: 'reflection', label: 'Reflexion', category: 'Achtsamkeit & Reflexion' },
    { value: 'routines', label: 'Routinen & Gewohnheiten', category: 'Achtsamkeit & Reflexion' },

    // Technik & Medien
    { value: 'technology', label: 'Technik & Gadgets', category: 'Technik & Medien' },
    { value: 'scifi', label: 'Sci-Fi & Fantasy', category: 'Technik & Medien' },
    { value: 'memes', label: 'Memes & Internetkultur', category: 'Technik & Medien' },
    { value: 'gaming', label: 'Gaming', category: 'Technik & Medien' },
    { value: 'retrogaming', label: 'Retrogaming', category: 'Technik & Medien' },
    { value: 'anime', label: 'Anime & Manga', category: 'Technik & Medien' },
    { value: 'ai', label: 'KI & Zukunft', category: 'Technik & Medien' },
    { value: 'cosplay', label: 'Cosplay', category: 'Technik & Medien' },

    // Bewegung & Gesundheit
    { value: 'sports', label: 'Sport', category: 'Bewegung & Gesundheit' },
    { value: 'fitness', label: 'Fitness', category: 'Bewegung & Gesundheit' },
    { value: 'yoga', label: 'Yoga', category: 'Bewegung & Gesundheit' },
    { value: 'hiking', label: 'Wandern', category: 'Bewegung & Gesundheit' },
    { value: 'cycling', label: 'Radfahren', category: 'Bewegung & Gesundheit' },
    { value: 'swimming', label: 'Schwimmen', category: 'Bewegung & Gesundheit' },
    { value: 'dancing', label: 'Tanzen', category: 'Bewegung & Gesundheit' },
    { value: 'nutrition', label: 'Ernährung', category: 'Bewegung & Gesundheit' },
  ];

  const categories = [
    'Kreatives & Kulturelles',
    'Achtsamkeit & Reflexion',
    'Technik & Medien',
    'Bewegung & Gesundheit'
  ];

  const getHobbiesByCategory = (category: string) => {
    return hobbies.filter(hobby => hobby.category === category);
  };

  const hasMinimumSelection = selectedHobbies.length >= 3;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'background.default',
        margin: 0,
        padding: 2,
        paddingTop: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          py: 2,
          maxWidth: 500,
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
          Was interessiert dich?
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
          Basierend auf deiner Auswahl werden wir dir gleich Fragen zur Beantwortung vorschlagen.
        </Typography>

        {/* Selected count */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.primary',
            fontWeight: 'bold',
          }}
        >
          {selectedHobbies.length} von 3 gewählt
        </Typography>

        {/* Categories */}
        <Box sx={{ width: '100%', mb: 3 }}>
          {categories.map((category) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'left',
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                {category}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'flex-start',
                }}
              >
                {getHobbiesByCategory(category).map((hobby) => (
                  <Chip
                    key={hobby.value}
                    label={hobby.label}
                    clickable
                    onClick={() => {
                      if (selectedHobbies.includes(hobby.value)) {
                        setSelectedHobbies(prev => prev.filter(h => h !== hobby.value));
                      } else {
                        setSelectedHobbies(prev => [...prev, hobby.value]);
                      }
                    }}
                    variant={selectedHobbies.includes(hobby.value) ? 'filled' : 'outlined'}
                    color={selectedHobbies.includes(hobby.value) ? 'primary' : 'default'}
                    sx={{
                      fontSize: '0.85rem',
                      height: 'auto',
                      padding: 1,
                      borderRadius: 6,
                      '&:hover': {
                        backgroundColor: selectedHobbies.includes(hobby.value)
                          ? 'primary.dark'
                          : 'primary.light',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!hasMinimumSelection}
          fullWidth
          sx={{
            mt: 2,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              backgroundColor: 'grey.400',
              color: 'grey.600',
              boxShadow: 'none',
            },
          }}
        >
          Weiter
        </Button>
      </Box>
    </Box>
  );
};

export default HobbyPage;
