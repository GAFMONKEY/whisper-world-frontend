import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

const LifestylePage: React.FC = () => {
  const navigate = useNavigate();
  const [lifestyle, setLifestyle] = useState({
    childrenWish: '',
    children: '',
    alcohol: '',
    smoking: '',
    cannabis: '',
    politics: '',
  });

  const handleChange = (category: string) => (event: SelectChangeEvent) => {
    setLifestyle(prev => ({
      ...prev,
      [category]: event.target.value
    }));
  };

  const handleContinue = () => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const updatedProfile = {
      ...savedProfile,
      lifestyle: lifestyle
    };

    console.log('Updated profile with lifestyle:', updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    navigate('/music');
  };

  const categories = [
    {
      key: 'childrenWish',
      title: 'Kinderwunsch',
      options: [
        { value: 'yes', label: 'Ja' },
        { value: 'no', label: 'Nein' },
        { value: 'maybe', label: 'Vielleicht' },
        { value: 'not specified', label: 'Keine Angabe' },
      ]
    },
    {
      key: 'children',
      title: 'Haben Sie bereits Kinder?',
      options: [
        { value: 'yes', label: 'Ja' },
        { value: 'no', label: 'Nein' },
        { value: 'not specified', label: 'Keine Angabe' },
      ]
    },
    {
      key: 'alcohol',
      title: 'Alkohol',
      options: [
        { value: 'yes', label: 'Ja' },
        { value: 'no', label: 'Nein' },
        { value: 'sometimes', label: 'Gelegentlich' },
        { value: 'not specified', label: 'Keine Angabe' },
      ]
    },
    {
      key: 'smoking',
      title: 'Rauchen',
      options: [
        { value: 'yes', label: 'Ja' },
        { value: 'no', label: 'Nein' },
        { value: 'sometimes', label: 'Gelegentlich' },
        { value: 'not specified', label: 'Keine Angabe' },
      ]
    },
    {
      key: 'cannabis',
      title: 'Cannabis',
      options: [
        { value: 'yes', label: 'Ja' },
        { value: 'no', label: 'Nein' },
        { value: 'sometimes', label: 'Gelegentlich' },
        { value: 'not specified', label: 'Keine Angabe' },
      ]
    },
    {
      key: 'politics',
      title: 'Politische Einstellung',
      options: [
        { value: 'left', label: 'Links' },
        { value: 'center', label: 'Mitte' },
        { value: 'right', label: 'Rechts' },
        { value: 'not political', label: 'Nicht politisch' },
        { value: 'not specified', label: 'Keine Angabe' },
      ]
    }
  ];

  const allCompleted = Object.values(lifestyle).every(value => value !== '');

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
          Ihr Lifestyle
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
          Teilen Sie uns etwas über Ihren Lebensstil mit.
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
          <Stack spacing={3}>
            {categories.map((category) => (
              <Box key={category.key}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: 'left',
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                  }}
                >
                  {category.title}
                </Typography>

                <FormControl fullWidth sx={{ mb: 0.5 }}>
                  <Select
                    value={lifestyle[category.key as keyof typeof lifestyle]}
                    onChange={handleChange(category.key)}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                          mt: 1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                      },
                      disableScrollLock: true,
                      disablePortal: true,
                      disableAutoFocus: true,
                      disableEnforceFocus: true,
                      disableRestoreFocus: true,
                      hideBackdrop: true,
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
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
                      '& .MuiSelect-select': {
                        textAlign: 'left',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        Bitte wählen...
                      </Typography>
                    </MenuItem>
                    {category.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Typography variant="body2">
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!allCompleted}
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

export default LifestylePage;
