import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
