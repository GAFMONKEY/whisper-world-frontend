import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DatingIntentionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);

  const handleIntentionChange = (intention: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIntentions(prev => [...prev, intention]);
    } else {
      setSelectedIntentions(prev => prev.filter(i => i !== intention));
    }
  };

  const handleContinue = () => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const intentionMapping: { [key: string]: string } = {
      'freunde': 'friends',
      'unverbindlich': 'hookups',
      'lockeres-dating': 'casual dating',
      'offen-fuer-alles': 'open to anything',
      'kurze-beziehung': 'short-term relationship',
      'lange-beziehung': 'long-term relationship'
    };

    const mappedIntentions = selectedIntentions.map(intention => intentionMapping[intention]);

    const updatedProfile = {
      ...savedProfile,
      intentions: mappedIntentions
    };

    console.log('Updated profile with intentions:', updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    navigate('/likert-scale');
  };

  const intentionOptions = [
    { value: 'freunde', label: 'Freunde finden' },
    { value: 'unverbindlich', label: 'Unverbindliche Treffen' },
    { value: 'lockeres-dating', label: 'Lockeres Dating' },
    { value: 'offen-fuer-alles', label: 'Offen für alles' },
    { value: 'kurze-beziehung', label: 'Kurze Beziehung' },
    { value: 'lange-beziehung', label: 'Lange Beziehung' },
  ];

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
            mb: 2,
            color: 'text.primary',
            fontWeight: 'bold',
          }}
        >
          Was sind<br />Ihre Absichten?
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
          Wählen Sie Ihre Dating-Absichten für potenzielle Matches.<br />
          Mehrfachauswahl ist möglich. Sie können dies später ändern.
        </Typography>

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
            Dating-Absichten
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormGroup sx={{ gap: 2 }}>
              {intentionOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={selectedIntentions.includes(option.value)}
                      onChange={handleIntentionChange(option.value)}
                      sx={{
                        color: 'primary.main',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1.1rem',
                        color: 'text.primary',
                        fontWeight: 500,
                      }}
                    >
                      {option.label}
                    </Typography>
                  }
                  sx={{
                    border: '2px solid',
                    borderColor: selectedIntentions.includes(option.value) ? 'primary.main' : 'grey.300',
                    borderRadius: 3,
                    padding: 2.5,
                    margin: 0,
                    backgroundColor: selectedIntentions.includes(option.value) ? 'primary.light' : 'transparent',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedIntentions.includes(option.value) ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.light',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={selectedIntentions.length === 0}
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

export default DatingIntentionsPage;
