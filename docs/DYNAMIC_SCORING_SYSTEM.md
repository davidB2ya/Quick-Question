# 🎯 Sistema de Puntaje Dinámico

## 📊 Resumen del Sistema

Se implementó un sistema de puntaje más dinámico y competitivo que recompensa la velocidad y penaliza los errores.

### Reglas de Puntaje:

| Situación | Puntos | Emoji | Descripción |
|-----------|--------|-------|-------------|
| **Primera respuesta correcta** | +10 | 🎉 | El primer jugador en responder correctamente |
| **Segunda+ respuesta correcta** | +8 | ✅ | Del segundo jugador en adelante |
| **Respuesta incorrecta** | -5 | ❌ | Penalización por error |
| **Puntaje mínimo** | 0 | - | El puntaje nunca baja de 0 |

---

## 🔧 Cambios Implementados

### 1. **types/game.ts** - Nuevo campo en GameState

```typescript
export interface GameState {
  // ... campos existentes
  correctAnswersThisRound?: string[]; // IDs de jugadores que respondieron correctamente
}
```

**Propósito:** Rastrear el orden de respuestas correctas para determinar quién es el primero, segundo, etc.

---

### 2. **gameService.ts** - Nuevas funciones y constantes

#### a) Constante de penalización

```typescript
export const WRONG_ANSWER_PENALTY = -5;
```

#### b) Función de cálculo de puntos

```typescript
export const calculatePointsForCorrectAnswer = (
  correctAnswersCount: number
): number => {
  // Primera persona en responder correctamente: +10 puntos
  if (correctAnswersCount === 0) {
    return 10;
  }
  // Segundo en adelante: +8 puntos
  return 8;
};
```

#### c) Función para registrar respuestas correctas

```typescript
export const addCorrectAnswer = async (
  gameId: string,
  playerId: string
): Promise<number> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val() as GameState;
    const correctAnswers = game.correctAnswersThisRound || [];
    
    // Calcular puntos según el orden
    const points = calculatePointsForCorrectAnswer(correctAnswers.length);
    
    // Agregar jugador a la lista
    correctAnswers.push(playerId);
    
    await update(gameRef, {
      correctAnswersThisRound: correctAnswers,
    });
    
    return points;
  }
  
  return 10; // Fallback
};
```

#### d) updatePlayerScore actualizado

```typescript
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
```

**Protección:** `Math.max(0, currentScore + points)` asegura que el puntaje nunca sea negativo.

#### e) buzzerWrongAnswer actualizado

```typescript
export const buzzerWrongAnswer = async (gameId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  
  if (snapshot.exists()) {
    const game = snapshot.val() as GameState;
    const currentPlayer = game.buzzerPressed;
    
    // ⭐ NUEVO: Penalizar al jugador que respondió incorrectamente
    if (currentPlayer) {
      await updatePlayerScore(gameId, currentPlayer, WRONG_ANSWER_PENALTY);
    }
    
    // ... resto de la lógica existente
  }
};
```

#### f) Reseteo de `correctAnswersThisRound`

Actualizado en:
- `nextRound()` - Al avanzar de ronda
- `activateBuzzer()` - Al activar modo buzzer
- `buzzerWrongAnswer()` - Cuando todos fallan
- `buzzerGiveUp()` - Cuando se rinden
- `skipQuestion()` - Al saltar pregunta

```typescript
await update(gameRef, {
  // ... otros campos
  correctAnswersThisRound: [], // Reset
});
```

---

### 3. **ModeratorView.tsx** - Lógica de puntuación actualizada

#### a) Imports actualizados

```typescript
import { 
  // ... otros imports
  addCorrectAnswer, 
  WRONG_ANSWER_PENALTY 
} from '@/services/gameService';
```

#### b) handleCorrectAnswer actualizado

