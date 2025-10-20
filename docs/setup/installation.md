# 📦 Guía de Instalación

Esta guía te ayudará a instalar y configurar Quick Question en tu máquina local.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.x o superior)
- **npm** (versión 9.x o superior) o **yarn**
- **Git**
- Un editor de código (recomendado: VS Code)

### Verificar Instalaciones:

```bash
node --version  # Debe ser v18.x o superior
npm --version   # Debe ser v9.x o superior
git --version
```

---

## 🚀 Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/davidB2ya/Quick-Question.git
cd Quick-Question
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias:

#### Dependencias Principales:
- `react` y `react-dom` - Framework UI
- `firebase` - Base de datos en tiempo real
- `zustand` - Gestión de estado
- `react-router-dom` - Routing
- `lucide-react` - Iconos
- `tailwindcss` - Estilos
- `clsx` - Utilidad para clases CSS
- `react-confetti` - Animación de confetti
- `react-transition-group` - Transiciones

#### Dependencias de Desarrollo:
- `typescript` - Lenguaje tipado
- `vite` - Build tool
- `eslint` - Linter
- `@vitejs/plugin-react` - Plugin de Vite para React

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita el archivo `.env` y completa las variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Gemini AI API Key
VITE_GEMINI_API_KEY=tu_gemini_api_key_aqui
```

📝 **Nota**: Consulta las guías de configuración para obtener estas credenciales:
- [Configuración de Firebase](./firebase.md)
- [Configuración de Gemini AI](./gemini.md)

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173` (o el puerto disponible).

### 5. Verificar la Instalación

Abre tu navegador y ve a:
```
http://localhost:5173
```

Deberías ver la página de inicio de Quick Question.

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta el linter (ESLint) |

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

**Solución**: Elimina `node_modules` y reinstala:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 already in use"

**Solución**: Cambia el puerto en `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Cambia a otro puerto
  }
})
```

### Error: Firebase no conecta

**Solución**: Verifica que:
1. Las variables de entorno estén correctamente configuradas
2. El archivo `.env` esté en la raíz del proyecto
3. Las credenciales de Firebase sean válidas

Ver [Solución de Problemas Comunes](../troubleshooting/common-issues.md) para más ayuda.

---

## ✅ Siguiente Paso

Una vez instalado, procede a:
1. [Configurar Firebase](./firebase.md)
2. [Configurar Gemini AI](./gemini.md)
3. [Entender la Arquitectura](../architecture/overview.md)

---

## 💡 Consejos

- **Usa VS Code**: Recomendamos Visual Studio Code con las siguientes extensiones:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

- **Configura Git**: Asegúrate de que tu `.gitignore` incluya:
  ```
  node_modules/
  .env
  dist/
  .DS_Store
  ```

- **Hot Reload**: Vite proporciona recarga en caliente automática. Los cambios se verán instantáneamente.

---

**¿Problemas durante la instalación?** Consulta la sección de [Problemas Comunes](../troubleshooting/common-issues.md) o abre un [Issue en GitHub](https://github.com/davidB2ya/Quick-Question/issues).
