import { create } from 'zustand';
import type { GameState, Player } from '@/types/game';

interface GameStore {
  gameId: string | null;
  playerId: string | null;
  playerRole: 'player' | 'moderator' | null;
  gameState: GameState | null;
  currentPlayer: Player | null;
  
  setGameId: (gameId: string) => void;
  setPlayerId: (playerId: string) => void;
  setPlayerRole: (role: 'player' | 'moderator') => void;
  setGameState: (gameState: GameState | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameId: null,
  playerId: null,
  playerRole: null,
  gameState: null,
  currentPlayer: null,

  setGameId: (gameId) => set({ gameId }),
  
  setPlayerId: (playerId) => {
    set({ playerId });
    const state = get();
    if (state.gameState && playerId) {
      const player = state.gameState.players[playerId];
      set({ currentPlayer: player || null });
    }
  },
  
  setPlayerRole: (role) => set({ playerRole: role }),
  
  setGameState: (gameState) => {
    set({ gameState });
    const state = get();
    if (gameState && state.playerId) {
      const player = gameState.players[state.playerId];
      set({ currentPlayer: player || null });
    }
  },
  
  reset: () => set({
    gameId: null,
    playerId: null,
    playerRole: null,
    gameState: null,
    currentPlayer: null,
  }),
}));
