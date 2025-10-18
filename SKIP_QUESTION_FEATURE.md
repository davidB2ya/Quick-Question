# Funcionalidad: Saltar Pregunta

## ¿Qué hace?

El moderador ahora puede saltar una pregunta sin que cuente como ronda completada. Esto es útil cuando:

- Se repite una pregunta que ya salió antes
- La pregunta está mal formulada 
- Hay algún problema técnico con la pregunta
- Se necesita generar una nueva pregunta por cualquier motivo

## ¿Cómo usarlo?

### 1. Durante el juego activo
Cuando aparece una pregunta, el moderador verá estos botones:
- ✅ **Respuesta Correcta (+10)** - Marca respuesta correcta y suma puntos
- ❌ **Respuesta Incorrecta** - Marca respuesta incorrecta 
- 🔄 **Saltar** - Salta la pregunta SIN avanzar la ronda
- ⏭️ **Rendirse** (solo en modo buzzer) - Todos se rinden y avanza ronda

### 2. Durante modo buzzer (esperando respuesta)
Cuando están esperando que alguien presione el buzzer:
- ⏭️ **Todos se Rinden** - Avanza ronda
- 🔄 **Saltar** - Salta la pregunta SIN avanzar la ronda

## Diferencia clave

- **Saltar pregunta**: Nueva pregunta, MISMA ronda
- **Respuesta incorrecta/Rendirse**: Nueva pregunta, SIGUIENTE ronda

## Implementación técnica

- Función `skipQuestion()` en `gameService.ts`
- Limpia el estado actual sin incrementar `round`
- Genera nueva pregunta automáticamente
- Mantiene todos los puntajes y estado del juego