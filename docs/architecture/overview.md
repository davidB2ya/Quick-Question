# 🏗️ Visión General de la Arquitectura

Quick Question está construido con una arquitectura moderna, escalable y mantenible que prioriza la experiencia en tiempo real y la separación de responsabilidades.

---

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   HomePage   │  │ PlayerView   │  │ModeratorView │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                 │
│                          │                                      │
│         ┌────────────────┴────────────────┐                    │
│         │                                  │                    │
│    ┌────▼────┐                     ┌──────▼────┐              │
│    │  Store  │                     │ Services  │              │
│    │(Zustand)│                     │           │              │
│    └─────────┘                     └───────────┘              │
│                                         │                      │
├─────────────────────────────────────────┼──────────────────────┤
│                                         │                      │
│                    EXTERNAL SERVICES    │                      │
│                                         │                      │
│         ┌───────────────────────────────┴─┐                   │
│         │                                  │                   │
│    ┌────▼────────┐                ┌───────▼────────┐         │
│    │   Firebase  │                │   Gemini AI    │         │
│    │  Realtime   │                │   (Google)     │         │
│    │  Database   │                └────────────────┘         │
│    └─────────────┘                                            │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎯 Principios de Diseño

### 1. **Separación de Responsabilidades**
Cada capa tiene una responsabilidad clara y bien definida:

- **Presentación**: Componentes React (UI/UX)
- **Lógica de Negocio**: Services (game, question, gemini)
- **Estado Global**: Zustand Store
- **Persistencia**: Firebase Realtime Database
- **IA**: Gemini AI API

### 2. **Tiempo Real First**
Todo el sistema está diseñado para actualizaciones en tiempo real:

```typescript
// Suscripción a cambios en Firebase
subscribeToGame(gameId, (game) => {
  setGameState(game); // Actualización automática
});
```

### 3. **Offline-Ready con Fallback**
Si Gemini AI falla, el sistema usa un banco de preguntas local:

```typescript
try {
  return await generateQuestionWithAI();
} catch {
  return generateQuestionFromBank(); // Fallback
}
```

### 4. **Type Safety**
TypeScript en todo el proyecto para prevenir errores:

```typescript
interface GameState {
  id: string;
  code: string;
  players: Record<string, Player>;
  status: 'lobby' | 'playing' | 'waiting-for-buzzer' | 'finished';
  // ...
}
```

---

## 🔄 Flujo de Datos

### Creación de Juego

```
Moderator View → createGame() → Firebase
                     ↓
              gameId generado
                     ↓
           subscribeToGame()
                     ↓
      Actualización automática
```

### Unirse al Juego

```
Player View → joinGame(code) → Firebase
                  ↓
           Buscar por código
                  ↓
        Agregar a players{}
                  ↓
       Todos reciben update
```

### Generación de Pregunta

```
Moderator → generateQuestion()
                  ↓
         ┌────────┴────────┐
         │                 │
    Gemini AI       Banco Estático
         │                 │
         └────────┬────────┘
                  ↓
          updateCurrentQuestion()
                  ↓
              Firebase
                  ↓
    Todos ven la nueva pregunta
```

---

## 🧩 Componentes Principales

### Frontend (React)

#### **Vistas**
- `HomePage.tsx` - Landing y selección de rol
- `CreateGamePage.tsx` - Configuración de nueva partida
- `ModeratorView.tsx` - Panel de control del moderador
- `PlayerView.tsx` - Interfaz del jugador
- `SpectatorView.tsx` - Vista de observador

#### **Componentes UI**
- `Button.tsx` - Botón reutilizable
- `Card.tsx` - Tarjeta contenedora
- `Input.tsx` - Campo de entrada

### Services (Lógica)

#### **gameService.ts**
Maneja todas las operaciones del juego:
- Crear/unir partidas
- Actualizar estado
- Gestionar turnos
- Sistema de buzzer

#### **questionService.ts**
Genera y gestiona preguntas:
- Banco de preguntas estáticas
- Sistema anti-repetición
- Selección por categoría/dificultad

#### **geminiService.ts**
Integración con Gemini AI:
- Generación dinámica de preguntas
- Parsing de respuestas JSON
- Manejo de errores

### Store (Estado Global)

```typescript
interface GameStore {
  gameId: string | null;
  playerId: string | null;
  playerRole: 'player' | 'moderator' | null;
  gameState: GameState | null;
  currentPlayer: Player | null;
}
```

---

## 🔌 Integraciones Externas

### Firebase Realtime Database

