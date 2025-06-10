import { createTheme } from '@mui/material/styles';

// Deine Custom Farben
const colors = {
    beige: '#F2EEE9',
    lila: '#BFA9BE',
    hellesOrange: '#DAA373',
    dunklesOrange: '#BB7D67',
};

export const theme = createTheme({
    palette: {
        primary: {
            main: colors.lila,
            light: colors.beige,
            dark: colors.dunklesOrange,
        },
        secondary: {
            main: colors.hellesOrange,
            dark: colors.dunklesOrange,
        },
        background: {
            default: colors.beige,
            paper: colors.beige,
        },
        text: {
            primary: '#2c2c2c',
            secondary: '#5a5a5a',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '1rem',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 25,
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '12px 24px',
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
    },
});
