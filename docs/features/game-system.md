# 🎮 Sistema de Juego

El sistema de juego de Quick Question está diseñado para proporcionar una experiencia fluida, divertida y competitiva para múltiples jugadores en tiempo real.

---

## 🎯 Modos de Juego

### 1. Modo Automático

En el modo automático, el sistema selecciona aleatoriamente qué jugador responde cada pregunta.

**Características**:
- ✅ Selección aleatoria automática
- ✅ Todos los jugadores tienen igual oportunidad
- ✅ Sin necesidad de buzzer
- ✅ Ideal para juegos casuales

**Flujo**:
```
1. Moderador inicia ronda
2. Sistema genera pregunta
3. Sistema selecciona jugador al azar
4. Jugador seleccionado responde
5. Moderador valida (✓/✗)
6. Sistema actualiza puntaje
7. Siguiente ronda
```

**Configuración**:
```typescript
settings: {
  turnMode: 'automatic'  // Modo automático
}
```

### 2. Modo Buzzer

En el modo buzzer, los jugadores compiten por presionar primero el buzzer para responder.

**Características**:
- ✅ Competencia directa entre jugadores
- ✅ El más rápido gana el turno
- ✅ Si falla, siguiente jugador intenta
- ✅ Ideal para competencias emocionantes

**Flujo**:
```
1. Moderador muestra pregunta
2. Estado: 'waiting-for-buzzer'
3. Jugadores presionan buzzer
4. Primer jugador en presionar gana turno
5. Si responde bien: +10 puntos
6. Si responde mal: siguiente jugador
7. Si todos fallan: siguiente ronda
```

**Configuración**:
```typescript
settings: {
  turnMode: 'buzzer',
  buzzerMode: 'player-press' // o 'moderator-select'
}
```

#### Variantes del Modo Buzzer:

**a) Player Press** (Automático)
```typescript
buzzerMode: 'player-press'
```
- Jugadores presionan botón en pantalla
- Sistema detecta automáticamente quién fue primero
- Sin intervención del moderador

**b) Moderator Select** (Manual)
```typescript
buzzerMode: 'moderator-select'
```
- Jugadores levantan mano o presionan buzzer físico
- Moderador selecciona manualmente quién fue primero
- Útil para buzzers físicos externos

---

## 🏆 Sistema de Puntuación

### Puntos por Respuesta

| Acción | Puntos |
|--------|--------|
| Respuesta Correcta | +10 |
| Respuesta Incorrecta | 0 |
| No Responder | 0 |

### Cálculo de Ganador

Al finalizar el juego, el ganador se determina por:
1. **Mayor puntaje total**
2. En caso de empate: primer jugador en alcanzar ese puntaje

```typescript
const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
const winner = sortedPlayers[0];
```

---

## 🎲 Categorías y Dificultades

### Categorías Disponibles

| Categoría | Emoji | Descripción |
|-----------|-------|-------------|
| Deportes | ⚽ | Atletas, equipos, competencias |
| Música | 🎵 | Artistas, géneros, canciones |
| Historia | 📜 | Eventos, personajes, fechas |
| Ciencia | 🔬 | Inventos, científicos, fenómenos |
| Entretenimiento | 🎬 | Películas, series, celebridades |
| Geografía | 🌍 | Países, ciudades, monumentos |

### Niveles de Dificultad

| Nivel | Descripción | Ejemplo |
|-------|-------------|---------|
| **Easy** | Conocimiento general básico | "¿Cuántos jugadores tiene un equipo de fútbol?" |
| **Medium** | Requiere conocimiento específico | "¿En qué año se fundó la FIFA?" |
| **Hard** | Conocimiento avanzado o detalles | "¿Quién tiene el récord mundial de los 100 metros planos?" |

---

## ⚙️ Configuración de Partida

### Parámetros Configurables

```typescript
interface GameSettings {
  maxPlayers: number;        // 2-4 jugadores
  roundsPerGame: number;     // 5-20 rondas
  categories: CategoryType[]; // Categorías seleccionadas
  turnMode: TurnMode;        // 'automatic' o 'buzzer'
  difficultyLevel: DifficultyLevel; // 'easy', 'medium', 'hard'
  buzzerMode?: BuzzerMode;   // Solo si turnMode es 'buzzer'
}
```

### Ejemplo de Configuración

```typescript
const gameSettings = {
  maxPlayers: 4,
  roundsPerGame: 10,
  categories: ['deportes', 'musica', 'historia'],
  turnMode: 'buzzer',
  difficultyLevel: 'medium',
  buzzerMode: 'player-press'
};
```

---

## 🔄 Estados del Juego

### Estado del Juego

```typescript
type GameStatus = 
  | 'lobby'                // Esperando jugadores
  | 'playing'              // Jugando normalmente
  | 'waiting-for-buzzer'   // Esperando que alguien presione buzzer
  | 'finished';            // Juego terminado
```

### Transiciones de Estado

```
lobby → playing → waiting-for-buzzer → playing → finished
  ↑        ↓                              ↓
  └────────┴──────────────────────────────┘
```

### Diagrama de Estados

```
┌─────────┐
│  LOBBY  │ ← Esperando jugadores
└────┬────┘
     │ startGame()
     ↓
┌─────────┐
│ PLAYING │ ← Jugando normalmente
└────┬────┘
     │ (si turnMode === 'buzzer')
     ↓
┌──────────────────┐
│WAITING-FOR-BUZZER│ ← Esperando que presionen buzzer
└────┬────┘
     │ pressBuzzer()
     ↓
┌─────────┐
│ PLAYING │ ← Alguien presionó, respondiendo
└────┬────┘
     │ (round > maxRounds)
     ↓
┌──────────┐
│ FINISHED │ ← Juego terminado
└──────────┘
```

