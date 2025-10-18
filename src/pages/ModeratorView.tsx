import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToGame, startGame, updateCurrentQuestion, updatePlayerScore, nextRound, endGame, activateBuzzer, activateBuzzerManual, moderatorSelectPlayer, buzzerWrongAnswer, buzzerGiveUp } from '@/services/gameService';
import { generateQuestion } from '@/services/questionService';
import { useGameStore } from '@/store/gameStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Users, Play, Check, X, StopCircle, Zap, SkipForward, User, Eye } from 'lucide-react';
import { getCategoryEmoji } from '@/lib/utils';
// type import removed — not needed in this file

const getMedalEmoji = (index: number) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return '👤';
};

export const ModeratorView: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gameId) {
      navigate('/');
      return;
    }

    const unsubscribe = subscribeToGame(gameId, (game) => {
      if (!game) {
        navigate('/');
        return;
      }
      setGameState(game);
    });

    return unsubscribe;
  }, [gameId, navigate, setGameState]);

  const handleStartGame = async () => {
    if (!gameId || !gameState) return;
    
    setLoading(true);
    try {
      await startGame(gameId);
      await generateNewQuestion();
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error al iniciar el juego');
    } finally {
      setLoading(false);
    }
  };

  const generateNewQuestion = async () => {
    if (!gameId || !gameState) return;

    const players = Object.keys(gameState.players ?? {});
    if (players.length === 0) return;

    // Seleccionar categoría aleatoria
    const categories = gameState.settings.categories;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Generar pregunta con la dificultad del juego
    const question = await generateQuestion(randomCategory, gameState.settings.difficultyLevel);

    if (gameState.settings.turnMode === 'automatic') {
      // Modo automático: seleccionar jugador aleatorio
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      await updateCurrentQuestion(gameId, question, randomPlayer);
    } else {
      // Modo buzzer: mostrar pregunta y activar buzzer
      await updateCurrentQuestion(gameId, question, null);
      
      if (gameState.settings.buzzerMode === 'moderator-select') {
        await activateBuzzerManual(gameId);
      } else {
        await activateBuzzer(gameId);
      }
    }
  };

  const handleCorrectAnswer = async () => {
    if (!gameId || !gameState?.currentPlayerTurn) return;

    setLoading(true);
    try {
      await updatePlayerScore(gameId, gameState.currentPlayerTurn, 10);
      await handleNextQuestion();
    } catch (error) {
      console.error('Error updating score:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWrongAnswer = async () => {
    if (!gameId || !gameState) return;

    setLoading(true);
    try {
      if (gameState.settings.turnMode === 'buzzer') {
        await buzzerWrongAnswer(gameId);
        // Si todos fallaron, generar nueva pregunta después del delay
        const currentPlayer = gameState.buzzerPressed;
        const playersWaiting = gameState.playersWaiting || [];
        const allPlayers = Object.keys(gameState.players);
        const remainingPlayers = allPlayers.filter(p => !playersWaiting.includes(p) && p !== currentPlayer);
        
        if (remainingPlayers.length === 0) {
          // Todos fallaron, generar nueva pregunta
          const newRound = gameState.round + 1;
          if (newRound <= gameState.settings.roundsPerGame) {
            setTimeout(() => generateNewQuestion(), 1000);
          }
        }
      } else {
        await handleNextQuestion();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuzzerGiveUp = async () => {
    if (!gameId || !gameState) return;

    setLoading(true);
    try {
      await buzzerGiveUp(gameId);
      
      // Verificar si el juego no terminó para generar nueva pregunta
      const newRound = gameState.round + 1;
      if (newRound <= gameState.settings.roundsPerGame) {
        setTimeout(() => generateNewQuestion(), 1000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeratorSelectPlayer = async (playerId: string) => {
    if (!gameId) return;

    setLoading(true);
    try {
      await moderatorSelectPlayer(gameId, playerId);
    } catch (error) {
      console.error('Error selecting player:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!gameId || !gameState) return;

    await nextRound(gameId);
    
    // Si no se terminó el juego, generar nueva pregunta
    const newRound = gameState.round + 1;
    if (newRound <= gameState.settings.roundsPerGame) {
      setTimeout(() => generateNewQuestion(), 1000);
    }
  };

  const handleEndGame = async () => {
    if (!gameId) return;
    
    if (confirm('¿Estás seguro de finalizar el juego?')) {
      await endGame(gameId);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  const players = Object.values(gameState.players ?? {});
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        {/* Header */}
        <Card className="bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel del Moderador</h1>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-yellow-400">
                  Código: {gameState.code}
                </div>
                <div className="text-gray-400">
                  Ronda {gameState.round} / {gameState.settings.roundsPerGame}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  const spectatorUrl = `${globalThis.location.origin}/game/${gameId}/spectator`;
                  navigator.clipboard.writeText(spectatorUrl).then(() => {
                    alert('¡Link de espectador copiado al portapapeles!');
                  }).catch(() => {
                    prompt('Copia este link para compartir la vista de espectador:', spectatorUrl);
                  });
                }}
                variant="outline"
                size="sm"
                className="bg-green-600 border-green-500 text-white hover:bg-green-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Espectador
              </Button>
              {gameState.status === 'playing' && (
                <Button
                  onClick={handleEndGame}
                  variant="danger"
                  size="sm"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Finalizar Juego
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Lobby State */}
        {gameState.status === 'lobby' && (
          <Card className="bg-gray-800">
            <div className="text-center space-y-4">
              <Users className="w-16 h-16 mx-auto text-blue-400" />
              <h2 className="text-2xl font-bold">Esperando Jugadores</h2>
              <p className="text-gray-400">
                {players.length} / {gameState.settings.maxPlayers} jugadores conectados
              </p>
              <div className="space-y-2">
                {players.map((player) => (
                  <div key={player.id} className="bg-gray-700 rounded-lg p-3">
                    <span className="font-semibold">{player.name}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleStartGame}
                disabled={loading || players.length < 2}
                size="lg"
                className="w-full"
              >
                <Play className="w-5 h-5 mr-2" />
                {loading ? 'Iniciando...' : 'Iniciar Juego'}
              </Button>
              {players.length < 2 && (
                <p className="text-yellow-400 text-sm">
                  Se necesitan al menos 2 jugadores para iniciar
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Waiting for Buzzer State */}
        {gameState.status === 'waiting-for-buzzer' && gameState.currentQuestion && (
          <Card className="bg-gradient-to-br from-yellow-900 to-orange-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">
                    {getCategoryEmoji(gameState.currentQuestion.category)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-300 uppercase">
                      {gameState.currentQuestion.category}
                    </div>
                    <div className="text-sm text-gray-400">
                      Dificultad: {gameState.currentQuestion.difficulty}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full font-bold animate-pulse">
                    <Zap className="w-4 h-4 inline mr-2" />
                    {gameState.settings.buzzerMode === 'moderator-select' ? 'Selecciona Jugador' : 'Esperando Buzzer'}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-3xl font-bold mb-4">
                  {gameState.currentQuestion.question}
                </h3>
                
                {gameState.settings.buzzerMode === 'moderator-select' ? (
                  <div className="space-y-4">
                    <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4 mb-4">
                      <div className="text-sm font-semibold text-blue-300 mb-1">
                        Selecciona quién presionó el buzzer primero:
                      </div>
                      <div className="text-blue-200">
                        Haz clic en el jugador que levantó la mano o presionó su botón físico
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {players.map((player) => (
                        <Button
                          key={player.id}
                          onClick={() => handleModeratorSelectPlayer(player.id)}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                          size="lg"
                        >
                          <User className="w-5 h-5 mr-2" />
                          {player.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 mb-4">
                    <div className="text-sm font-semibold text-yellow-300 mb-1">
                      ¡Los jugadores pueden presionar el buzzer!
                    </div>
                    <div className="text-yellow-200">
                      El primer jugador en presionar podrá responder
                    </div>
                  </div>
                )}
                
                <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4">
                  <div className="text-sm font-semibold text-green-300 mb-1">
                    RESPUESTA CORRECTA:
                  </div>
                  <div className="text-2xl font-bold text-green-300">
                    {gameState.currentQuestion.answer}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleBuzzerGiveUp}
                  disabled={loading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                  size="lg"
                >
                  <SkipForward className="w-6 h-6 mr-2" />
                  Todos se Rinden
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Playing State */}
        {gameState.status === 'playing' && gameState.currentQuestion && (
          <>
            {/* Current Question */}
            <Card className="bg-gradient-to-br from-purple-900 to-blue-900">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">
                      {getCategoryEmoji(gameState.currentQuestion.category)}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-300 uppercase">
                        {gameState.currentQuestion.category}
                      </div>
                      <div className="text-sm text-gray-400">
                        Dificultad: {gameState.currentQuestion.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {gameState.settings.turnMode === 'buzzer' ? 'Jugador que presionó:' : 'Turno de:'}
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      {gameState.currentPlayerTurn && gameState.players?.[gameState.currentPlayerTurn]?.name}
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-3xl font-bold mb-4">
                    {gameState.currentQuestion.question}
                  </h3>
                  <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4">
                    <div className="text-sm font-semibold text-green-300 mb-1">
                      RESPUESTA CORRECTA:
                    </div>
                    <div className="text-2xl font-bold text-green-300">
                      {gameState.currentQuestion.answer}
                    </div>
                  </div>
                  {gameState.currentQuestion.funFact && (
                    <div className="mt-4 bg-blue-500/20 border border-blue-500 rounded-lg p-3">
                      <div className="text-sm font-semibold text-blue-300 mb-1">
                        💡 Dato curioso:
                      </div>
                      <div className="text-blue-200">
                        {gameState.currentQuestion.funFact}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCorrectAnswer}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Check className="w-6 h-6 mr-2" />
                    Respuesta Correcta (+10)
                  </Button>
                  <Button
                    onClick={handleWrongAnswer}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    size="lg"
                  >
                    <X className="w-6 h-6 mr-2" />
                    {gameState.settings.turnMode === 'buzzer' ? 'Incorrecta - Siguiente' : 'Respuesta Incorrecta'}
                  </Button>
                  {gameState.settings.turnMode === 'buzzer' && (
                    <Button
                      onClick={handleBuzzerGiveUp}
                      disabled={loading}
                      className="bg-gray-600 hover:bg-gray-700"
                      size="lg"
                    >
                      <SkipForward className="w-6 h-6 mr-2" />
                      Rendirse
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Scoreboard */}
            <Card className="bg-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl font-bold">Tabla de Posiciones</h3>
              </div>
              <div className="space-y-2">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.id === gameState.currentPlayerTurn
                        ? 'bg-green-900/50 border-2 border-green-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-xl font-semibold">{player.name}</div>
                        {player.id === gameState.currentPlayerTurn && (
                          <div className="text-sm text-green-400">Turno actual</div>
                        )}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {player.score}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Finished State */}
        {gameState.status === 'finished' && (
          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4">¡Juego Terminado!</h2>
            <div className="text-3xl font-bold mb-6">
              🏆 Ganador: {sortedPlayers[0]?.name}
            </div>
            <div className="bg-white/20 rounded-lg p-6 space-y-3">
              <h3 className="text-2xl font-bold mb-4">Resultados Finales</h3>
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMedalEmoji(index)}</span>
                    <span className="text-xl font-semibold">{player.name}</span>
                  </div>
                  <span className="text-2xl font-bold">{player.score} pts</span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              size="lg"
              className="mt-6 bg-white text-gray-800"
            >
              Volver al Inicio
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
