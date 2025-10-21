import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { CreateGamePage } from '@/pages/CreateGamePage';
import { PlayerView } from '@/pages/PlayerView';
import { ModeratorView } from '@/pages/ModeratorView';
import { SpectatorView } from '@/pages/SpectatorView';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateGamePage />} />
        <Route path="/game/:gameId/player" element={<PlayerView />} />
        <Route path="/game/:gameId/moderator" element={<ModeratorView />} />
        <Route path="/game/:gameId/spectator" element={<SpectatorView />} />
        {/* Catch all - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
