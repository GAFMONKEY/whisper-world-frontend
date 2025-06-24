import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const NameAgePage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', age: '' });

  const handleChange = (field: 'name' | 'age') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleContinue = () => {
    // Add validation and navigation logic here
    console.log('Submitted:', formData);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5eee8', // Matches beige background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Headline */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#000',
          }}
        >
          Wie heißt du –<br />und wie alt bist du?
        </Typography>

        {/* Subtext */}
        <Typography
          variant="body1"
          sx={{
            fontStyle: 'italic',
            mb: 4,
            color: '#000',
          }}
        >
          Diese Angaben sind Teil<br />
          deines Profils und später<br />
          für andere sichtbar.<br />
          Du kannst sie später nicht<br />
          mehr ändern.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
            InputLabelProps={{ style: { color: '#c47c65' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#c47c65',
                },
                '&:hover fieldset': {
                  borderColor: '#a95d47',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#a95d47',
                },
              },
            }}
          />

          <TextField
            label="Alter"
            variant="outlined"
            value={formData.age}
            onChange={handleChange('age')}
            type="number"
            fullWidth
            InputLabelProps={{ style: { color: '#c47c65' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#c47c65',
                },
                '&:hover fieldset': {
                  borderColor: '#a95d47',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#a95d47',
                },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleContinue}
            sx={{
              mt: 2,
              backgroundColor: '#e2a87d',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: 999,
              '&:hover': {
                backgroundColor: '#d4946c',
              },
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