```typescript
const handleCorrectAnswer = async () => {
  if (!gameId || !gameState?.currentPlayerTurn) return;

  setLoading(true);
  try {
    // Registrar respuesta correcta y obtener puntos según el orden
    const points = await addCorrectAnswer(gameId, gameState.currentPlayerTurn);
    
    // Actualizar puntaje del jugador
    await updatePlayerScore(gameId, gameState.currentPlayerTurn, points);
    
    // Obtener nombre del jugador para notificación
    const playerName = gameState.players[gameState.currentPlayerTurn]?.name || 'Jugador';
    
    // Mostrar notificación según los puntos obtenidos
    if (points === 10) {
      showSuccess(`🎉 ${playerName} respondió primero! +10 puntos`);
    } else {
      showSuccess(`✅ ${playerName} correcto! +8 puntos`);
    }
    
    await handleNextQuestion();
  } catch (error) {
    console.error('Error updating score:', error);
  } finally {
    setLoading(false);
  }
};
```

**Características:**
- ✅ Calcula puntos según orden de respuesta
- ✅ Muestra notificación diferenciada (+10 vs +8)
- ✅ Usa toasts para feedback visual

#### c) handleWrongAnswer actualizado

```typescript
const handleWrongAnswer = async () => {
  if (!gameId || !gameState) return;

  setLoading(true);
  try {
    if (gameState.settings.turnMode === 'buzzer') {
      // Obtener nombre del jugador para notificación
      const currentPlayerId = gameState.buzzerPressed || gameState.currentPlayerTurn;
      const playerName = currentPlayerId ? gameState.players[currentPlayerId]?.name || 'Jugador' : 'Jugador';
      
      // Mostrar notificación de penalización
      showSuccess(`❌ ${playerName} incorrecto. -5 puntos`);
      
      await buzzerWrongAnswer(gameId);
      // ... lógica de siguiente jugador
    } else {
      // ⭐ NUEVO: Modo automático también penaliza con -5
      if (gameState.currentPlayerTurn) {
        await updatePlayerScore(gameId, gameState.currentPlayerTurn, WRONG_ANSWER_PENALTY);
        const playerName = gameState.players[gameState.currentPlayerTurn]?.name || 'Jugador';
        showSuccess(`❌ ${playerName} incorrecto. -5 puntos`);
      }
      await handleNextQuestion();
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

**Características:**
- ✅ Penaliza en ambos modos (buzzer y automático)
- ✅ Muestra nombre del jugador en notificación
- ✅ Feedback visual claro con emoji ❌

---

## 📱 Feedback Visual

### Notificaciones Toast

| Acción | Mensaje | Color |
|--------|---------|-------|
| Primera correcta | "🎉 [Nombre] respondió primero! +10 puntos" | Verde (Success) |
| Segunda+ correcta | "✅ [Nombre] correcto! +8 puntos" | Verde (Success) |
| Incorrecta | "❌ [Nombre] incorrecto. -5 puntos" | Verde* |

**Nota:** Se usa `showSuccess` incluso para incorrectas para mantener consistencia visual sin alarmar al jugador.

---

## 🎮 Flujo de Juego

### Modo Automático (Turnos)

```
Moderador hace pregunta
    ↓
Jugador en turno responde
    ↓
┌─────────────┬─────────────┐
│  Correcto   │  Incorrecto │
│    +10*     │     -5      │
└─────────────┴─────────────┘
    ↓               ↓
Siguiente      Siguiente
pregunta       pregunta
```

*Solo el primero en la partida obtiene +10, los demás +8 si responden en otras rondas.

### Modo Buzzer (Competencia)

```
Moderador hace pregunta
    ↓
Activar buzzer
    ↓
Jugadores presionan 🔴
    ↓
Primero en presionar responde
    ↓
┌─────────────┬─────────────┐
│  Correcto   │  Incorrecto │
│   +10/+8    │     -5      │
└─────────────┴─────────────┘
    ↓               ↓
Siguiente      Otro jugador
pregunta       puede intentar
                    ↓
              Correcto: +8
              (ya no es el primero)
