# 🔥 Configuración de Firebase

Firebase es la base de datos en tiempo real que permite la sincronización instantánea entre todos los dispositivos conectados al juego.

---

## 📋 Prerrequisitos

- Cuenta de Google
- Proyecto Quick Question instalado localmente

---

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Ingresa un nombre para tu proyecto (ej: `quick-question-dev`)
4. (Opcional) Configura Google Analytics
5. Haz clic en **"Crear proyecto"**

### 2. Registrar Aplicación Web

1. En la consola de Firebase, haz clic en el ícono **Web** (`</>`)
2. Registra tu app con un nickname (ej: `Quick Question Web`)
3. **No** marques "Firebase Hosting" por ahora
4. Haz clic en **"Registrar app"**

### 3. Copiar Configuración

Verás un código de configuración similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 4. Configurar Variables de Entorno

Abre tu archivo `.env` y completa con los valores de Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🗄️ Configurar Realtime Database

### 1. Crear Base de Datos

1. En el menú lateral, ve a **"Build" → "Realtime Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona una ubicación (recomendado: `us-central1` para mejor rendimiento)
4. Selecciona **"Iniciar en modo de prueba"** (configuraremos seguridad después)
5. Haz clic en **"Habilitar"**

### 2. Configurar Reglas de Seguridad

#### Para Desarrollo:

En la pestaña **"Reglas"**, usa estas reglas permisivas:

```json
{
  "rules": {
    "games": {
      ".read": true,
      ".write": true,
      ".indexOn": ["code", "status"]
    }
  }
}
```

⚠️ **ADVERTENCIA**: Estas reglas permiten lectura/escritura sin autenticación. Son solo para desarrollo.

#### Para Producción:

Usa reglas más estrictas:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": "!data.exists() || data.child('moderatorId').val() === auth.uid",
        ".indexOn": ["code", "status"],
        "players": {
          "$playerId": {
            ".write": "!data.exists() || $playerId === auth.uid"
          }
        }
      }
    }
  }
}
```

### 3. Estructura de Datos Esperada

Firebase almacenará los juegos con esta estructura:

```json
{
  "games": {
    "game_id_123": {
      "id": "game_id_123",
      "code": "ABC123",
      "moderatorId": "moderator_user_id",
      "status": "playing",
      "round": 5,
      "createdAt": 1234567890,
      "settings": {
        "maxPlayers": 4,
        "roundsPerGame": 10,
        "categories": ["deportes", "musica", "historia"],
        "turnMode": "automatic",
        "difficultyLevel": "medium"
      },
      "players": {
        "player_id_1": {
          "id": "player_id_1",
          "name": "Juan",
          "score": 30,
          "isActive": true
        },
        "player_id_2": {
          "id": "player_id_2",
          "name": "María",
          "score": 40,
          "isActive": true
        }
      },
      "currentQuestion": {
        "id": "q_123",
        "category": "deportes",
        "question": "¿Cuántos jugadores...",
        "answer": "11",
        "difficulty": "easy",
        "funFact": "El fútbol es..."
      },
      "currentPlayerTurn": "player_id_1"
    }
  }
}
```

---

## ✅ Verificar Configuración

### 1. Probar Conexión

Inicia tu aplicación:

```bash
npm run dev
```

### 2. Crear un Juego de Prueba

1. Ve a la página de crear juego
2. Configura los parámetros
3. Crea el juego

### 3. Verificar en Firebase

1. Ve a Firebase Console → Realtime Database
2. Deberías ver el nodo `games` con tu juego creado
3. Si ves los datos, ¡la conexión funciona! ✅

---

## 🔒 Seguridad para Producción

### Habilitar App Check (Recomendado)

1. Ve a **"Build" → "App Check"**
2. Haz clic en **"Get started"**
3. Registra tu app web
4. Selecciona **reCAPTCHA v3**
5. Sigue las instrucciones de configuración

### Limitar Lecturas/Escrituras

Implementa límites en las reglas:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('moderatorId').val() === auth.uid)",
        ".validate": "newData.hasChildren(['id', 'code', 'status', 'players', 'settings'])"
      }
    }
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "Permission denied"

**Causa**: Reglas de seguridad muy restrictivas
**Solución**: Revisa las reglas en Firebase Console → Realtime Database → Rules

### Error: "Firebase not initialized"

**Causa**: Variables de entorno no configuradas correctamente
**Solución**: 
1. Verifica que el archivo `.env` esté en la raíz
2. Verifica que las variables comiencen con `VITE_`
3. Reinicia el servidor de desarrollo

### Los datos no se sincronizan

**Causa**: Posible problema de red o configuración
**Solución**:
1. Verifica tu conexión a internet
2. Revisa la consola del navegador para errores
3. Verifica que `databaseURL` apunte a tu base de datos

---

## 📊 Monitoreo y Uso

### Ver Uso en Tiempo Real

En Firebase Console, ve a:
- **"Realtime Database" → "Uso"** - Ver lecturas/escrituras
- **"Analytics"** - Ver estadísticas de uso

### Límites del Plan Gratuito (Spark)

- **Almacenamiento**: 1 GB
- **Descargas**: 10 GB/mes
- **Conexiones simultáneas**: 100

Para más, considera actualizar al plan Blaze (pago por uso).

---

## ✨ Optimizaciones

### Indexar Campos

Para mejorar el rendimiento de consultas:

```json
{
  "rules": {
    "games": {
      ".indexOn": ["code", "status", "createdAt"]
    }
  }
}
```

### Limpiar Juegos Antiguos

Considera implementar una Cloud Function para eliminar juegos con más de 24 horas:

```javascript
// functions/index.js (no incluido en este proyecto por defecto)
exports.cleanupOldGames = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const snapshot = await admin.database()
      .ref('games')
      .orderByChild('createdAt')
      .endAt(Date.now() - 86400000) // 24 horas
      .once('value');
    
    const updates = {};
    snapshot.forEach(child => {
      updates[child.key] = null;
    });
    
    return admin.database().ref('games').update(updates);
  });
```

---

## 🔗 Enlaces Útiles

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Realtime Database Rules](https://firebase.google.com/docs/database/security)
- [Firebase Console](https://console.firebase.google.com/)

---

**¿Problemas con Firebase?** Consulta la [sección de troubleshooting](../troubleshooting/common-issues.md#firebase-issues) o contacta soporte.
