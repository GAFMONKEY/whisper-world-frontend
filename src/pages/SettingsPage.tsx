import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    BottomNavigation,
    BottomNavigationAction,
    Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [navValue, setNavValue] = useState(3);

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

    const menuItems = [
        { title: 'Profil bearbeiten', description: 'Ändere deine Profilinformationen' },
        { title: 'Benachrichtigungen', description: 'Verwalte deine Benachrichtigungseinstellungen' },
        { title: 'Datenschutz', description: 'Datenschutz- und Sicherheitseinstellungen' },
        { title: 'Premium', description: 'Upgrade für mehr Features' },
        { title: 'Hilfe & Support', description: 'FAQ und Kontakt' },
        { title: 'Abmelden', description: 'Von deinem Konto abmelden' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F2EEE9', pb: 8 }}>
            <Box sx={{
                backgroundColor: 'white',
                borderBottom: '1px solid #DAA373',
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
                    Einstellungen
                </Typography>
            </Box>

            <Box sx={{ backgroundColor: 'white' }}>
                <List sx={{ p: 0 }}>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                '&:hover': { backgroundColor: '#f5f5f5' },
                                py: 2.5,
                                px: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <ListItemText
                                    primary={item.title}
                                    secondary={item.description}
                                    primaryTypographyProps={{
                                        variant: "body1",
                                        sx: { fontWeight: 500, color: 'text.primary', mb: 0.5 }
                                    }}
                                    secondaryTypographyProps={{
                                        variant: "body2",
                                        sx: { color: 'text.secondary', fontSize: '0.85rem' }
                                    }}
                                />
                                <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />
                            </ListItem>
                            {index < menuItems.length - 1 && (
                                <Divider sx={{ mx: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

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
                        '&.Mui-selected': { color: 'secondary.main' },
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

export default SettingsPage;
