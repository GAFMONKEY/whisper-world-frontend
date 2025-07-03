import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { chatService, userService } from '../services';
import type { ChatConversation } from '../services';
import { getCurrentUser } from '../utils/setupUser';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const {matchId} = useParams();
  const [searchParams] = useSearchParams();
  const startWith = searchParams.get('startWith');
  const [navValue, setNavValue] = useState(2);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showNewMessageNotification, setShowNewMessageNotification] = useState(false);
  const intervalRef = useRef<number>(undefined);
  const [isAudioPlayback, setIsAudioPlayback] = useState(false);
  const audioRef = useRef(new Audio("/voice-message/voice-message.mp3"));
  const [chatPartnerUser, setChatPartnerUser] = useState<any>(null);
  
  const user = getCurrentUser();
  useEffect(() => {
    const loadConversation = async () => {
      if (!matchId || !user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const conv = await chatService.getChatConversation(matchId, user.id);
        const otherUser = await userService.getUserProfile(conv.otherUser.id);
        setChatPartnerUser(otherUser);
        setConversation(conv);
      } catch (err) {
        console.error('Error loading conversation:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
  }, [matchId, user.id, startWith]);
  
  useEffect(() => {
    if (conversation && startWith) {
      if (startWith === 'voice') {
        setTimeout(() => {
          handleVoiceRecording();
        }, 1000);
      } else if (startWith === 'text') {
        setTimeout(() => {
          const textInput = document.querySelector('#message-input') as HTMLInputElement;
          if (textInput) {
            textInput.focus();
            textInput.placeholder = `Hi ${conversation.otherUser.name}! Schreib deine erste Nachricht...`;
          }
        }, 500);
      }
    }
  }, [conversation, startWith]);
  
  useEffect(() => {
    const handleMockMessage = (event: CustomEvent) => {
      const {matchId: eventMatchId, message} = event.detail;
      if (eventMatchId === matchId) {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          setConversation(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, message],
              lastMessage: message,
              unreadCount: prev.unreadCount + 1
            };
          });
          
          setShowNewMessageNotification(true);
          setTimeout(() => setShowNewMessageNotification(false), 3000);
        }, 1500);
      }
    };
    
    window.addEventListener('newMockMessage', handleMockMessage as EventListener);
    return () => {
      window.removeEventListener('newMockMessage', handleMockMessage as EventListener);
    };
  }, [matchId]);
  
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
        navigate('/settings');
        break;
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !conversation || !matchId || sending) return;
    
    try {
      setSending(true);
      
      console.log('📤 Sending message:', message);
      
      const newMessage = await chatService.sendMessage({
        matchId: matchId!,
        senderId: user.id,
        content: message.trim(),
        type: 'TEXT',
      });
      
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: newMessage
        };
      });
      
      setMessage('');
      
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };
  
  const handleVoiceRecording = async () => {
    if (isRecording) {
      clearInterval(intervalRef.current);
      setIsRecording(false);
      setRecordingDuration(0);
      
      try {
        setSending(true);
        const voiceMessage = await chatService.sendMessage({
          matchId: matchId!,
          senderId: user.id,
          content: 'Sprachnachricht',
          duration: recordingDuration,
          type: 'VOICE'
        });
        
        setConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, voiceMessage],
            lastMessage: voiceMessage
          };
        });
        
      } catch (err) {
        console.error('Error sending voice message:', err);
      } finally {
        setSending(false);
      }
    } else {
      setIsRecording(true);
      setRecordingDuration(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 30) {
            handleVoiceRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleVoicePlayback = () => {
    if (isAudioPlayback) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsAudioPlayback(false);
    } else {
      audioRef.current.play();
      setIsAudioPlayback(true);
    }
  }
  
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
        <CircularProgress size={60} sx={{color: 'secondary.main'}}/>
        <Typography variant="body1" sx={{color: 'text.secondary'}}>
          Chat wird geladen...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        '& @keyframes typing': {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
            opacity: 0.4,
          },
          '30%': {
            transform: 'translateY(-10px)',
            opacity: 1,
          },
        },
        '& @keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
          },
          '70%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
          },
        },
        '& @keyframes slideDown': {
          '0%': {
            transform: 'translateX(-50%) translateY(-100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateX(-50%) translateY(0)',
            opacity: 1,
          },
        },
      }}
    >
      {/* New Message Notification */}
      {showNewMessageNotification && (
        <Box
          sx={{
            position: 'fixed',
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'success.main',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 25,
            boxShadow: 3,
            zIndex: 1000,
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          <Typography variant="body2" sx={{fontWeight: 600}}>
            📱 Neue Nachricht von {conversation?.otherUser.name}
          </Typography>
        </Box>
      )}
      
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: chatPartnerUser.accentColor??'secondary.main',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/chats')}
            sx={{mr: 2}}
          >
            <ArrowBackIcon/>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1, fontWeight: 600}}>
            {conversation?.otherUser.name}, {conversation?.otherUser.age}
          </Typography>
          {conversation?.otherUser.isOnline && (
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                mr: 1,
              }}
            />
          )}
        </Toolbar>
      </AppBar>
      
      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          pb: 10,
        }}
      >
        {conversation?.messages && conversation?.messages.length > 0 ? (
          conversation?.messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Card
                sx={{
                  maxWidth: '70%',
                  backgroundColor: msg.senderId === user.id
                    ? 'secondary.main'
                    : 'rgba(255, 255, 255, 0.9)',
                  color: msg.senderId === user.id ? 'white' : 'text.primary',
                  borderRadius: 3,
                  border: msg.senderId !== user.id ? '1px solid rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                  {msg.type === 'TEXT' && (
                    <Typography variant="body1">
                      {msg.content}
                    </Typography>
                  )}
                  {msg.type === 'VOICE' && (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      <IconButton size="small" sx={{color: 'inherit'}} onClick={handleVoicePlayback}>
                        <MicIcon/>
                      </IconButton>
                      <Typography variant="body2">
                        Sprachnachricht ({msg.audioDuration || 0}s)
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatTime(msg.timestamp)}
                    {msg.senderId === user.id && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: msg.isRead ? '#4CAF50' : '#FFC107',
                          ml: 0.5,
                        }}
                        title={msg.isRead ? 'Gelesen' : 'Zugestellt'}
                      />
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Box sx={{textAlign: 'center', py: 4}}>
            <Typography variant="body1" sx={{color: 'text.secondary', mb: 2}}>
              🎉 Es ist ein Match!
            </Typography>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
              Startet die Unterhaltung mit {conversation?.otherUser.name}!
            </Typography>
          </Box>
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mb: 2,
            }}
          >
            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'text.primary',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.1)',
                px: 2,
                py: 1,
              }}
            >
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                  {conversation?.otherUser.name} schreibt
                </Typography>
                <Box sx={{display: 'flex', gap: 0.5}}>
                  <Box
                    key="typing-dot-1"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'text.secondary',
                      animation: 'typing 1.4s infinite ease-in-out',
                      animationDelay: '0s',
                    }}
                  />
                  <Box
                    key="typing-dot-2"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'text.secondary',
                      animation: 'typing 1.4s infinite ease-in-out',
                      animationDelay: '0.2s',
                    }}
                  />
                  <Box
                    key="typing-dot-3"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'text.secondary',
                      animation: 'typing 1.4s infinite ease-in-out',
                      animationDelay: '0.4s',
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Box>
        )}
      </Box>
      {/* Message Input */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 56,
          left: 0,
          right: 0,
          backgroundColor: 'background.default',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          p: 2,
        }}
      >
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
          <TextField
            id="message-input"
            fullWidth
            placeholder={`Nachricht an ${conversation?.otherUser.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 25,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          />
          <IconButton
            onClick={handleVoiceRecording}
            disabled={sending}
            sx={{
              backgroundColor: isRecording ? '#f44336' : 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: isRecording ? '#d32f2f' : 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: 'rgba(0,0,0,0.3)',
              },
              animation: isRecording ? 'pulse 1s infinite' : 'none',
            }}
          >
            <MicIcon/>
            {isRecording && recordingDuration > 0 && (
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#f44336',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                {recordingDuration}s
              </Typography>
            )}
          </IconButton>
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            sx={{
              backgroundColor: chatPartnerUser.accentColor??'secondary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: chatPartnerUser.accentColor??'secondary.dark',
              },
              '&:disabled': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: 'rgba(0,0,0,0.3)',
              },
            }}
          >
            {sending ? <CircularProgress size={20}/> : <SendIcon/>}
          </IconButton>
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
          backgroundColor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'secondary.main',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'secondary.main',
            },
          },
        }}
      >
        <BottomNavigationAction
          icon={<HomeIcon/>}
          sx={{minWidth: 'auto'}}
        />
        <BottomNavigationAction
          icon={<FavoriteIcon/>}
          sx={{minWidth: 'auto'}}
        />
        <BottomNavigationAction
          icon={<ChatIcon/>}
          sx={{minWidth: 'auto'}}
        />
        <BottomNavigationAction
          icon={<SettingsIcon/>}
          sx={{minWidth: 'auto'}}
        />
      </BottomNavigation>
    </Box>
  );
};

export default ChatPage;
