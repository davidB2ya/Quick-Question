# 🎯 Sistema de Puntaje Dinámico - Guía Rápida

## 📋 Reglas Simples

```
┌──────────────────────────────────────┐
│  PRIMERA RESPUESTA CORRECTA          │
│           +10 puntos 🎉              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  SEGUNDA+ RESPUESTA CORRECTA         │
│            +8 puntos ✅              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│     RESPUESTA INCORRECTA             │
│            -5 puntos ❌              │
│  (El puntaje mínimo es 0)            │
└──────────────────────────────────────┘
```

---

## 🎮 Ejemplos Visuales

### Modo Buzzer - Escenario 1: Todos compiten

```
PREGUNTA: "¿Capital de Francia?"

    Ana 🔴 (presiona primero)
    Responde: "Londres" ❌
    Puntaje: -5 → 0 puntos
    
    Bob 🔴 (presiona segundo)
    Responde: "Madrid" ❌
    Puntaje: -5 → 0 puntos
    
    Carlos 🔴 (presiona tercero)
    Responde: "París" ✅
    Puntaje: +10 (es el PRIMERO correcto) → 10 puntos

RESULTADO:
┌─────────┬────────────┬────────┐
│ Jugador │  Respuesta │ Puntos │
├─────────┼────────────┼────────┤
│ Ana     │ ❌ Londres │   0    │
│ Bob     │ ❌ Madrid  │   0    │
│ Carlos  │ ✅ París   │  10    │
└─────────┴────────────┴────────┘
```

### Modo Automático - Escenario 2: Turnos

```
RONDA 1 - Turno de Ana
Pregunta: "¿Quién pintó la Mona Lisa?"
Ana responde: "Leonardo da Vinci" ✅
Puntaje: +10 (primera correcta de la ronda) → 10 puntos

RONDA 2 - Turno de Bob
Pregunta: "¿Cuántos continentes hay?"
Bob responde: "6" ❌
Puntaje: -5 → 0 puntos

RONDA 3 - Turno de Carlos
Pregunta: "¿Planeta más cercano al Sol?"
Carlos responde: "Mercurio" ✅
Puntaje: +10 (primera correcta de la ronda) → 10 puntos

TABLA DE POSICIONES:
┌─────────┬────────┐
│ Jugador │ Puntos │
├─────────┼────────┤
│ Ana     │   10   │ 🥇
│ Carlos  │   10   │ 🥇
│ Bob     │    0   │
└─────────┴────────┘
```

---

## 🔄 Flujo de Decisión del Moderador

```
          ┌─────────────────┐
          │  MODERADOR VE   │
          │   RESPUESTA     │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ ¿Es correcta?   │
          └────────┬────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    ✅ SÍ                  ❌ NO
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│ ¿Es el       │      │ Restar -5    │
│ primero?     │      │ puntos       │
└──────┬───────┘      └──────┬───────┘
       │                     │
   ┌───┴───┐                 │
   │       │                 │
   ▼       ▼                 ▼
  SÍ      NO          ┌──────────────┐
  +10     +8          │ Siguiente    │
                      │ jugador/     │
                      │ pregunta     │
                      └──────────────┘
```

---

## 📊 Estrategia de Juego

### Para Jugadores 🎮

```
ESTRATEGIA AGRESIVA (Riesgo Alto)
├─ Presionar buzzer rápidamente
├─ Responder aunque no esté 100% seguro
└─ Resultado: +10 si acierta | -5 si falla

ESTRATEGIA CONSERVADORA (Riesgo Bajo)
├─ Esperar a estar seguro antes de presionar
├─ Dejar que otros fallen primero
└─ Resultado: +8 si acierta de segundo | 0 si no presiona

ESTRATEGIA BALANCEADA (Recomendada)
├─ 80% seguro = Presionar
├─ Menos de 80% = Esperar
└─ Resultado: Mix de +10, +8, -5
```

### Para Moderadores 🎯

```
AL MARCAR CORRECTO:
✓ Verificar notificación: ¿Dice +10 o +8?
  → +10 = Primero en responder correctamente ✨
  → +8 = Segundo o posterior

AL MARCAR INCORRECTO:
✓ Verificar notificación: "❌ [Nombre] incorrecto. -5 puntos"
✓ En modo buzzer: Otro jugador puede intentar
✓ En modo automático: Pasa al siguiente turno
```

---

## 🏆 Tabla de Puntos por Escenario

| Escenario | Puntos | ¿Cuándo ocurre? |
|-----------|--------|-----------------|
| 🎯 Primero y correcto | **+10** | Primer jugador en responder bien |
| ✅ Segundo+ y correcto | **+8** | Del segundo en adelante |
| ❌ Incorrecta (con puntos) | **-5** | Tiene puntos: se restan 5 |
| 💡 Incorrecta (sin puntos) | **0** | Ya tiene 0: se mantiene en 0 |
| 🚫 No responde | **0** | No hay cambio |

---

## 🎨 Notificaciones en Pantalla

### Ejemplos Reales

