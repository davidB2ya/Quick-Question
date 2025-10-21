import { database } from '@/lib/firebase';
import { ref, set, push, onValue, update, off, get } from 'firebase/database';
import type { GameState, Player, Question, GameSettings } from '@/types/game';

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

  // Verificar límite de jugadores (solo si no es ilimitado, -1 representa sin límite)
  const maxPlayers = Number(game.settings.maxPlayers);
  if (maxPlayers !== -1 && playerCount >= maxPlayers) {
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

// Verificar que existe un juego sin unirse (para espectadores)
export const verifyGameExists = async (
  code: string
): Promise<{ gameId: string } | null> => {
  const gamesRef = ref(database, 'games');
  const snapshot = await get(gamesRef);

  if (!snapshot.exists()) return null;

  const games = snapshot.val();
  const gameEntry = Object.entries(games).find(
    ([_, game]: [string, any]) => game.code === code
  );

  if (!gameEntry) return null;

  const [gameId] = gameEntry as [string, GameState];
  return { gameId };
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
  playerTurnId: string | null
): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    currentQuestion: question,
    currentPlayerTurn: playerTurnId,
    firstBuzzerPress: false, // Nueva pregunta = reset del tracking de buzzer
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
    // Permitir puntajes negativos, pero el score final nunca será menor a 0
    const newScore = Math.max(0, currentScore + points);
    await update(playerRef, {
      score: newScore,
    });
  }
};

// Calcular puntos según el orden de BUZZER (no de respuestas correctas)
// En modo buzzer: solo el PRIMERO en presionar el buzzer puede ganar +10
// En modo automático: el primero de cada ronda gana +10
export const calculatePointsForCorrectAnswer = (
  isFirstBuzzerPress: boolean,
  correctAnswersCount: number
): number => {
  // En modo buzzer: solo el primero en presionar puede ganar +10
  // En modo automático: el primero en responder correctamente gana +10
  if (isFirstBuzzerPress && correctAnswersCount === 0) {
    return 10;
  }
  // Todos los demás: +8 puntos
  return 8;
};

// Puntos por respuesta incorrecta
export const WRONG_ANSWER_PENALTY = -5;

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
        correctAnswersThisRound: [],
        firstBuzzerPress: false,
      });
    } else {
      await update(gameRef, {
        round: newRound,
        currentQuestion: null,
        currentPlayerTurn: null,
        correctAnswersThisRound: [],
        firstBuzzerPress: false,
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

// Activar modo buzzer (esperar a que los jugadores presionen)
export const activateBuzzer = async (gameId: string): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    status: 'waiting-for-buzzer',
    buzzerPressed: null,
    playersWaiting: [],
    correctAnswersThisRound: [], // Reset de respuestas correctas
    firstBuzzerPress: false, // Reset: nadie ha presionado aún
  });
};

// Jugador presiona buzzer
export const pressBuzzer = async (gameId: string, playerId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val() as GameState;
    
    // Si no hay nadie que haya presionado aún, este jugador es el primero
    if (!game.buzzerPressed && game.status === 'waiting-for-buzzer') {
      await update(gameRef, {
        buzzerPressed: playerId,
        currentPlayerTurn: playerId,
        status: 'playing',
        firstBuzzerPress: true, // Marcar que ya alguien presionó primero
      });
    }
  }
};

// Respuesta incorrecta en modo buzzer - pasar al siguiente
export const buzzerWrongAnswer = async (gameId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val() as GameState;
    const currentPlayer = game.buzzerPressed;
    const playersWaiting = game.playersWaiting || [];
    
    // Penalizar al jugador que respondió incorrectamente
    if (currentPlayer) {
      await updatePlayerScore(gameId, currentPlayer, WRONG_ANSWER_PENALTY);
    }
    
    // Agregar el jugador actual a la lista de espera (ya intentó)
    if (currentPlayer && !playersWaiting.includes(currentPlayer)) {
      playersWaiting.push(currentPlayer);
    }
    
    // Verificar si quedan jugadores por intentar
    const allPlayers = Object.keys(game.players);
    const remainingPlayers = allPlayers.filter(p => !playersWaiting.includes(p));
    
    if (remainingPlayers.length > 0) {
      // Volver a activar el buzzer para los jugadores restantes
      // IMPORTANTE: Mantener firstBuzzerPress en true (no resetearlo)
      await update(gameRef, {
        status: 'waiting-for-buzzer',
        buzzerPressed: null,
        currentPlayerTurn: null,
        playersWaiting,
        firstBuzzerPress: true, // ✅ Mantener en true para que el siguiente no gane +10
      });
    } else {
      // Todos fallaron, pasar a la siguiente pregunta
      const newRound = game.round + 1;
      
      if (newRound > game.settings.roundsPerGame) {
        await update(gameRef, {
          status: 'finished',
          currentQuestion: null,
          currentPlayerTurn: null,
          buzzerPressed: null,
          playersWaiting: [],
          correctAnswersThisRound: [],
          firstBuzzerPress: false,
        });
      } else {
        await update(gameRef, {
          round: newRound,
          currentQuestion: null,
          currentPlayerTurn: null,
          buzzerPressed: null,
          playersWaiting: [],
          correctAnswersThisRound: [],
          firstBuzzerPress: false,
          status: 'playing',
        });
      }
    }
  }
};

