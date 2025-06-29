import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

const NameAgePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: ''
  });

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, firstName: event.target.value }));
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, lastName: event.target.value }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, birthDate: event.target.value }));
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, gender: event.target.value }));
  };

  const handleContinue = () => {
    // Add validation and navigation logic here
    console.log('Submitted:', formData);
    // Navigate to gender preference page
    navigate('/gender-preference');
  };

  // Calculate max date (18 years ago) and min date (100 years ago)
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split('T')[0];

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
          maxWidth: 800,
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
          Wie heißt du –<br />und wann bist du geboren?
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
          Diese Angaben sind Teil deines Profils und später für andere sichtbar.<br />
          Du kannst sie später nicht mehr ändern.
        </Typography>

        {/* Single card layout */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: 5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'grey.200',
            maxWidth: 500,
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
            Ihre Angaben
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Vorname"
              variant="outlined"
              value={formData.firstName}
              onChange={handleFirstNameChange}
              fullWidth
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
              label="Nachname"
              variant="outlined"
              value={formData.lastName}
              onChange={handleLastNameChange}
              fullWidth
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

            <FormControl
              fullWidth
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
            >
              <InputLabel>Geschlecht</InputLabel>
              <Select
                value={formData.gender}
                label="Geschlecht"
                onChange={handleGenderChange}
              >
                <MenuItem value="männlich">Männlich</MenuItem>
                <MenuItem value="weiblich">Weiblich</MenuItem>
                <MenuItem value="divers">Divers</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Geburtsdatum"
              type="date"
              variant="outlined"
              value={formData.birthDate}
              onChange={handleDateChange}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  max: maxDate,
                  min: minDate,
                },
              }}
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
          onClick={handleContinue}
          disabled={!formData.firstName || !formData.lastName || !formData.gender || !formData.birthDate}
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

export default NameAgePage;
