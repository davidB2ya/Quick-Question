import { database } from '@/lib/firebase';
import { ref, set, push, onValue, update, off, get } from 'firebase/database';
import type { GameState, Player, Question, GameSettings, CategoryType } from '@/types/game';

// Generar código de sala único
export const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Crear nueva partida
export const createGame = async (
  moderatorId: string,
  settings: GameSettings
): Promise<string> => {
  const gamesRef = ref(database, 'games');
  const newGameRef = push(gamesRef);
  const gameId = newGameRef.key!;
  const code = generateRoomCode();

  const gameState: GameState = {
    id: gameId,
    code,
    players: {},
    currentQuestion: null,
    currentPlayerTurn: null,
    round: 0,
    status: 'lobby',
    createdAt: Date.now(),
    moderatorId,
    settings,
  };

  await set(newGameRef, gameState);
  return gameId;
};

// Unirse a una partida
export const joinGame = async (
  code: string,
  playerName: string
): Promise<{ gameId: string; playerId: string } | null> => {
  const gamesRef = ref(database, 'games');
  const snapshot = await get(gamesRef);

  if (!snapshot.exists()) return null;

  const games = snapshot.val();
  const gameEntry = Object.entries(games).find(
    ([_, game]: [string, any]) => game.code === code && game.status === 'lobby'
  );

  if (!gameEntry) return null;

  const [gameId, game] = gameEntry as [string, GameState];
  const playerCount = Object.keys(game.players || {}).length;

  if (playerCount >= game.settings.maxPlayers) {
    throw new Error('La partida está llena');
  }

  const playerId = push(ref(database, `games/${gameId}/players`)).key!;
  const newPlayer: Player = {
    id: playerId,
    name: playerName,
    score: 0,
    isActive: true,
  };

  await update(ref(database, `games/${gameId}/players/${playerId}`), newPlayer);

  return { gameId, playerId };
};

// Escuchar cambios en la partida
export const subscribeToGame = (
  gameId: string,
  callback: (game: GameState | null) => void
) => {
  const gameRef = ref(database, `games/${gameId}`);
  onValue(gameRef, (snapshot) => {
    callback(snapshot.val());
  });

  return () => off(gameRef);
};

// Iniciar partida
export const startGame = async (gameId: string): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    status: 'playing',
    round: 1,
  });
};

// Actualizar pregunta actual
export const updateCurrentQuestion = async (
  gameId: string,
  question: Question,
  playerTurnId: string
): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    currentQuestion: question,
    currentPlayerTurn: playerTurnId,
  });
};

// Actualizar puntaje de jugador
export const updatePlayerScore = async (
  gameId: string,
  playerId: string,
  points: number
): Promise<void> => {
  const playerRef = ref(database, `games/${gameId}/players/${playerId}`);
  const snapshot = await get(playerRef);
  
  if (snapshot.exists()) {
    const currentScore = snapshot.val().score || 0;
    await update(playerRef, {
      score: currentScore + points,
    });
  }
};

// Avanzar a la siguiente ronda
export const nextRound = async (gameId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val() as GameState;
    const newRound = game.round + 1;
    
    if (newRound > game.settings.roundsPerGame) {
      await update(gameRef, {
        status: 'finished',
        currentQuestion: null,
        currentPlayerTurn: null,
      });
    } else {
      await update(gameRef, {
        round: newRound,
        currentQuestion: null,
        currentPlayerTurn: null,
      });
    }
  }
};

// Finalizar partida
export const endGame = async (gameId: string): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    status: 'finished',
  });
};
