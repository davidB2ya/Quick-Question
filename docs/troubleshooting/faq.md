# ❓ Preguntas Frecuentes (FAQ)

Respuestas a las preguntas más comunes sobre Quick Question.

---

## 🚀 Inicio y Configuración

### ¿Qué necesito para ejecutar Quick Question?

**Requisitos mínimos**:
- Node.js v18 o superior
- Cuenta de Firebase (gratuita)
- API Key de Gemini AI (gratuita)
- Navegador web moderno

Ver [Guía de Instalación](../setup/installation.md) para más detalles.

### ¿Es gratis usar Quick Question?

**Sí**, Quick Question es completamente gratuito y open source.

**Costos externos** (opcionales):
- Firebase Spark Plan: Gratis (hasta 100 conexiones simultáneas)
- Gemini AI: Gratis (con límites de uso razonable)
- Hosting en Vercel: Gratis

### ¿Dónde obtengo las API Keys?

- **Firebase**: [console.firebase.google.com](https://console.firebase.google.com/) - Ver [Guía de Firebase](../setup/firebase.md)
- **Gemini AI**: [makersuite.google.com](https://makersuite.google.com/app/apikey) - Ver [Guía de Gemini](../setup/gemini.md)

---

## 🎮 Jugabilidad

### ¿Cuántos jugadores pueden jugar?

**De 2 a 4 jugadores** por partida.

Además, puedes tener **espectadores ilimitados** que observan sin ocupar slots de jugador.

### ¿Cuántas rondas tiene una partida?

El moderador puede configurar **entre 5 y 20 rondas** al crear el juego.

### ¿Qué categorías hay disponibles?

Hay **6 categorías**:
- ⚽ Deportes
- 🎵 Música
- 📜 Historia
- 🔬 Ciencia
- 🎬 Entretenimiento
- 🌍 Geografía

Puedes seleccionar una, varias o todas las categorías.

### ¿Las preguntas son siempre las mismas?

**No**. Quick Question usa dos sistemas:

1. **Gemini AI** (principal): Genera preguntas nuevas y únicas cada vez
2. **Banco estático** (fallback): Banco de ~2000 preguntas pre-escritas

Además, el **sistema anti-repetición** asegura que no se repitan preguntas en la misma partida.

### ¿Qué es el modo buzzer?

En el modo buzzer, los jugadores compiten por presionar primero un botón para ganar el turno de responder.

**Dos variantes**:
- **Player Press**: Los jugadores presionan en pantalla
- **Moderator Select**: El moderador selecciona manualmente quién presionó primero (útil con buzzers físicos)

Ver [Modo Buzzer](../features/buzzer-mode.md) para más detalles.

### ¿Puedo usar buzzers físicos?

**Sí**, usa el modo **"Moderator Select"**:
1. Configura el juego con `buzzerMode: 'moderator-select'`
2. Los jugadores levantan la mano o presionan su buzzer físico
3. El moderador selecciona manualmente en pantalla quién fue primero

---

## 🔧 Problemas Técnicos

### El servidor no inicia

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error: "Firebase permission denied"

**Causa**: Reglas de seguridad muy restrictivas

**Solución**: Revisa las reglas en Firebase Console:
```json
{
  "rules": {
    "games": {
      ".read": true,
      ".write": true
    }
  }
}
```

Ver [Configuración de Firebase](../setup/firebase.md#configurar-reglas-de-seguridad).

### Error: "Gemini API quota exceeded"

**Causa**: Has excedido el límite de solicitudes por minuto

**Solución**:
1. Espera 1 minuto (la cuota se restablece)
2. El juego automáticamente usará el banco estático de preguntas
3. Considera implementar caché de preguntas

### Las preguntas se repiten mucho

**Verificar**:
1. ¿Gemini AI está configurado? → Ver consola del navegador
2. ¿El sistema anti-repetición está activo? → Debería estarlo por defecto

**Solución temporal**: El banco estático tiene ~2000 preguntas. Si juegas muchas partidas seguidas, puede haber algunas repeticiones.

### No se sincronizan los cambios entre dispositivos

**Causas comunes**:
1. Problema de red
2. Firebase no configurado correctamente
3. Versión antigua del navegador

**Solución**:
1. Verifica conexión a internet
2. Recarga la página (F5)
3. Verifica en Firebase Console que los datos se guardan
4. Actualiza tu navegador

---

## 🎯 Funcionalidades

### ¿Puedo saltar una pregunta?

**Sí**, el moderador tiene un botón **"Saltar"** (🔄).

**Diferencia**:
- **Saltar**: Nueva pregunta, misma ronda
- **Rendirse**: Nueva pregunta, siguiente ronda

Ver [Saltar Preguntas](../features/skip-question.md).

### ¿Qué es un espectador?

Un **espectador** puede observar el juego en tiempo real sin ocupar un slot de jugador.

**Puede ver**:
- Preguntas
- Puntajes
- Quién tiene el turno

**No puede ver**:
- Respuestas correctas
- Datos curiosos

Ver [Vista de Espectador](../features/spectator-view.md).

### ¿Puedo personalizar los puntos?

Actualmente, cada respuesta correcta vale **10 puntos** (fijo).

**Próxima versión**: Configuración de puntos personalizados.

### ¿Se guardan las partidas?

Actualmente **no**. Cuando el juego termina, los datos permanecen en Firebase pero no hay historial persistente.

**Próxima versión**: Historial de partidas y rankings.

---

## 🌐 Deployment y Producción

### ¿Cómo hago deploy en producción?

**Opción recomendada: Vercel**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel
```

Ver [Guía de Deployment](../development/deployment.md) para más opciones.

### ¿Necesito cambiar las reglas de Firebase para producción?

**Sí**, las reglas de desarrollo son muy permisivas.

**Reglas de producción recomendadas**:
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

### ¿Cuánto cuesta el hosting?

**Vercel**: Gratis (Hobby Plan) - Suficiente para proyectos personales

**Firebase**:
- Spark Plan (Gratuito): 100 conexiones simultáneas
- Blaze Plan (Pago por uso): Sin límites

### ¿Funciona en móviles?

**Sí**, Quick Question es totalmente responsive y funciona en:
- 📱 iOS (Safari)
- 📱 Android (Chrome)
- 💻 Desktop
- 📺 Smart TVs con navegador

---

## 👥 Contribución

### ¿Puedo contribuir al proyecto?

**¡Sí!** Las contribuciones son bienvenidas.

Ver [Guía de Contribución](../development/contributing.md).

### ¿Dónde reporto bugs?

En GitHub Issues: [github.com/davidB2ya/Quick-Question/issues](https://github.com/davidB2ya/Quick-Question/issues)

### ¿Puedo agregar nuevas categorías?

**Sí**, necesitas:

1. Agregar la categoría en `types/game.ts`:
```typescript
export type CategoryType = 
  | 'deportes' 
  | 'musica' 
  // ...
  | 'tu_nueva_categoria';
```

2. Agregar tema en `geminiService.ts`:
```typescript
const CATEGORY_THEMES: Record<CategoryType, string> = {
  // ...
  tu_nueva_categoria: 'descripción del tema',
};
```

3. Agregar preguntas en `questionService.ts`

4. Agregar emoji en `utils.ts`

---

## 🔒 Seguridad y Privacidad

### ¿Se guardan datos personales?

**Solo lo necesario**:
- Nombre del jugador (temporal)
- Puntajes de la partida

**No se guardan**:
- Emails
- Contraseñas
- Información personal

### ¿Los datos son privados?

**Actualmente**: Las partidas son públicas (cualquiera con el código puede unirse)

**Próxima versión**: Opción de partidas privadas con autenticación.

### ¿Las API Keys están seguras?

**Sí**, si las guardas en variables de entorno (`.env`).

**Importante**:
- ✅ **NUNCA** commitees el archivo `.env` a Git
- ✅ El `.gitignore` ya excluye `.env`
- ✅ Usa variables de entorno en producción (Vercel, etc.)

---

## 📱 Casos de Uso

### ¿Para qué contextos es ideal Quick Question?

**Perfecto para**:
- 🎓 Aulas educativas
- 🏠 Reuniones familiares
- 🎉 Fiestas y eventos
- 💼 Team building empresarial
- 🎮 Streamers y contenido online
- 📺 Presentaciones en proyector

### ¿Puedo usar Quick Question offline?

**Parcialmente**:
- ✅ El banco estático funciona offline
- ❌ Firebase requiere conexión (sincronización)
- ❌ Gemini AI requiere conexión

**Próxima versión**: PWA con soporte offline completo.

---

## 🔮 Roadmap

### ¿Qué mejoras están planeadas?

Ver el roadmap completo en GitHub, pero algunas incluyen:

- [ ] Historial de partidas
- [ ] Rankings globales
- [ ] Autenticación de usuarios
- [ ] Más categorías
- [ ] Modo por tiempo
- [ ] Efectos de sonido
- [ ] PWA (offline)
- [ ] Multi-idioma

---

## ❓ ¿No encuentras tu respuesta?

- 📧 Email: [tu-email@ejemplo.com]
- 💬 Discord: [Próximamente]
- 🐛 GitHub Issues: [Reportar problema](https://github.com/davidB2ya/Quick-Question/issues)
- 📖 Documentación completa: [/docs](../README.md)

---

**Última actualización**: Octubre 2025
