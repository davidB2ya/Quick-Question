export interface Player {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  isActive: boolean;
}

export interface Question {
  id: string;
  category: CategoryType;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  funFact?: string;
}

export type CategoryType = 
  | 'deportes' 
  | 'musica' 
  | 'historia' 
  | 'ciencia' 
  | 'entretenimiento' 
  | 'geografia';

export type TurnMode = 'automatic' | 'buzzer';

export interface GameState {
  id: string;
  code: string;
  players: Record<string, Player>;
  currentQuestion: Question | null;
  currentPlayerTurn: string | null;
  round: number;
  status: 'lobby' | 'playing' | 'waiting-for-buzzer' | 'finished';
  createdAt: number;
  moderatorId: string;
  settings: GameSettings;
  buzzerPressed?: string | null; // ID del jugador que presionó el buzzer
  playersWaiting?: string[]; // IDs de jugadores esperando turno
}

export interface GameSettings {
  maxPlayers: number;
  roundsPerGame: number;
  categories: CategoryType[];
  turnMode: TurnMode;
  timePerQuestion?: number;
}

export interface GameHistory {
  gameId: string;
  players: Player[];
  winner: Player;
  totalRounds: number;
  finishedAt: number;
}