// Todos se rinden en modo buzzer
export const buzzerGiveUp = async (gameId: string): Promise<void> => {
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
        buzzerPressed: null,
        playersWaiting: [],
        correctAnswersThisRound: [],
        firstBuzzerPress: false,
      });
    } else {
      await update(gameRef, {
        round: newRound,
        currentQuestion: null,
        currentPlayerTurn: null,
        buzzerPressed: null,
        playersWaiting: [],
        correctAnswersThisRound: [],
        firstBuzzerPress: false,
        status: 'playing',
      });
    }
  }
};

// Activar modo buzzer para selección manual del moderador
export const activateBuzzerManual = async (gameId: string): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    status: 'waiting-for-buzzer',
    buzzerPressed: null,
    playersWaiting: [],
    // Marca especial para indicar que es modo manual
    buzzerManualMode: true,
  });
};

// Moderador selecciona manualmente quién presionó el buzzer
export const moderatorSelectPlayer = async (gameId: string, playerId: string): Promise<void> => {
  await update(ref(database, `games/${gameId}`), {
    buzzerPressed: playerId,
    currentPlayerTurn: playerId,
    status: 'playing',
  });
};

// Saltar pregunta sin contar como ronda (para preguntas repetidas o problemáticas)
export const skipQuestion = async (gameId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    // Solo limpiar el estado actual sin avanzar la ronda
    await update(gameRef, {
      currentQuestion: null,
      currentPlayerTurn: null,
      buzzerPressed: null,
      playersWaiting: [],
      correctAnswersThisRound: [],
      firstBuzzerPress: false,
      // Mantener el mismo round y status
      status: 'playing',
    });
  }
};

// Registrar respuesta correcta y obtener puntos según el orden
export const addCorrectAnswer = async (
  gameId: string,
  playerId: string
): Promise<number> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val() as GameState;
    const correctAnswers = game.correctAnswersThisRound || [];
    
    // En MODO BUZZER: solo el primero en presionar el buzzer puede ganar +10
    // En MODO AUTOMÁTICO: cada jugador en su turno puede ganar +10
    let isFirstBuzzerPress = false;
    
    if (game.settings.turnMode === 'buzzer') {
      // Modo buzzer: verificar si fue el primero en presionar
      isFirstBuzzerPress = game.firstBuzzerPress !== true;
      
      // DEBUG
      console.log('🔍 DEBUG addCorrectAnswer (BUZZER MODE):');
      console.log('  - playerId:', playerId);
      console.log('  - firstBuzzerPress:', game.firstBuzzerPress);
      console.log('  - isFirstBuzzerPress:', isFirstBuzzerPress);
      console.log('  - correctAnswers.length:', correctAnswers.length);
    } else {
      // Modo automático: cada jugador puede ganar +10 en su turno
      isFirstBuzzerPress = correctAnswers.length === 0;
      
      // DEBUG
      console.log('🔍 DEBUG addCorrectAnswer (AUTO MODE):');
      console.log('  - playerId:', playerId);
      console.log('  - correctAnswers.length:', correctAnswers.length);
      console.log('  - isFirstBuzzerPress:', isFirstBuzzerPress);
    }
    
    // Calcular puntos según:
    // - Si fue el primero en presionar buzzer Y el primero en responder correctamente = +10
    // - Todos los demás casos = +8
    const points = calculatePointsForCorrectAnswer(isFirstBuzzerPress, correctAnswers.length);
    
    console.log('  - PUNTOS CALCULADOS:', points);
    
    // Agregar jugador a la lista de respuestas correctas
    correctAnswers.push(playerId);
    
    await update(gameRef, {
      correctAnswersThisRound: correctAnswers,
    });
    
    return points;
  }
  
  return 8; // Fallback (ya no es el primero)
};
