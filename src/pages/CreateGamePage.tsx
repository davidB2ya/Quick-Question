import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NavigationBar } from '@/components/ui/NavigationBar';
import { Settings, Timer, Zap, User, Gamepad2, Brain, Star, Award } from 'lucide-react';
import { createGame } from '@/services/gameService';
import { useGameStore } from '@/store/gameStore';
import type { CategoryType, TurnMode, DifficultyLevel, BuzzerMode, GameSettings } from '@/types/game';

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
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('medium');
  const [buzzerMode, setBuzzerMode] = useState<BuzzerMode>('player-press');
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
      
      // Construir settings sin propiedades undefined
      const settings: GameSettings = {
        maxPlayers,
        roundsPerGame,
        categories: selectedCategories,
        turnMode,
        difficultyLevel,
      };
      
      // Solo agregar buzzerMode si el modo es 'buzzer'
      if (turnMode === 'buzzer') {
        settings.buzzerMode = buzzerMode;
      }
      
      const gameId = await createGame(moderatorId, settings);

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
      <NavigationBar showHome showBack transparent />
      
      <div className="max-w-2xl mx-auto py-8">

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

          {/* Difficulty Level */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Nivel de Dificultad
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setDifficultyLevel('easy')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all flex flex-col items-center gap-2 ${
                  difficultyLevel === 'easy'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Star className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-bold">Fácil</div>
                  <div className="text-xs opacity-80">Preguntas básicas</div>
                </div>
              </button>
              <button
                onClick={() => setDifficultyLevel('medium')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all flex flex-col items-center gap-2 ${
                  difficultyLevel === 'medium'
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Brain className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-bold">Medio</div>
                  <div className="text-xs opacity-80">Conocimiento general</div>
                </div>
              </button>
              <button
                onClick={() => setDifficultyLevel('hard')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all flex flex-col items-center gap-2 ${
                  difficultyLevel === 'hard'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Award className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-bold">Difícil</div>
                  <div className="text-xs opacity-80">Para expertos</div>
                </div>
              </button>
            </div>
          </div>

          {/* Turn Mode */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Modo de Turnos
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setTurnMode('automatic')}
                className={`py-4 px-4 rounded-lg font-semibold transition-all flex items-center gap-3 ${
                  turnMode === 'automatic'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Timer className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Turnos Automáticos</div>
                  <div className="text-sm opacity-80">
                    El moderador asigna turnos automáticamente
                  </div>
                </div>
              </button>
              <button
                onClick={() => setTurnMode('buzzer')}
                className={`py-4 px-4 rounded-lg font-semibold transition-all flex items-center gap-3 ${
                  turnMode === 'buzzer'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Zap className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Modo Buzzer</div>
                  <div className="text-sm opacity-80">
                    Sistema de respuesta rápida con botones
                  </div>
                </div>
              </button>
            </div>

            {/* Buzzer Mode Options */}
            {turnMode === 'buzzer' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-semibold text-blue-800 mb-3">
                  Tipo de Buzzer:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setBuzzerMode('player-press')}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center gap-3 text-sm ${
                      buzzerMode === 'player-press'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-300'
                    }`}
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-bold">Jugadores Presionan</div>
                      <div className="text-xs opacity-80">
                        Los jugadores presionan el botón en pantalla
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setBuzzerMode('moderator-select')}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center gap-3 text-sm ${
                      buzzerMode === 'moderator-select'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-300'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-bold">Moderador Elige</div>
                      <div className="text-xs opacity-80">
                        El moderador selecciona quién presionó primero
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
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