---

## 🎪 Flujo de una Ronda Completa

### Modo Automático

```typescript
// 1. Generar pregunta
const question = await generateQuestionTry(category, difficulty, gameId);

// 2. Seleccionar jugador aleatorio
const randomPlayer = selectRandomPlayer(players);

// 3. Actualizar estado
await updateCurrentQuestion(gameId, question, randomPlayer);

// 4. Esperar respuesta del jugador (verbal)

// 5. Moderador valida
if (correct) {
  await updatePlayerScore(gameId, playerId, 10);
}

// 6. Siguiente ronda
await nextRound(gameId);
```

### Modo Buzzer

```typescript
// 1. Generar y mostrar pregunta
const question = await generateQuestionTry(category, difficulty, gameId);
await updateCurrentQuestion(gameId, question, null);

// 2. Activar buzzer
await activateBuzzer(gameId);

// 3. Esperar a que alguien presione
// (el jugador presiona desde su dispositivo)
await pressBuzzer(gameId, playerId);

// 4. Jugador responde verbalmente

// 5. Moderador valida
if (correct) {
  await updatePlayerScore(gameId, playerId, 10);
  await nextRound(gameId);
} else {
  // Siguiente jugador intenta
  await buzzerWrongAnswer(gameId);
}
```

---

## 🔧 Funcionalidades Especiales

### 1. Saltar Pregunta

Permite al moderador saltar una pregunta sin que cuente como ronda.

**Casos de uso**:
- Pregunta repetida
- Pregunta mal formulada
- Error técnico

```typescript
await skipQuestion(gameId);
// → Nueva pregunta, misma ronda
```

### 2. Sistema Anti-Repetición

Previene que la misma pregunta aparezca dos veces en una partida.

```typescript
const usedQuestions: Record<string, Set<string>> = {};

// Al generar pregunta
if (isQuestionUsed(gameId, questionId)) {
  // Generar otra pregunta
}

// Al usar pregunta
markQuestionAsUsed(gameId, questionId);
```

### 3. Rendirse (Modo Buzzer)

Si todos los jugadores fallan o se rinden:

```typescript
await buzzerGiveUp(gameId);
// → Avanza a la siguiente ronda sin puntos
```

---

## 📊 Datos en Tiempo Real

### Sincronización Automática

```typescript
// Suscribirse a cambios del juego
const unsubscribe = subscribeToGame(gameId, (game) => {
  setGameState(game);
  // UI se actualiza automáticamente
});

// Limpiar al desmontar
return unsubscribe;
```

### Actualizaciones que se Sincronizan

- ✅ Jugadores que se unen/salen
- ✅ Pregunta actual
- ✅ Turno actual
- ✅ Puntajes
- ✅ Estado del juego
- ✅ Buzzer presionado

---

## 🎨 Experiencia de Usuario

### Para el Moderador

**Panel de Control**:
- Ver todos los jugadores y puntajes
- Leer pregunta y respuesta correcta
- Ver dato curioso para compartir
- Botones para validar respuestas
- Control total del flujo del juego

### Para el Jugador

**Vista del Jugador**:
- Ver pregunta cuando es su turno
- Ver puntajes de todos
- Indicador visual de turno actual
- Botón de buzzer (si es modo buzzer)
- Feedback visual del estado

### Para el Espectador

**Vista de Observador**:
- Ver pregunta y categoría
- Ver todos los puntajes
- Ver quién tiene el turno
- **NO** ver la respuesta correcta
- Actualización en tiempo real

---

## 🔒 Validaciones y Restricciones

### Límites

```typescript
const LIMITS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  MIN_ROUNDS: 5,
  MAX_ROUNDS: 20,
  MIN_CATEGORIES: 1,
  MAX_CATEGORIES: 6
};
```

### Validaciones

```typescript
// Antes de iniciar juego
if (playerCount < LIMITS.MIN_PLAYERS) {
  throw new Error('Se necesitan al menos 2 jugadores');
}

// Antes de unirse
if (playerCount >= game.settings.maxPlayers) {
  throw new Error('La partida está llena');
}

// Validar código
if (!/^[A-Z0-9]{6}$/.test(code)) {
  throw new Error('Código inválido');
}
```

---

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome/Edge (v100+)
- ✅ Firefox (v100+)
- ✅ Safari (v15+)
- ✅ Opera (v85+)

### Dispositivos

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Móviles (iOS, Android)
- ✅ Tablets
- ✅ Smart TVs (con navegador)

---

## 🚀 Optimizaciones

### Performance

```typescript
// Memoización de componentes
const PlayerCard = React.memo(({ player }) => {
  return <div>{player.name}: {player.score}</div>;
});

// Lazy loading de vistas
const ModeratorView = lazy(() => import('./ModeratorView'));
```

### Red

```typescript
// Debounce de actualizaciones
const debouncedUpdate = debounce(updateScore, 300);

// Batch updates en Firebase
const updates = {};
updates[`games/${gameId}/players/${playerId}/score`] = newScore;
updates[`games/${gameId}/round`] = nextRound;
await update(ref(database), updates);
```

---

## 📖 Próximos Pasos

- [Modo Buzzer Detallado](./buzzer-mode.md)
- [Sistema Anti-Repetición](./anti-repetition.md)
- [Vista de Espectador](./spectator-view.md)

---

**¿Dudas sobre el sistema de juego?** Revisa la [guía del moderador](../guides/moderator-guide.md) o la [FAQ](../troubleshooting/faq.md).
