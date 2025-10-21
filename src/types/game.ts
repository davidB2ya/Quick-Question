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
  difficulty: DifficultyType;
  funFact?: string;
}

export type CategoryType = 
  | 'deportes' 
  | 'musica' 
  | 'historia' 
  | 'ciencia' 
  | 'entretenimiento' 
  | 'geografia';

export type DifficultyType = 'easy' | 'medium' | 'hard';

export type TurnMode = 'automatic' | 'buzzer';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type BuzzerMode = 'player-press' | 'moderator-select';

export type UserType = 'player' | 'moderator' | 'spectator';

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
  correctAnswersThisRound?: string[]; // IDs de jugadores que ya respondieron correctamente en esta ronda (para tracking de 1er, 2do, etc.)
  firstBuzzerPress?: boolean; // Indica si ya alguien presionó el buzzer primero en esta pregunta (para dar +10 solo al primero)
}

export interface GameSettings {
  maxPlayers: number | string;
  roundsPerGame: number;
  categories: CategoryType[];
  turnMode: TurnMode;
  difficultyLevel: DifficultyLevel;
  buzzerMode?: BuzzerMode; // Solo relevante cuando turnMode es 'buzzer'
  timePerQuestion?: number;
}

export interface GameHistory {
  gameId: string;
  players: Player[];
  winner: Player;
  totalRounds: number;
  finishedAt: number;
}
