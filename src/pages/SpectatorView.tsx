import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Trophy, Clock, Target, Gamepad2, Eye, Zap } from 'lucide-react';
import { GameState } from '../types/game';
import { subscribeToGame } from '../services/gameService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SpectatorView: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!gameId) {
      setError('ID de juego no válido');
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToGame(gameId, (updatedGameState: GameState | null) => {
      if (updatedGameState) {
        setGameState(updatedGameState);
        setError(null);
      } else {
        setError('Juego no encontrado');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  // Timer para preguntas con tiempo límite
  useEffect(() => {
    if (gameState?.settings.timePerQuestion && gameState.status === 'playing' && gameState.currentQuestion) {
      setTimeLeft(gameState.settings.timePerQuestion);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev > 0) {
            return prev - 1;
          }
          return null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState?.currentQuestion?.id, gameState?.settings.timePerQuestion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Conectando al juego...</p>
        </div>
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} className="w-full">
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  const sortedPlayers = Object.values(gameState.players).sort((a, b) => b.score - a.score);
  const currentPlayer = gameState.currentPlayerTurn ? gameState.players[gameState.currentPlayerTurn] : null;

  const getStatusMessage = () => {
    switch (gameState.status) {
      case 'lobby':
        return 'Esperando que comience el juego...';
      case 'playing':
        return gameState.settings.turnMode === 'buzzer' ? 'Esperando respuesta...' : `Turno de ${currentPlayer?.name || 'Jugador'}`;
      case 'waiting-for-buzzer':
        return '¡Presiona el buzzer para responder!';
      case 'finished':
        return '¡Juego terminado!';
      default:
        return 'Estado desconocido';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      deportes: <Trophy className="w-5 h-5" />,
      historia: <Clock className="w-5 h-5" />,
      ciencia: <Target className="w-5 h-5" />,
      geografia: <Gamepad2 className="w-5 h-5" />,
      entretenimiento: <Eye className="w-5 h-5" />,
      musica: <Zap className="w-5 h-5" />
    };
    return icons[category] || <Target className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            Quick Question
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl text-blue-200">
            <Eye className="w-6 h-6" />
            <span>Vista de Espectador</span>
          </div>
          <p className="text-lg text-blue-200 mt-1">Código: {gameState.code}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pregunta Actual - Ocupa 2 columnas en pantallas grandes */}
          <div className="xl:col-span-2">
            <Card className="p-6 h-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {gameState.currentQuestion && getCategoryIcon(gameState.currentQuestion.category)}
                    <span className="text-lg font-semibold capitalize">
                      {gameState.currentQuestion?.category || 'Sin categoría'}
                    </span>
                  </div>
                  {gameState.currentQuestion && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(gameState.currentQuestion.difficulty)}`}>
                      {gameState.currentQuestion.difficulty.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Timer */}
                {timeLeft !== null && (
                  <div className="mb-4">
                    <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                      {timeLeft}s
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${((timeLeft / (gameState.settings.timePerQuestion || 30)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Estado del juego */}
                <div className="mb-6">
                  <span className="text-lg text-gray-600">{getStatusMessage()}</span>
                </div>

                {/* Pregunta */}
                {gameState.currentQuestion ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
                      {gameState.currentQuestion.question}
                    </h2>
                    
                    {/* Información del buzzer si aplica */}
                    {gameState.settings.turnMode === 'buzzer' && gameState.buzzerPressed && (
                      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
                        <p className="text-yellow-800 font-semibold">
                          🔥 {gameState.players[gameState.buzzerPressed]?.name} presionó el buzzer!
                        </p>
                      </div>
                    )}

                    {/* Nota: Las respuestas NO se muestran en la vista de espectador */}
                    <div className="text-sm text-gray-500 italic mt-4">
                      * La respuesta solo es visible para el moderador
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 mb-4">
                    <p className="text-xl text-gray-600">
                      {gameState.status === 'lobby' ? 'El juego comenzará pronto...' : 'No hay pregunta activa'}
                    </p>
                  </div>
                )}

                {/* Información del juego */}
                <div className="flex justify-center gap-4 text-sm text-gray-600">
                  <span>Ronda: {gameState.round}</span>
                  <span>•</span>
                  <span>Jugadores: {Object.keys(gameState.players).length}</span>
                  <span>•</span>
                  <span>Modo: {gameState.settings.turnMode === 'buzzer' ? 'Buzzer' : 'Automático'}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="xl:col-span-1">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold">Jugadores</h3>
              </div>
              
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      player.id === gameState.currentPlayerTurn 
                        ? 'bg-blue-100 border-2 border-blue-300 transform scale-105' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        (() => {
                          if (index === 0) return 'bg-yellow-500';
                          if (index === 1) return 'bg-gray-400';
                          if (index === 2) return 'bg-orange-500';
                          return 'bg-blue-500';
                        })()
                      }`}>
                        {index === 0 ? '🏆' : index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{player.name}</p>
                        {player.id === gameState.currentPlayerTurn && (
                          <p className="text-xs text-blue-600 font-medium">En turno</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{player.score}</p>
                      <p className="text-xs text-gray-500">puntos</p>
                    </div>
                  </div>
                ))}
                
                {sortedPlayers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No hay jugadores aún
                  </p>
                )}
              </div>

              {/* Configuración del juego */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2 text-gray-700">Configuración</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Dificultad: <span className="font-medium capitalize">{gameState.settings.difficultyLevel}</span></p>
                  <p>Modo: <span className="font-medium">{gameState.settings.turnMode === 'buzzer' ? 'Buzzer' : 'Automático'}</span></p>
                  <p>Rondas: <span className="font-medium">{gameState.settings.roundsPerGame}</span></p>
                  {gameState.settings.timePerQuestion && (
                    <p>Tiempo: <span className="font-medium">{gameState.settings.timePerQuestion}s</span></p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Salir de la vista de espectador
          </Button>
        </div>
      </div>
    </div>
  );
};