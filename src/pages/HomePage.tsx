import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Sparkles, Users, Gamepad2 } from 'lucide-react';
import { joinGame } from '@/services/gameService';
import { useGameStore } from '@/store/gameStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setGameId, setPlayerId, setPlayerRole } = useGameStore();

  const handleJoinGame = async () => {
    if (!roomCode.trim() || !playerName.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await joinGame(roomCode.toUpperCase(), playerName);
      
      if (!result) {
        setError('No se encontró la partida. Verifica el código.');
        setLoading(false);
        return;
      }

      setGameId(result.gameId);
      setPlayerId(result.playerId);
      setPlayerRole('player');
      navigate(`/game/${result.gameId}/player`);
    } catch (err: any) {
      setError(err.message || 'Error al unirse a la partida');
      setLoading(false);
    }
  };

  const handleCreateGame = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-2xl">
              <Sparkles className="w-16 h-16 text-primary-600" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-2">
            Quick Question
          </h1>
          <p className="text-xl text-white/90">
            ¡Trivia divertida para jóvenes! 🎉
          </p>
        </div>

        {/* Join Game Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800">Unirse a Partida</h2>
          </div>

          <Input
            label="Tu Nombre"
            placeholder="Ingresa tu nombre"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />

          <Input
            label="Código de Sala"
            placeholder="Ej: ABC123"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleJoinGame}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Uniéndose...' : 'Unirse al Juego'}
          </Button>
        </Card>

        {/* Create Game Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Crear Partida</h2>
          </div>
          <p className="text-gray-600">
            ¿Eres el moderador? Crea una nueva partida y comparte el código con tus amigos.
          </p>
          <Button
            onClick={handleCreateGame}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            Crear Nueva Partida
          </Button>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm">
          De 2 a 4 jugadores · Preguntas generadas por IA
        </p>
      </div>
    </div>
  );
};