```
┌──────────────────────────────────────┐
│ 🎉 Ana respondió primero! +10 puntos │ ← Verde
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ✅ Bob correcto! +8 puntos           │ ← Verde
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ❌ Carlos incorrecto. -5 puntos      │ ← Verde (no rojo)
└──────────────────────────────────────┘
```

**Nota:** Todas las notificaciones son verdes para mantener el ambiente positivo. El emoji indica el tipo de resultado.

---

## 🧮 Matemáticas Rápidas

### ¿Cuántas faltas puedo tener?

```
┌─────────────────────────────────────────┐
│ Si tienes 20 puntos:                    │
│ ├─ 1 falla: 20 - 5 = 15 puntos         │
│ ├─ 2 fallas: 20 - 10 = 10 puntos       │
│ ├─ 3 fallas: 20 - 15 = 5 puntos        │
│ └─ 4 fallas: 20 - 20 = 0 puntos        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Si tienes 0 puntos:                     │
│ ├─ 1 falla: 0 - 5 = 0 (protegido) ✅   │
│ ├─ 2 fallas: 0 - 5 = 0 (protegido) ✅   │
│ └─ N fallas: Siempre 0, nunca negativo │
└─────────────────────────────────────────┘
```

### ¿Cuántas correctas necesito para compensar?

```
┌─────────────────────────────────────────┐
│ 1 Falla (-5) = Necesitas:               │
│ ├─ 1 correcta como primero (+10) ✅     │
│ └─ 1 correcta como segundo (+8) ✅      │
└─────────────────────────────────────────┘

BALANCE:
  Falla + Correcto (primero) = +5 neto 📈
  Falla + Correcto (segundo) = +3 neto 📈
```

---

## 📈 Progresión Típica en una Partida

### Partida de 10 Rondas - Jugador Promedio

```
Ronda  Acción              Puntos  Total
────────────────────────────────────────
  1    ✅ Correcto (+10)     +10     10
  2    ❌ Incorrecto         -5       5
  3    ✅ Correcto (+8)      +8      13
  4    ✅ Correcto (+8)      +8      21
  5    ❌ Incorrecto         -5      16
  6    ✅ Correcto (+10)     +10     26
  7    ❌ Incorrecto         -5      21
  8    ✅ Correcto (+8)      +8      29
  9    ✅ Correcto (+8)      +8      37
 10    ✅ Correcto (+8)      +8      45
────────────────────────────────────────
        7 ✅ | 3 ❌                   45

ANÁLISIS:
• Correctas: 7 × 8-10 = ~60 puntos
• Incorrectas: 3 × -5 = -15 puntos
• Neto: 60 - 15 = 45 puntos ✅
```

### Partida de 10 Rondas - Jugador Agresivo

```
Ronda  Acción              Puntos  Total
────────────────────────────────────────
  1    ✅ Primero! (+10)     +10     10
  2    ✅ Primero! (+10)     +10     20
  3    ❌ Falló              -5      15
  4    ✅ Primero! (+10)     +10     25
  5    ❌ Falló              -5      20
  6    ❌ Falló              -5      15
  7    ✅ Primero! (+10)     +10     25
  8    ✅ Segundo (+8)       +8      33
  9    ❌ Falló              -5      28
 10    ✅ Primero! (+10)     +10     38
────────────────────────────────────────
        6 ✅ | 4 ❌                   38

ANÁLISIS:
• Más riesgo = Más +10s (5 veces)
• Más errores = Más -5s (4 veces)
• Total similar al jugador promedio
• Pero más emocionante! 🎢
```

---

## ✨ Tips y Trucos

### Para Maximizar Puntos 📈

1. **Ser el primero cuando estés seguro**
   - +10 vs +8 = 2 puntos de ventaja
   - 5 primeras respuestas = +10 puntos extra

2. **No arriesgues si tienes pocos puntos**
   - Con 3 puntos: 1 falla = 0 puntos
   - Mejor esperar a estar seguro

3. **Sé agresivo con puntos altos**
   - Con 30 puntos: 6 fallas = 0 puntos
   - Puedes arriesgar más

4. **Aprende de los errores de otros (modo buzzer)**
   - Si alguien falla, piensa más antes de presionar
   - Asegúrate de tener una respuesta diferente

### Para Moderadores 🎓

1. **Verifica las notificaciones**
   - Confirman que los puntos se aplicaron
   - Indican si fue +10, +8, o -5

2. **Explica el sistema a nuevos jugadores**
   - "Primera correcta = +10"
   - "Las demás correctas = +8"
   - "Fallas = -5, pero nunca puntaje negativo"

3. **Mantén el ritmo**
   - Las notificaciones son automáticas
   - Solo marca ✅ o ❌

---

## 🎯 Resumen Ultra-Rápido

```
╔═══════════════════════════════════════╗
║                                       ║
║   PRIMERO CORRECTO:    +10 🎉        ║
║   RESTO CORRECTOS:     +8  ✅        ║
║   INCORRECTOS:         -5  ❌        ║
║   MÍNIMO:              0   🛡️        ║
║                                       ║
╚═══════════════════════════════════════╝

        ¡A jugar y divertirse! 🚀
```

---

_Versión: 1.0_  
_Última actualización: ${new Date().toLocaleDateString('es-ES')}_
