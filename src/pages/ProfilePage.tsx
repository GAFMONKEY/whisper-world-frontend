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
import { matchService } from '../services/matchService';
import type { DiscoverUser } from '../services/matchService';
import { getCurrentUser } from '../utils/setupUser';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(1); // Hearts tab aktiv
  const [profileIndex, setProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{
    categoryIndex: number;
    questionIndex: number;
  } | null>(null);
  const [showMatchMessage, setShowMatchMessage] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isActualMatch, setIsActualMatch] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const currentProfile = profiles[profileIndex];
  const totalProfiles = profiles.length;

  const user = getCurrentUser();

  useEffect(() => {
    const loadProfiles = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const discoveredUsers = await matchService.discoverUsers(user.id);
        setProfiles(discoveredUsers);

        if (discoveredUsers.length === 0) {
          setError('Keine neuen Profile verfügbar. Schaue später nochmal vorbei!');
        }
      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Fehler beim Laden der Profile. Bitte versuche es später nochmal.');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [user.id, navigate]);

  const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
    setNavValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        // Already on profile page
        break;
      case 2:
        navigate('/chats');
        break;
      case 3:
        navigate('/settings');
        break;
    }
  };
  
  function invertHexColor(hex, amount=70) {
    // Remove "#" if present
    if(!hex) {
      return '';
    }
    hex = hex.replace(/^#/, '');
    
    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Shift each channel up or down based on brightness
    const shift = (val) => {
      if (val > 127) return Math.max(0, val - amount); // darken bright colors
      else return Math.min(255, val + amount);         // brighten dark colors
    };
    
    r = shift(r);
    g = shift(g);
    b = shift(b);
    
    const toHex = (value) => value.toString(16).padStart(2, '0');
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  const handleSkip = async () => {
    if (!currentProfile || isSkipping) return;

    setIsSkipping(true);

    // Warte kurz, damit die Animation startet
    setTimeout(async () => {
      try {
        await matchService.passUser(user.id, currentProfile.id);
        console.log('Profil übersprungen:', currentProfile.name);
      } catch (error) {
        console.error('Error passing user:', error);
      }

      // Nach der Animation zum nächsten Profil
      setTimeout(() => {
        if (profileIndex < totalProfiles - 1) {
          setProfileIndex(profileIndex + 1);
          setShowMatchMessage(false);
          setIsActualMatch(false);
          setIsSkipping(false);
        } else {
          navigate('/dashboard');
        }
      }, 800); // Animation dauert 800ms für mehr Flüssigkeit
    }, 150);
  };

  const handleRequestMatch = async () => {
    if (!currentProfile || isMatching) return;

    try {
      setIsMatching(true);
      console.log('Match angefragt für:', currentProfile.name);

      const response = await matchService.likeUser(user.id, currentProfile.id);

      console.log('🔍 Like response:', response);
      console.log('📊 Current profile index:', profileIndex, 'Total profiles:', totalProfiles);
      console.log('👤 Current profile:', currentProfile.name);

      if (response.matched) {
        console.log("🎉 IT'S A MATCH! Redirecting to match success page...");
        setIsActualMatch(true);
        setShowMatchMessage(true);

        setTimeout(() => {
          setShowMatchMessage(false);
          console.log('Navigating to match success page with matchId:', response.matchId);
          navigate(
            `/match-success?matchId=${response.matchId || currentProfile.id}&partnerName=${encodeURIComponent(currentProfile.name)}`
          );
        }, 3000);
      } else {
        console.log('💌 Like sent, no match yet. Moving to next profile...');
        setIsActualMatch(false);
        setShowMatchMessage(true);

        setTimeout(() => {
          setShowMatchMessage(false);
          if (profileIndex < totalProfiles - 1) {
            console.log('Moving to next profile...');
            setProfileIndex(profileIndex + 1);
            setIsActualMatch(false);
          } else {
            console.log('⚠️ No more profiles, returning to dashboard');
            navigate('/dashboard');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error liking user:', error);
      setError('Fehler beim Senden des Likes. Versuche es nochmal.');
    } finally {
      setIsMatching(false);
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
          Profile werden geladen...
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
                🎭 Profil wird geladen...
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

        {/* Progress Indicator */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Profil {profileIndex + 1} von {totalProfiles} für heute
          </Typography>

          {profileIndex === totalProfiles - 1 && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: 'secondary.main',
                fontWeight: 600,
              }}
            >
              🔥 Letztes kostenloses Profil! Mehr mit Premium
            </Typography>
          )}

          {profileIndex < totalProfiles - 1 && (
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Du möchtest mehr entdecken?
            </Typography>
          )}

          {/* Progress Dots */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            {profiles.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor:
                    index === profileIndex
                      ? 'secondary.main'
                      : index < profileIndex
                        ? 'rgba(191, 169, 190, 0.6)' // Viewed profiles
                        : 'rgba(0,0,0,0.2)', // Unviewed profiles
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isSkipping
                    ? 'scale(0.8)'
                    : index === profileIndex
                      ? 'scale(1.2)'
                      : 'scale(1)',
                  opacity: isSkipping ? 0.5 : 1,
                  animation:
                    index === profileIndex && !isSkipping
                      ? 'pulse 2s ease-in-out infinite'
                      : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1.2)',
                      boxShadow: '0 0 0 0 rgba(191, 169, 190, 0.7)',
                    },
                    '50%': {
                      transform: 'scale(1.3)',
                      boxShadow: '0 0 0 4px rgba(191, 169, 190, 0)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Spacer for sticky buttons */}
        <Box sx={{ height: 120 }} />
      </Box>

      {/* Sticky Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          zIndex: 1000,
          pb: 7, // Space for bottom navigation
          pt: 2,
          px: 3,
          boxShadow: '0 -2px 20px rgba(0,0,0,0.05)',
          transform: isSkipping ? 'translateY(100px)' : 'translateY(0)',
          opacity: isSkipping ? 0.5 : 1,
          transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Button
            variant="contained"
            onClick={handleSkip}
            disabled={isSkipping}
            sx={{
              flex: 1,
              background: isSkipping
                ? 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)'
                : 'linear-gradient(135deg, #78909C 0%, #607D8B 100%)',
              color: 'white',
              borderRadius: 25,
              py: 2,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: isSkipping
                ? '0 4px 15px rgba(255, 112, 67, 0.4)'
                : '0 4px 12px rgba(120, 144, 156, 0.3)',
              border: '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isSkipping ? 'scale(0.95)' : 'scale(1)',
              '&:hover': {
                background: isSkipping
                  ? 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)'
                  : 'linear-gradient(135deg, #90A4AE 0%, #78909C 100%)',
                transform: isSkipping ? 'scale(0.95)' : 'translateY(-2px) scale(1.02)',
                boxShadow: isSkipping
                  ? '0 4px 15px rgba(255, 112, 67, 0.4)'
                  : '0 8px 25px rgba(120, 144, 156, 0.4)',
                border: '2px solid rgba(255,255,255,0.2)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)',
                color: 'white',
                opacity: 0.8,
              },
            }}
          >
            {profileIndex === totalProfiles - 1 ? 'Zurück zum Dashboard' : 'Überspringen'}
          </Button>

          <Button
            variant="contained"
            onClick={handleRequestMatch}
            disabled={isMatching || isSkipping}
            sx={{
              flex: 1,
              background: currentProfile?.accentColor
                ? `linear-gradient(135deg, ${currentProfile.accentColor} 0%, ${currentProfile.accentColor}CC 100%)`
                : 'linear-gradient(135deg, #BFA9BE 0%, #A693A1 100%)',
              color: 'white',
              borderRadius: 25,
              py: 2,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: currentProfile?.accentColor
                ? `0 4px 12px ${currentProfile.accentColor}40`
                : '0 4px 12px rgba(191, 169, 190, 0.3)',
              border: '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isSkipping ? 'scale(0.95)' : isMatching ? 'scale(1.05)' : 'scale(1)',
              animation: isMatching ? 'heartbeat 1.5s ease-in-out infinite' : 'none',
              '@keyframes heartbeat': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  boxShadow: currentProfile?.accentColor
                    ? `0 4px 12px ${currentProfile.accentColor}40`
                    : '0 4px 12px rgba(191, 169, 190, 0.3)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                  boxShadow: currentProfile?.accentColor
                    ? `0 8px 25px ${currentProfile.accentColor}60`
                    : '0 8px 25px rgba(191, 169, 190, 0.4)',
                },
              },
              '&:hover': {
                background:
                  !isSkipping && !isMatching
                    ? currentProfile?.accentColor
                      ? `linear-gradient(135deg, ${currentProfile.accentColor}DD 0%, ${currentProfile.accentColor}AA 100%)`
                      : 'linear-gradient(135deg, #A693A1 0%, #96818A 100%)'
                    : undefined,
                transform: !isSkipping && !isMatching ? 'translateY(-2px) scale(1.02)' : undefined,
                boxShadow:
                  !isSkipping && !isMatching
                    ? currentProfile?.accentColor
                      ? `0 8px 25px ${currentProfile.accentColor}60`
                      : '0 8px 25px rgba(191, 169, 190, 0.4)'
                    : undefined,
                border: '2px solid rgba(255,255,255,0.2)',
              },
              '&:disabled': {
                background: isSkipping
                  ? 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 100%)',
                transform: isSkipping ? 'scale(0.95)' : 'scale(1.05)',
                boxShadow: 'none',
                opacity: isSkipping ? 0.5 : 1,
              },
            }}
          >
            {isMatching ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                Sende Like...
              </Box>
            ) : isSkipping ? (
              <FavoriteBorderIcon sx={{ fontSize: 30, color: invertHexColor(currentProfile.accentColor)}} />
            ) : (
              <FavoriteIcon sx={{ fontSize: 30, color: invertHexColor(currentProfile.accentColor) }} />
            )}
          </Button>
        </Box>
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

      {/* Match Success Overlay */}
      {showMatchMessage && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: isActualMatch
              ? 'linear-gradient(135deg, rgba(248, 248, 250, 0.98) 0%, rgba(245, 245, 247, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(250, 250, 252, 0.98) 0%, rgba(247, 247, 249, 0.98) 100%)',
            color: '#2C2C2E',
            p: 4,
            zIndex: 1200,
            textAlign: 'center',
            animation: 'slideUpMatch 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            '@keyframes slideUpMatch': {
              '0%': {
                opacity: 0,
                transform: 'translateY(100%)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {/* Subtle Visual Accent - Instead of emojis */}
          <Box
            sx={{
              width: 4,
              height: 4,
              backgroundColor: isActualMatch ? '#BFA9BE' : '#A0A0A2',
              borderRadius: '50%',
              mb: 3,
              mx: 'auto',
              animation: 'gentlePulse 2s ease-in-out infinite',
              '@keyframes gentlePulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  opacity: 0.6,
                  boxShadow: '0 0 0 0 rgba(191, 169, 190, 0.4)',
                },
                '50%': {
                  transform: 'scale(1.5)',
                  opacity: 1,
                  boxShadow: '0 0 0 8px rgba(191, 169, 190, 0)',
                },
              },
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: '1.5rem',
              mb: 1,
              letterSpacing: '0.5px',
              color: '#1C1C1E',
            }}
          >
            {isActualMatch ? 'Match!' : 'Interesse gesendet'}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              opacity: 0.8,
              mb: 2,
              fontSize: '1.1rem',
              color: '#2C2C2E',
              lineHeight: 1.4,
            }}
          >
            {isActualMatch
              ? `${currentProfile?.name || 'Diese Person'} findet Sie ebenfalls interessant`
              : `${currentProfile?.name || 'Diese Person'} wurde benachrichtigt`}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              opacity: 0.6,
              mb: isActualMatch ? 3 : 2,
              fontSize: '0.95rem',
              color: '#48484A',
              lineHeight: 1.5,
            }}
          >
            {isActualMatch
              ? `Ihr könnt nun miteinander schreiben`
              : `Sie werden benachrichtigt, falls das Interesse erwidert wird`}
          </Typography>

          {isActualMatch && (
            <Typography
              variant="body2"
              sx={{
                opacity: 0.6,
                fontStyle: 'normal',
                fontSize: '0.9rem',
                color: '#6D6D70',
                animation: 'fadeInUp 1s ease-out 1s both',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 0.6, transform: 'translateY(0)' },
                },
              }}
            >
              Sie werden in Kürze weitergeleitet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProfilePage;
