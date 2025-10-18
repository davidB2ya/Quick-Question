import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToGame, pressBuzzer } from '@/services/gameService';
import { useGameStore } from '@/store/gameStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Users, Target, Zap } from 'lucide-react';
import { getCategoryEmoji } from '@/lib/utils';

export const PlayerView: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { gameState, setGameState, playerId } = useGameStore();
  const [buzzerPressed, setBuzzerPressed] = useState(false);

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

  useEffect(() => {
    // Resetear el estado del buzzer cuando cambie el estado del juego
    if (gameState?.status !== 'waiting-for-buzzer') {
      setBuzzerPressed(false);
    }
  }, [gameState?.status]);

  const handlePressBuzzer = async () => {
    if (!gameId || !playerId || buzzerPressed) return;

    setBuzzerPressed(true);
    try {
      await pressBuzzer(gameId, playerId);
    } catch (error) {
      console.error('Error pressing buzzer:', error);
      setBuzzerPressed(false);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  const players = Object.values(gameState.players);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = playerId ? gameState.players[playerId] : null;
  const isMyTurn = gameState.currentPlayerTurn === playerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        {/* Header with Game Code */}
        <Card className="text-center">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-600">Código de Sala</h2>
            <div className="text-4xl font-extrabold text-primary-600 tracking-wider">
              {gameState.code}
            </div>
            {currentPlayer && (
              <p className="text-lg text-gray-700">
                Hola, <span className="font-bold">{currentPlayer.name}</span>!
              </p>
            )}
          </div>
        </Card>

        {/* Game Status */}
        {gameState.status === 'lobby' && (
          <Card className="text-center bg-yellow-50">
            <Users className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Esperando Jugadores...
            </h3>
            <p className="text-gray-600">
              {players.length} / {gameState.settings.maxPlayers} jugadores
            </p>
            <p className="text-sm text-gray-500 mt-2">
              El moderador iniciará el juego pronto
            </p>
          </Card>
        )}

        {/* Waiting for Buzzer */}
        {gameState.status === 'waiting-for-buzzer' && gameState.currentQuestion && (
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">
                    {getCategoryEmoji(gameState.currentQuestion.category)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-600 uppercase">
                      {gameState.currentQuestion.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ronda {gameState.round} / {gameState.settings.roundsPerGame}
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                  <Zap className="w-4 h-4 inline mr-2" />
                  ¡Buzzer Activo!
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-yellow-400">
                <Target className="w-6 h-6 text-yellow-600 mb-3" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {gameState.currentQuestion.question}
                </h3>
                
                {gameState.playersWaiting?.includes(playerId || '') ? (
                  <div className="bg-red-100 border border-red-400 rounded-lg p-4 mb-4">
                    <p className="text-red-700 font-semibold">
                      Ya intentaste responder esta pregunta. Espera a los demás jugadores.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 text-lg mb-4">
                      ¡Presiona el buzzer si sabes la respuesta!
                    </p>
                    <Button
                      onClick={handlePressBuzzer}
                      disabled={buzzerPressed}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl py-4"
                      size="lg"
                    >
                      <Zap className="w-8 h-8 mr-3" />
                      {buzzerPressed ? 'Buzzer Presionado!' : 'PRESIONAR BUZZER'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Current Question */}
        {gameState.status === 'playing' && gameState.currentQuestion && (
          <Card className={`${isMyTurn ? 'ring-4 ring-green-400' : ''}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">
                    {getCategoryEmoji(gameState.currentQuestion.category)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase">
                      {gameState.currentQuestion.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ronda {gameState.round} / {gameState.settings.roundsPerGame}
                    </div>
                  </div>
                </div>
                {isMyTurn && (
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                    {gameState.settings.turnMode === 'buzzer' ? '¡Presionaste primero!' : '¡Tu turno!'}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <Target className="w-6 h-6 text-primary-600 mb-3" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {gameState.currentQuestion.question}
                </h3>
                {isMyTurn ? (
                  <p className="text-gray-600 text-lg">
                    💡 Piensa bien tu respuesta y dila en voz alta al moderador
                  </p>
                ) : (
                  <p className="text-gray-600">
                    {gameState.settings.turnMode === 'buzzer' 
                      ? `${gameState.currentPlayerTurn && gameState.players?.[gameState.currentPlayerTurn]?.name} presionó el buzzer primero`
                      : `Turno de: ${gameState.currentPlayerTurn && gameState.players?.[gameState.currentPlayerTurn]?.name}`
                    }
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Game Finished */}
        {gameState.status === 'finished' && (
          <Card className="text-center bg-gradient-to-br from-yellow-100 to-yellow-200">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Juego Terminado!
            </h3>
            <div className="text-xl font-bold text-primary-600 mb-4">
              Ganador: {sortedPlayers[0]?.name}
            </div>
          </Card>
        )}

        {/* Scoreboard */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h3 className="text-2xl font-bold text-gray-800">Puntajes</h3>
          </div>
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  player.id === playerId
                    ? 'bg-primary-100 border-2 border-primary-500'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {player.name}
                      {player.id === playerId && (
                        <span className="ml-2 text-primary-600">(Tú)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {player.score}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
