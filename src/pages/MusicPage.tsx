import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const [textAnswer, setTextAnswer] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextAnswer(event.target.value);
  };

  const handleContinue = () => {
    // Lade die gespeicherten Daten
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    // Erstelle das answers Array oder erweitere es
    const existingAnswers = savedProfile.answers || [];
    const musicAnswer = {
      cluster: 'Musik',
      question: 'Welche Rolle spielt Musik in deinem Leben?',
      textAnswer: textAnswer,
      audioUrl: ''
    };

    const updatedAnswers = [...existingAnswers, musicAnswer];

    console.log('Complete profile with music answer:', {
      ...savedProfile,
      answers: updatedAnswers
    });

    // Speichere das komplette Profil
    localStorage.setItem('userProfile', JSON.stringify({
      ...savedProfile,
      answers: updatedAnswers
    }));

    // Navigiere zur Hobby-Seite
    navigate('/hobbies');
  };

  const isCompleted = textAnswer.trim() !== '';

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
          Musik in Ihrem Leben
        </Typography>

        {/* Subtext */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          Erzählen Sie uns etwas über die Bedeutung von Musik für Sie.
          Deine Antwort sagt mehr dich aus als 100 Likes.
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
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'left',
              mb: 2,
              color: 'text.primary',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            Welche Rolle spielt Musik in deinem Leben?
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={textAnswer}
            onChange={handleTextChange}
            placeholder="Beschreiben Sie, welche Bedeutung Musik für Sie hat..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.default',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
              },
            }}
          />
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

export default MusicPage;
