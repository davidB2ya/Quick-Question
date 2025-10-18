import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Settings, ArrowLeft, Timer, Zap } from 'lucide-react';
import { createGame } from '@/services/gameService';
import { useGameStore } from '@/store/gameStore';
import type { CategoryType, TurnMode } from '@/types/game';

const CATEGORIES: { value: CategoryType; label: string; emoji: string }[] = [
  { value: 'deportes', label: 'Deportes', emoji: '⚽' },
  { value: 'musica', label: 'Música', emoji: '🎵' },
  { value: 'historia', label: 'Historia', emoji: '📜' },
  { value: 'ciencia', label: 'Ciencia', emoji: '🔬' },
  { value: 'entretenimiento', label: 'Entretenimiento', emoji: '🎬' },
  { value: 'geografia', label: 'Geografía', emoji: '🌍' },
];

export const CreateGamePage: React.FC = () => {
  const navigate = useNavigate();
  const { setGameId, setPlayerRole } = useGameStore();
  
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [roundsPerGame, setRoundsPerGame] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([
    'deportes',
    'musica',
    'historia',
  ]);
  const [turnMode, setTurnMode] = useState<TurnMode>('automatic');
  const [loading, setLoading] = useState(false);

  const handleCategoryToggle = (category: CategoryType) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCreateGame = async () => {
    setLoading(true);
    
    try {
      const moderatorId = `mod_${Date.now()}`;
      const gameId = await createGame(moderatorId, {
        maxPlayers,
        roundsPerGame,
        categories: selectedCategories,
      });

      setGameId(gameId);
      setPlayerRole('moderator');
      navigate(`/game/${gameId}/moderator`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error al crear la partida');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="mb-6 bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-800">Configurar Partida</h1>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Número de Jugadores
            </label>
            <div className="flex gap-2">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    maxPlayers === num
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {num} jugadores
                </button>
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Rondas por Partida: {roundsPerGame}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={roundsPerGame}
              onChange={(e) => setRoundsPerGame(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Categorías (mínimo 1)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryToggle(cat.value)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    selectedCategories.includes(cat.value)
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <div className="pt-4">
            <Button
              onClick={handleCreateGame}
              disabled={loading || selectedCategories.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creando...' : '🎮 Crear Partida'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
