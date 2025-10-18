import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { CreateGamePage } from '@/pages/CreateGamePage';
import { PlayerView } from '@/pages/PlayerView';
import { ModeratorView } from '@/pages/ModeratorView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateGamePage />} />
        <Route path="/game/:gameId/player" element={<PlayerView />} />
        <Route path="/game/:gameId/moderator" element={<ModeratorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