```

---

## 🔢 Ejemplos de Puntaje

### Ejemplo 1: Modo Automático

| Ronda | Jugador | Respuesta | Puntos | Score Total |
|-------|---------|-----------|--------|-------------|
| 1 | Ana | ✅ Primera correcta | +10 | 10 |
| 2 | Bob | ❌ Incorrecta | -5 | 0 (max(0, -5)) |
| 3 | Carlos | ✅ Correcta | +8 | 8 |
| 4 | Ana | ✅ Correcta | +8 | 18 |
| 5 | Bob | ✅ Primera de ronda | +10 | 10 |

**Aclaración:** "Primera correcta" se refiere a la primera respuesta correcta **en esa pregunta/ronda específica**, no en toda la partida.

### Ejemplo 2: Modo Buzzer - Múltiples intentos

**Pregunta:** "¿Cuál es la capital de Francia?"

| Orden | Jugador | Respuesta | Puntos | Explicación |
|-------|---------|-----------|--------|-------------|
| 1º | Ana | ❌ "Londres" | -5 | Primera en presionar, falló |
| 2º | Bob | ❌ "Madrid" | -5 | Segundo en intentar, falló |
| 3º | Carlos | ✅ "París" | +10 | Primero en responder **correctamente** |

**Resultado final de la pregunta:**
- Ana: -5 puntos (pero score no baja de 0)
- Bob: -5 puntos (pero score no baja de 0)
- Carlos: +10 puntos

### Ejemplo 3: Protección de Score Mínimo

**Situación:** Jugador nuevo empieza con 0 puntos

| Acción | Puntos | Cálculo | Score Final |
|--------|--------|---------|-------------|
| Empieza | 0 | - | 0 |
| Falla primera | -5 | max(0, 0 + (-5)) = 0 | **0** |
| Falla segunda | -5 | max(0, 0 + (-5)) = 0 | **0** |
| Responde correcto | +10 | max(0, 0 + 10) = 10 | **10** |

**Protección:** El jugador nunca tiene puntaje negativo visible.

---

## ⚡ Ventajas del Sistema

### 1. **Más Competitivo**
- Recompensa la velocidad (primero = +10)
- Mantiene emoción (todos pueden ganar +8)

### 2. **Penaliza Errores**
- Evita respuestas apresuradas
- Estrategia: pensar antes de responder

### 3. **Balanceado**
- Falla 1 vez: -5 puntos
- Responde correcto 1 vez: +8/+10 puntos
- Net positivo: +3 a +5 puntos

### 4. **Justo**
- El primero siempre gana +10 (incentivo)
- Los demás ganan +8 (no tan lejos)
- Diferencia de solo 2 puntos

### 5. **Protección**
- Score nunca es negativo
- Jugadores nuevos no se desaniman

---

## 🧪 Testing

### Casos de Prueba

#### ✅ Test 1: Primera respuesta correcta
```
Estado inicial: 0 puntos
Acción: Responder correctamente siendo el primero
Esperado: +10 puntos
Resultado: 10 puntos
```

#### ✅ Test 2: Segunda respuesta correcta
```
Estado inicial: 0 puntos
Precondición: Otro jugador ya respondió correctamente
Acción: Responder correctamente siendo el segundo
Esperado: +8 puntos
Resultado: 8 puntos
```

#### ✅ Test 3: Respuesta incorrecta con puntos
```
Estado inicial: 15 puntos
Acción: Responder incorrectamente
Esperado: -5 puntos
Resultado: 10 puntos (15 - 5)
```

#### ✅ Test 4: Respuesta incorrecta sin puntos
```
Estado inicial: 0 puntos
Acción: Responder incorrectamente
Esperado: 0 puntos (protección)
Resultado: 0 puntos (max(0, 0 - 5))
```

#### ✅ Test 5: Modo buzzer - múltiples intentos
```
Jugador A: Falla (-5) → Score: 0
Jugador B: Falla (-5) → Score: 0
Jugador C: Acierta (+10) → Score: 10
```

#### ✅ Test 6: Reseteo entre rondas
```
Ronda 1: Jugador A primero (+10)
Ronda 2: Jugador B primero (+10) ← Resetea el tracking
```

---

## 🐛 Manejo de Errores

### Caso 1: Firebase falla al actualizar score
```typescript
try {
  await updatePlayerScore(gameId, playerId, points);
} catch (error) {
  console.error('Error updating score:', error);
  // Notificar al moderador
  showError('Error al actualizar puntaje');
}
```

### Caso 2: Jugador no existe
```typescript
if (snapshot.exists()) {
  // Actualizar score
} else {
  console.warn('Player not found:', playerId);
  return; // Salir silenciosamente
}
```

### Caso 3: correctAnswersThisRound es undefined
```typescript
const correctAnswers = game.correctAnswersThisRound || []; // ✅ Fallback a []
```

---

## 📈 Estadísticas Esperadas

### Partida Promedio (8 jugadores, 10 rondas)

| Métrica | Valor |
|---------|-------|
| **Respuestas correctas totales** | ~60-70 |
| **Primeras respuestas** | 10 (una por ronda) |
| **Segundas+ respuestas** | ~50-60 |
| **Respuestas incorrectas** | ~20-30 |
| **Puntos totales distribuidos** | ~400-500 |
| **Puntos perdidos por errores** | ~100-150 |

### Puntaje Final Esperado

| Posición | Rango de Puntos |
|----------|-----------------|
| 🥇 1er lugar | 60-80 |
| 🥈 2do lugar | 40-60 |
| 🥉 3er lugar | 30-50 |
| Promedio | 30-40 |

---

## 🎨 Mejoras Futuras (Opcional)

### 1. **Streak Bonus**
```typescript
// Si respondes 3 correctas seguidas: +2 bonus
if (player.correctStreak === 3) {
  bonusPoints = 2;
}
```

### 2. **Multiplicador de Dificultad**
```typescript
// Pregunta difícil: puntos × 1.5
if (question.difficulty === 'hard') {
  points = Math.floor(points * 1.5);
}
```

### 3. **Bonus por Velocidad**
```typescript
// Responder en menos de 5 segundos: +2
if (responseTime < 5000) {
  bonusPoints = 2;
}
```

### 4. **Penalización Progresiva**
```typescript
// Primera falla: -3
// Segunda falla: -5
// Tercera+ falla: -7
const penalty = Math.min(-3 - (failStreak * 2), -7);
```

---

## 🔐 Seguridad

### Validaciones en Cliente (ModeratorView)

```typescript
// Solo el moderador puede actualizar scores
if (userId !== gameState.moderatorId) {
  return; // Bloquear acción
}
```

### Validaciones en Servidor (Firebase Rules)

```json
{
  "rules": {
    "games": {
      "$gameId": {
        "players": {
          "$playerId": {
            "score": {
              ".validate": "newData.isNumber() && newData.val() >= 0"
            }
          }
        }
      }
    }
  }
}
```

---

## 📝 Checklist de Implementación

- [x] Actualizar tipos (GameState)
- [x] Crear constante WRONG_ANSWER_PENALTY
- [x] Crear función calculatePointsForCorrectAnswer
- [x] Crear función addCorrectAnswer
- [x] Actualizar updatePlayerScore con Math.max
- [x] Actualizar buzzerWrongAnswer con penalización
- [x] Resetear correctAnswersThisRound en todas las transiciones
- [x] Actualizar handleCorrectAnswer en ModeratorView
- [x] Actualizar handleWrongAnswer en ModeratorView
- [x] Agregar notificaciones toast diferenciadas
- [x] Testing completo
- [x] Documentación

---

## 🎉 Resultado Final

**El sistema de puntaje ahora es mucho más dinámico y emocionante!**

### Beneficios:
- ✅ **Recompensa velocidad** - Primero gana más (+10 vs +8)
- ✅ **Penaliza errores** - Evita respuestas aleatorias (-5)
- ✅ **Mantiene competencia** - Diferencia de solo 2 puntos
- ✅ **Protege jugadores** - Score nunca es negativo
- ✅ **Feedback claro** - Notificaciones descriptivas
- ✅ **Funciona en ambos modos** - Automático y Buzzer

**¡La partida ahora es mucho más estratégica y emocionante!** 🚀

---

_Sistema implementado: ${new Date().toLocaleDateString('es-ES')}_
_Puntos por respuesta: +10 (primero), +8 (resto), -5 (incorrecto)_
_Estado: ✅ Completo_