**Propósito**: Base de datos NoSQL en tiempo real

**Características Utilizadas**:
- Sincronización automática
- Listeners en tiempo real
- Estructura JSON
- Offline persistence (built-in)

**Endpoints**:
```
/games/{gameId}
  ├─ id
  ├─ code
  ├─ status
  ├─ players/
  ├─ currentQuestion
  └─ settings
```

### Gemini AI API

**Propósito**: Generación de preguntas con IA

**Modelo**: `gemini-2.5-flash`

**Endpoint**:
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

**Request**:
```json
{
  "contents": [{
    "parts": [{
      "text": "Genera una pregunta de trivia..."
    }]
  }],
  "generationConfig": {
    "temperature": 0.9,
    "topK": 40,
    "topP": 0.95
  }
}
```

---

## 🚀 Tecnologías Clave

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| React | UI Framework | 18.3.1 |
| TypeScript | Type Safety | 5.5.4 |
| Vite | Build Tool | 5.4.2 |
| Tailwind CSS | Estilos | 3.4.10 |
| Zustand | Estado Global | 4.5.5 |
| Firebase | Backend/DB | 10.13.0 |
| React Router | Routing | 6.26.0 |
| Lucide React | Iconos | 0.436.0 |

---

## 📦 Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
│   └── ui/           # Componentes base (Button, Card, Input)
├── lib/              # Utilidades y configuración
│   ├── firebase.ts   # Config de Firebase
│   └── utils.ts      # Funciones utilitarias
├── pages/            # Vistas principales
│   ├── HomePage.tsx
│   ├── CreateGamePage.tsx
│   ├── ModeratorView.tsx
│   ├── PlayerView.tsx
│   └── SpectatorView.tsx
├── services/         # Lógica de negocio
│   ├── gameService.ts
│   ├── questionService.ts
│   └── geminiService.ts
├── store/            # Estado global
│   └── gameStore.ts
├── types/            # Tipos TypeScript
│   └── game.ts
├── App.tsx           # Componente raíz
├── main.tsx          # Entry point
└── index.css         # Estilos globales
```

---

## 🔐 Seguridad

### Protección de API Keys

```typescript
// ✅ Correcto: Variables de entorno
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ❌ Incorrecto: Hardcoded
const API_KEY = "AIzaSy..."; // ¡NO HACER!
```

### Firebase Rules

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": "!data.exists() || data.child('moderatorId').val() === auth.uid"
      }
    }
  }
}
```

### Validación de Datos

```typescript
// Validar entrada del usuario
const validateGameCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};
```

---

## 🎯 Escalabilidad

### Horizontal

- **Firebase**: Escala automáticamente
- **Vercel**: Edge functions y CDN global
- **Gemini AI**: Rate limiting incorporado

### Vertical

- **Code Splitting**: Vite divide el código automáticamente
- **Lazy Loading**: Componentes cargados bajo demanda
- **Memoization**: React.memo para optimización

```typescript
const PlayerView = React.memo(() => {
  // Componente optimizado
});
```

---

## 🔄 Ciclo de Vida de una Partida

```
1. CREAR JUEGO
   Moderator → createGame() → Firebase

2. UNIRSE
   Players → joinGame(code) → Firebase
   
3. INICIAR
   Moderator → startGame() → status: 'playing'
   
4. JUGAR
   Loop:
     - generateQuestion()
     - updateCurrentQuestion()
     - Jugador responde
     - updatePlayerScore()
     - nextRound()
   
5. FINALIZAR
   round > maxRounds → status: 'finished'
   
6. RESULTADOS
   Mostrar ganador y estadísticas
```

---

## 📊 Métricas y Monitoreo

### Performance

- **Tiempo de carga inicial**: < 2s
- **Sincronización en tiempo real**: < 100ms
- **Generación de pregunta (Gemini)**: 2-5s
- **Generación de pregunta (Local)**: < 10ms

### Disponibilidad

- **Firebase uptime**: 99.95%
- **Vercel uptime**: 99.99%
- **Fallback local**: 100% (siempre disponible)

---

## 🔗 Próximos Pasos

Para profundizar en aspectos específicos:

- [Estructura del Proyecto](./project-structure.md)
- [Flujo de Datos Detallado](./data-flow.md)
- [Stack Tecnológico](./tech-stack.md)
- [Servicios y APIs](../api/)

---

**¿Preguntas sobre la arquitectura?** Consulta los documentos específicos o abre un [issue en GitHub](https://github.com/davidB2ya/Quick-Question/issues).
