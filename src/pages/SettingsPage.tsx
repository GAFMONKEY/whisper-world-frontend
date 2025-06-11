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
    const [navValue, setNavValue] = useState(3); // Settings tab aktiv

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
                navigate('/matches');
                break;
            case 3:
                // Already on settings page
                break;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleMenuClick = (item: string) => {
        if (item === 'logout') {
            handleLogout();
        } else {
            console.log(`${item} clicked - TODO: Implement`);
        }
    };

    const menuItems = [
        { key: 'profile', label: 'Profil bearbeiten', action: () => handleMenuClick('profile') },
        { key: 'notifications', label: 'Benachrichtigungen', action: () => handleMenuClick('notifications') },
        { key: 'privacy', label: 'Datenschutz', action: () => handleMenuClick('privacy') },
        { key: 'help', label: 'Hilfe', action: () => handleMenuClick('help') },
        { key: 'logout', label: 'Logout', action: () => handleMenuClick('logout') },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                pb: 8, // Platz für Bottom Navigation
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, pt: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        textAlign: 'center',
                        mb: 3,
                    }}
                >
                    Einstellungen
                </Typography>
            </Box>

            {/* Menu Items */}
            <Box sx={{ px: 2 }}>
                <List sx={{ backgroundColor: 'transparent' }}>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.key}>
                            <ListItem
                                onClick={item.action}
                                sx={{
                                    cursor: 'pointer',
                                    py: 2.5,
                                    px: 3,
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(218, 163, 115, 0.1)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '1.1rem',
                                        fontWeight: 500,
                                        color: 'text.primary',
                                    }}
                                />
                                <ChevronRightIcon
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '1.5rem',
                                    }}
                                />
                            </ListItem>
                            {index < menuItems.length - 1 && (
                                <Divider
                                    sx={{
                                        mx: 3,
                                        borderColor: 'rgba(0,0,0,0.1)'
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </List>
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
                    icon={<HomeIcon />}
                    sx={{ minWidth: 'auto' }}
                />
                <BottomNavigationAction
                    icon={<FavoriteIcon />}
                    sx={{ minWidth: 'auto' }}
                />
                <BottomNavigationAction
                    icon={<ChatIcon />}
                    sx={{ minWidth: 'auto' }}
                />
                <BottomNavigationAction
                    icon={<SettingsIcon />}
                    sx={{ minWidth: 'auto' }}
                />
            </BottomNavigation>
        </Box>
    );
};

export default SettingsPage;
