import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  BottomNavigation,
  BottomNavigationAction,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/setupUser';
import { convertUserToDiscoverUser, type DiscoverUser } from '../services/matchService.ts';

const OwnProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(3); // Hearts tab aktiv
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{
    categoryIndex: number;
    questionIndex: number;
  } | null>(null);
  const [currentProfile, setCurrentProfile] = useState<DiscoverUser | null>(null);

  const isSkipping = false;
  
  useEffect(() => {
    const loadProfiles = () => {
      const user = getCurrentUser();
      console.log(user);
      if (!user) {
        navigate('/');
        return;
      }
      
      setCurrentProfile(convertUserToDiscoverUser(user));
      console.log(currentProfile);

      try {
        setLoading(true);
        setError(null);
        
      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Fehler beim Laden der Profile. Bitte versuche es später nochmal.');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
    setNavValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/profile');
        break;
      case 2:
        navigate('/chats');
        break;
      case 3:
        break;
    }
  };

  const handlePlayAudio = (categoryIndex: number, questionIndex: number) => {
    console.log(`Audio abspielen: Kategorie ${categoryIndex}, Frage ${questionIndex}`);
    setPlayingAudio({ categoryIndex, questionIndex });

    setTimeout(() => {
      setPlayingAudio(null);
    }, 3000);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: 'secondary.main' }} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Profil wird geladen...
        </Typography>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Alert
          severity="info"
          sx={{
            maxWidth: 400,
            '& .MuiAlert-message': {
              textAlign: 'center',
            },
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: 'secondary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
          >
            Zurück zum Dashboard
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!currentProfile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Alert severity="info">
          <Typography variant="body1" sx={{ mb: 2 }}>
            Keine Profile mehr verfügbar!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: 'secondary.main',
              color: 'white',
            }}
          >
            Zurück zum Dashboard
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: currentProfile?.accentColor
          ? `linear-gradient(135deg, ${currentProfile.accentColor}15 0%, ${currentProfile.accentColor}08 100%)`
          : 'linear-gradient(135deg, #BFA9BE15 0%, #BFA9BE08 100%)',
        pb: 20,
        animation: !isSkipping
          ? 'slideInFromRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          : 'none',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        '@keyframes slideInFromRight': {
          '0%': {
            opacity: 0,
            transform: 'translateX(100vw) rotate(15deg) scale(0.8)',
            filter: 'blur(3px)',
          },
          '50%': {
            transform: 'translateX(-5vw) rotate(-2deg) scale(1.02)',
            filter: 'blur(1px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0) rotate(0deg) scale(1)',
            filter: 'blur(0px)',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pt: 4,
          pb: 5,
          textAlign: 'center',
          transform: isSkipping
            ? 'translateX(-120vw) rotate(-15deg) scale(0.8)'
            : 'translateX(0) rotate(0deg) scale(1)',
          opacity: isSkipping ? 0 : 1,
          transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          filter: isSkipping ? 'blur(2px)' : 'blur(0px)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            color: currentProfile?.accentColor || '#2C3E50',
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontFamily: 'Inter, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {currentProfile?.name || 'Unbekannt'}, {currentProfile?.age || 0}
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          px: 3,
          pb: 3,
          pt: 2, // Additional top padding for better separation
          transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          opacity: isSkipping ? 0 : playingAudio ? 0.9 : 1,
          transform: isSkipping ? 'translateX(-120vw) rotate(-15deg) scale(0.8)' : 'scale(1)',
          filter: isSkipping ? 'blur(2px)' : 'blur(0px)',
          mb: 10,
        }}
      >
        {/* Categories mit Fragen */}
        {currentProfile &&
        currentProfile.categories &&
        Array.isArray(currentProfile.categories) &&
        currentProfile.categories.length > 0 ? (
          currentProfile.categories.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 3 }}>
              {/* Category Tag */}
              <Chip
                label={category?.name || 'Unbekannt'}
                sx={{
                  backgroundColor: category?.color || '#BFA9BE',
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '0.9rem',
                  borderRadius: 3,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '& .MuiChip-label': {
                    px: 2,
                    fontWeight: 'bold',
                  },
                }}
              />

              {/* Questions */}
              {category?.questions &&
                Array.isArray(category.questions) &&
                category.questions.map((q, questionIndex) => (
                  <Card
                    key={questionIndex}
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: category.color,
                      mb: 2,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: q.hasAudio ? 'pointer' : 'default',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transform: isSkipping
                        ? 'translateX(-50px) scale(0.9)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.3 : 1,
                      animation: !isSkipping
                        ? `slideInCard 0.6s ease-out ${questionIndex * 0.1}s both`
                        : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(20px) scale(0.95)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform:
                          q.hasAudio && !isSkipping
                            ? 'translateY(-4px) scale(1.02)'
                            : !isSkipping
                              ? 'translateY(-2px)'
                              : 'translateX(-50px) scale(0.9)',
                        boxShadow:
                          q.hasAudio && !isSkipping
                            ? '0 8px 25px rgba(0,0,0,0.12)'
                            : !isSkipping
                              ? '0 6px 15px rgba(0,0,0,0.08)'
                              : '0 4px 12px rgba(0,0,0,0.05)',
                        borderColor: !isSkipping ? category.color : category.color,
                      },
                    }}
                    onClick={
                      q.hasAudio ? () => handlePlayAudio(categoryIndex, questionIndex) : undefined
                    }
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: (q?.answer && typeof q.answer === 'string') || q?.hasAudio ? 2 : 0,
                        }}
                      >
                        {q?.question || 'Frage ohne Text'}
                      </Typography>

                      {q?.answer && typeof q.answer === 'string' && (
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            fontStyle: 'italic',
                            background: 'white',
                            border: `2px solid ${category?.color || '#BFA9BE'}`,
                            borderRadius: 3,
                            p: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          }}
                        >
                          {q.answer}
                        </Typography>
                      )}

                      {q.hasAudio && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <IconButton
                            onClick={() => handlePlayAudio(categoryIndex, questionIndex)}
                            sx={{
                              background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}CC 100%)`,
                              color: 'white',
                              width: 60,
                              height: 60,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              animation:
                                playingAudio?.categoryIndex === categoryIndex &&
                                playingAudio?.questionIndex === questionIndex
                                  ? 'pulse 1.5s infinite'
                                  : 'none',
                              '@keyframes pulse': {
                                '0%': {
                                  transform: 'scale(1)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                },
                                '50%': {
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                },
                                '100%': {
                                  transform: 'scale(1)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                },
                              },
                              '&:hover': {
                                background: `linear-gradient(135deg, ${category.color}DD 0%, ${category.color}AA 100%)`,
                                transform: 'scale(1.08)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                              },
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          >
                            {playingAudio?.categoryIndex === categoryIndex &&
                            playingAudio?.questionIndex === questionIndex ? (
                              <PauseIcon sx={{ fontSize: 30 }} />
                            ) : (
                              <PlayArrowIcon sx={{ fontSize: 30 }} />
                            )}
                          </IconButton>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </Box>
          ))
        ) : (
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'secondary.main',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                🎭 Fragen
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currentProfile?.name || 'Dieser Nutzer'} hat noch keine Inhalte hinzugefügt.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle Section - Now styled like other categories */}
        {currentProfile && currentProfile.lifestyle ? (
          <>
            {/* Lifestyle & Dating Category */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label="💫 Lifestyle & Dating"
                sx={{
                  backgroundColor: '#FF9800', // Orange color
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '0.9rem',
                  borderRadius: 3,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '& .MuiChip-label': {
                    px: 2,
                    fontWeight: 'bold',
                  },
                }}
              />

              {/* Kinderwunsch Card */}
              {currentProfile.lifestyle.childrenWish &&
                currentProfile.lifestyle.childrenWish !== 'not specified' && (
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid #FF9800',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSkipping
                        ? 'translateX(-30px) scale(0.95)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.4 : 1,
                      animation: !isSkipping ? 'slideInCard 0.6s ease-out 0.2s both' : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(15px) scale(0.98)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform: !isSkipping
                          ? 'translateY(-2px) scale(1.01)'
                          : 'translateX(-30px) scale(0.95)',
                        boxShadow: !isSkipping
                          ? '0 6px 20px rgba(255, 152, 0, 0.15)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        👶 Kinderwunsch
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          background: 'white',
                          border: '2px solid #FF9800',
                          borderRadius: 3,
                          p: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {currentProfile.lifestyle.childrenWish === 'yes'
                          ? 'Ja'
                          : currentProfile.lifestyle.childrenWish === 'no'
                            ? 'Nein'
                            : currentProfile.lifestyle.childrenWish === 'maybe'
                              ? 'Vielleicht'
                              : currentProfile.lifestyle.childrenWish}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

              {/* Hat Kinder Card */}
              {currentProfile.lifestyle.children &&
                currentProfile.lifestyle.children !== 'not specified' && (
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid #FF9800',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSkipping
                        ? 'translateX(-25px) scale(0.96)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.5 : 1,
                      animation: !isSkipping ? 'slideInCard 0.6s ease-out 0.3s both' : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(15px) scale(0.98)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform: !isSkipping
                          ? 'translateY(-2px) scale(1.01)'
                          : 'translateX(-25px) scale(0.96)',
                        boxShadow: !isSkipping
                          ? '0 6px 20px rgba(255, 152, 0, 0.15)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        👶 Hat Kinder
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          background: 'white',
                          border: '2px solid #FF9800',
                          borderRadius: 3,
                          p: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {currentProfile.lifestyle.children === 'yes'
                          ? 'Ja'
                          : currentProfile.lifestyle.children === 'no'
                            ? 'Nein'
                            : currentProfile.lifestyle.children}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

              {/* Politik Card */}
              {currentProfile.lifestyle.politics &&
                currentProfile.lifestyle.politics !== 'not specified' && (
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid #FF9800',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSkipping
                        ? 'translateX(-20px) scale(0.97)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.6 : 1,
                      animation: !isSkipping ? 'slideInCard 0.6s ease-out 0.4s both' : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(15px) scale(0.98)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform: !isSkipping
                          ? 'translateY(-2px) scale(1.01)'
                          : 'translateX(-20px) scale(0.97)',
                        boxShadow: !isSkipping
                          ? '0 6px 20px rgba(255, 152, 0, 0.15)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        🗳️ Politik
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          background: 'white',
                          border: '2px solid #FF9800',
                          borderRadius: 3,
                          p: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {currentProfile.lifestyle.politics === 'left'
                          ? 'Links'
                          : currentProfile.lifestyle.politics === 'right'
                            ? 'Rechts'
                            : currentProfile.lifestyle.politics === 'center'
                              ? 'Mitte'
                              : currentProfile.lifestyle.politics === 'not political'
                                ? 'Unpolitisch'
                                : currentProfile.lifestyle.politics}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
            </Box>

            {/* Gesundheit & Substanzen Category */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label="🏃‍♀️ Gesundheit & Substanzen"
                sx={{
                  backgroundColor: '#4CAF50', // Green color
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '0.9rem',
                  borderRadius: 3,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '& .MuiChip-label': {
                    px: 2,
                    fontWeight: 'bold',
                  },
                }}
              />

              {/* Alkohol Card */}
              {currentProfile.lifestyle.alcohol &&
                currentProfile.lifestyle.alcohol !== 'not specified' && (
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid #4CAF50',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSkipping
                        ? 'translateX(-15px) scale(0.98)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.7 : 1,
                      animation: !isSkipping ? 'slideInCard 0.6s ease-out 0.1s both' : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(15px) scale(0.98)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform: !isSkipping
                          ? 'translateY(-2px) scale(1.01)'
                          : 'translateX(-15px) scale(0.98)',
                        boxShadow: !isSkipping
                          ? '0 6px 20px rgba(76, 175, 80, 0.15)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        🍷 Alkohol
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          background: 'white',
                          border: '2px solid #4CAF50',
                          borderRadius: 3,
                          p: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {currentProfile.lifestyle.alcohol === 'yes'
                          ? 'Ja'
                          : currentProfile.lifestyle.alcohol === 'no'
                            ? 'Nein'
                            : currentProfile.lifestyle.alcohol === 'sometimes'
                              ? 'Manchmal'
                              : currentProfile.lifestyle.alcohol}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

              {/* Rauchen Card */}
              {currentProfile.lifestyle.smoking &&
                currentProfile.lifestyle.smoking !== 'not specified' && (
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid #4CAF50',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSkipping
                        ? 'translateX(-10px) scale(0.99)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.8 : 1,
                      animation: !isSkipping ? 'slideInCard 0.6s ease-out 0.2s both' : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(15px) scale(0.98)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform: !isSkipping
                          ? 'translateY(-2px) scale(1.01)'
                          : 'translateX(-10px) scale(0.99)',
                        boxShadow: !isSkipping
                          ? '0 6px 20px rgba(76, 175, 80, 0.15)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        🚬 Rauchen
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          background: 'white',
                          border: '2px solid #4CAF50',
                          borderRadius: 3,
                          p: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {currentProfile.lifestyle.smoking === 'yes'
                          ? 'Ja'
                          : currentProfile.lifestyle.smoking === 'no'
                            ? 'Nein'
                            : currentProfile.lifestyle.smoking === 'sometimes'
                              ? 'Manchmal'
                              : currentProfile.lifestyle.smoking}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

              {/* Cannabis Card */}
              {currentProfile.lifestyle.cannabis &&
                currentProfile.lifestyle.cannabis !== 'not specified' && (
                  <Card
                    sx={{
                      background: 'white',
                      borderRadius: 4,
                      border: '2px solid #4CAF50',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSkipping
                        ? 'translateX(-5px) scale(0.995)'
                        : 'translateX(0) scale(1)',
                      opacity: isSkipping ? 0.9 : 1,
                      animation: !isSkipping ? 'slideInCard 0.6s ease-out 0.3s both' : 'none',
                      '@keyframes slideInCard': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(15px) scale(0.98)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0) scale(1)',
                        },
                      },
                      '&:hover': {
                        transform: !isSkipping
                          ? 'translateY(-2px) scale(1.01)'
                          : 'translateX(-5px) scale(0.995)',
                        boxShadow: !isSkipping
                          ? '0 6px 20px rgba(76, 175, 80, 0.15)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        🌿 Cannabis
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          background: 'white',
                          border: '2px solid #4CAF50',
                          borderRadius: 3,
                          p: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {currentProfile.lifestyle.cannabis === 'yes'
                          ? 'Ja'
                          : currentProfile.lifestyle.cannabis === 'no'
                            ? 'Nein'
                            : currentProfile.lifestyle.cannabis === 'sometimes'
                              ? 'Manchmal'
                              : currentProfile.lifestyle.cannabis}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
            </Box>
          </>
        ) : (
          <Card
            sx={{
              background: 'white',
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'secondary.main',
              mb: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                🎭 Profil wird geladen...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Lifestyle-Informationen werden geladen...
              </Typography>
            </CardContent>
          </Card>
        )}
        {/* Spacer for sticky buttons */}
        <Box sx={{ height: 120 }} />
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={navValue}
        onChange={handleNavChange}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          zIndex: 1001, // Higher than sticky buttons
          boxShadow: '0 -2px 15px rgba(0,0,0,0.04)',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: currentProfile?.accentColor || 'secondary.main',
            },
          },
        }}
      >
        <BottomNavigationAction icon={<HomeIcon />} sx={{ minWidth: 'auto' }} />
        <BottomNavigationAction icon={<FavoriteIcon />} sx={{ minWidth: 'auto' }} />
        <BottomNavigationAction icon={<ChatIcon />} sx={{ minWidth: 'auto' }} />
        <BottomNavigationAction icon={<SettingsIcon />} sx={{ minWidth: 'auto' }} />
      </BottomNavigation>
    </Box>
  );
};

export default OwnProfilePage;
