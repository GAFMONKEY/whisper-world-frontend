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
    // Navigate to date preference page
    navigate('/date-preference');
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
          Diese Angaben sind Teil<br />
          deines Profils und später<br />
          für andere sichtbar.<br />
          Du kannst sie später nicht<br />
          mehr ändern.
        </Typography>

        <Stack spacing={3} sx={{ width: '100%' }}>
          <TextField
            label="Vorname"
            variant="outlined"
            value={formData.firstName}
            onChange={handleFirstNameChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
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
              },
            }}
          />

          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
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
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={!formData.firstName || !formData.lastName || !formData.gender || !formData.birthDate}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Weiter
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default NameAgePage;
