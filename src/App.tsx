import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import MatchSuccessPage from './pages/MatchSuccessPage';
import NameAgePage from './pages/NameAgePage';
import GenderPreferencePage from './pages/GenderPreferencePage';
import DatingIntentionsPage from './pages/DatingIntentionsPage';
import LikertScalePage from './pages/LikertScalePage';
import LifestylePage from './pages/LifestylePage';
import MusicPage from './pages/MusicPage';
import HobbyPage from './pages/HobbyPage';
import ColorPickerPage from './pages/ColorPickerPage';
import OwnProfilePage from './pages/OwnProfilePage.tsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/match-success" element={<MatchSuccessPage />} />
          <Route path="/chats" element={<ChatListPage />} />
          <Route path="/chat/:matchId" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/name-age" element={<NameAgePage />} />
          <Route path="/gender-preference" element={<GenderPreferencePage />} />
          <Route path="/dating-intentions" element={<DatingIntentionsPage />} />
          <Route path="/likert-scale" element={<LikertScalePage />} />
          <Route path="/lifestyle" element={<LifestylePage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/hobbies" element={<HobbyPage />} />
          <Route path="/color-picker" element={<ColorPickerPage />} />
          <Route path="/own-profile" element={<OwnProfilePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
