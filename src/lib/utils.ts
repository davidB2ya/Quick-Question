import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getRandomCategory() {
  const categories = ['deportes', 'musica', 'historia', 'ciencia', 'entretenimiento', 'geografia'];
  return categories[Math.floor(Math.random() * categories.length)];
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    deportes: 'bg-green-500',
    musica: 'bg-purple-500',
    historia: 'bg-yellow-500',
    ciencia: 'bg-blue-500',
    entretenimiento: 'bg-pink-500',
    geografia: 'bg-orange-500',
  };
  return colors[category] || 'bg-gray-500';
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    deportes: '⚽',
    musica: '🎵',
    historia: '📜',
    ciencia: '🔬',
    entretenimiento: '🎬',
    geografia: '🌍',
  };
  return emojis[category] || '❓';
}

export function formatPlayerCount(currentPlayers: number, maxPlayers: number | string): string {
  const max = Number(maxPlayers);
  if (max === -1) {
    return `${currentPlayers} jugador${currentPlayers === 1 ? '' : 'es'} conectado${currentPlayers === 1 ? '' : 's'} (sin límite)`;
  }
  return `${currentPlayers} / ${max} jugador${max === 1 ? '' : 'es'}`;
}
