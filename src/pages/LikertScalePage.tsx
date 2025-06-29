import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Radio,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LikertScalePage: React.FC = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({
    intimacy: '',
    openness: '',
    silence: '',
  });

  const handleRatingChange = (category: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRatings(prev => ({
      ...prev,
      [category]: event.target.value
    }));
  };

  const handleContinue = () => {
    // Lade die gespeicherten Präferenzen
    const savedPreferences = JSON.parse(localStorage.getItem('datingPreferences') || '{}');

    console.log('Complete profile data:', {
      ...savedPreferences,
      personalityRatings: ratings
    });

    // Speichere alle Daten zusammen
    localStorage.setItem('userProfile', JSON.stringify({
      ...savedPreferences,
      personalityRatings: ratings
    }));

    // Navigiere zur Lifestyle-Seite
    navigate('/lifestyle');
  };

  const scaleOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ];

  const categories = [
    {
      key: 'intimacy',
      title: 'Intimität',
      description: 'Ich schätze tiefe, emotionale Verbindungen und körperliche Nähe.'
    },
    {
      key: 'openness',
      title: 'Offenheit',
      description: 'Ich bin offen für neue Erfahrungen und teile gerne meine Gedanken.'
    },
    {
      key: 'silence',
      title: 'Stille',
      description: 'Ich genieße ruhige Momente und fühle mich wohl in friedlichen Umgebungen.'
    }
  ];

  const allRated = Object.values(ratings).every(rating => rating !== '');

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
          maxWidth: 700,
          width: '100%',
        }}
      >
        {/* Headline */}
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: 'text.primary',
            fontWeight: 'bold',
          }}
        >
          Ihre Persönlichkeit
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
          Bewerten Sie die folgenden Aussagen über sich selbst.<br />
          Dies hilft uns, passende Matches für Sie zu finden.
        </Typography>

        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
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
            Persönlichkeitsbewertung
          </Typography>

          <Stack spacing={4}>
            {categories.map((category) => (
              <Box key={category.key}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 'bold',
                  }}
                >
                  {category.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    mb: 3,
                    color: 'text.secondary',
                    fontStyle: 'italic',
                  }}
                >
                  {category.description}
                </Typography>

                {/* Mobile Layout */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      Gar nicht
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      Völlig
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                    {scaleOptions.map((option) => (
                      <Box key={option.value} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 0.5,
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Radio
                          checked={ratings[category.key as keyof typeof ratings] === option.value}
                          onChange={handleRatingChange(category.key)}
                          value={option.value}
                          size="small"
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                            padding: 0.5,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Desktop Layout */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: '100px', fontSize: '0.8rem' }}>
                    Stimme gar nicht zu
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
                    {scaleOptions.map((option) => (
                      <Box key={option.value} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 0.5,
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Radio
                          checked={ratings[category.key as keyof typeof ratings] === option.value}
                          onChange={handleRatingChange(category.key)}
                          value={option.value}
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                            padding: 1,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: '100px', textAlign: 'right', fontSize: '0.8rem' }}>
                    Stimme völlig zu
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!allRated}
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
          Weiter
        </Button>
      </Box>
    </Box>
  );
};

export default LikertScalePage;
