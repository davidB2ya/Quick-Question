# 🤖 Configuración de Gemini AI

Gemini AI de Google es la inteligencia artificial que genera preguntas de trivia dinámicas, frescas y divertidas para Quick Question.

---

## 📋 ¿Qué es Gemini AI?

Gemini es el modelo de IA de Google que sucede a PaLM 2. Permite generar texto conversacional de alta calidad, perfecto para crear preguntas de trivia originales en español con humor y contexto cultural.

**Ventajas**:
- ✅ Preguntas siempre nuevas y variadas
- ✅ Adaptadas al contexto colombiano/latinoamericano
- ✅ Con datos curiosos relevantes
- ✅ Nivel de dificultad ajustable
- ✅ Respuestas en formato JSON estructurado

---

## 🚀 Obtener API Key

### 1. Acceder a Google AI Studio

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Acepta los términos y condiciones

### 2. Crear API Key

1. Haz clic en **"Get API Key"** o **"Create API Key"**
2. Selecciona o crea un proyecto de Google Cloud
3. Copia la API Key generada

**Ejemplo**:
```
AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **Importante**: Guarda esta clave de forma segura. No la compartas públicamente.

### 3. Configurar Variable de Entorno

Abre tu archivo `.env` y agrega:

```env
VITE_GEMINI_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔧 Configuración en el Proyecto

### Modelo Utilizado

Quick Question usa el modelo **`gemini-2.5-flash`** por defecto:

```typescript
// src/services/geminiService.ts
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
```

### Modelos Disponibles

| Modelo | Características | Recomendado Para |
|--------|-----------------|------------------|
| `gemini-2.5-flash` | Rápido, eficiente, bajo costo | Producción ✅ |
| `gemini-pro` | Balanceado, buena calidad | Alternativa |
| `gemini-ultra` | Máxima calidad, más caro | No disponible aún |

### Configuración de Generación

```typescript
generationConfig: {
  temperature: 0.9,      // Creatividad (0.0 - 1.0)
  topK: 40,              // Diversidad de respuestas
  topP: 0.95,            // Probabilidad acumulativa
  maxOutputTokens: 1024, // Tokens máximos de salida
}
```

**Ajustes**:
- `temperature`: Más alto = más creativo, más bajo = más conservador
- `topK`: Número de tokens a considerar
- `topP`: Umbral de probabilidad acumulativa

---

## 📊 Estructura de Prompts

### Prompt del Sistema

```typescript
const systemPrompt = `Eres un experto en crear preguntas de trivia divertidas para jóvenes colombianos. 
Crea preguntas sobre ${CATEGORY_THEMES[category]}.

Responde SOLO con un JSON válido con esta estructura exacta:
{
  "question": "la pregunta aquí",
  "answer": "la respuesta aquí",
  "difficulty": "${difficulty}",
  "funFact": "un dato curioso relacionado"
}

IMPORTANTE:
- La pregunta debe ser clara y divertida
- La respuesta debe ser concisa (una palabra, fecha, nombre corto)
- El funFact debe ser interesante y relacionado
- No incluyas explicaciones adicionales, solo el JSON
- Asegúrate de que el JSON sea válido`;
```

### Temas por Categoría

```typescript
const CATEGORY_THEMES: Record<CategoryType, string> = {
  deportes: 'deportes, atletas, equipos, competencias, con humor para jóvenes',
  musica: 'música, artistas, géneros musicales, letras, con humor para jóvenes',
  historia: 'eventos históricos, personajes, fechas importantes, con humor para jóvenes',
  ciencia: 'ciencia, inventos, científicos, fenómenos naturales, con humor para jóvenes',
  entretenimiento: 'películas, series, celebridades, memes, con humor para jóvenes',
  geografia: 'países, ciudades, monumentos, culturas, con humor para jóvenes',
};
```

---

## 🔄 Sistema de Fallback

Si Gemini AI falla, Quick Question tiene un **banco de preguntas estáticas** como respaldo:

```typescript
// En questionService.ts
export const generateQuestionTry = async (
  category: CategoryType,
  difficulty: DifficultyLevel = 'medium',
  gameId?: string
): Promise<Question> => {
  try {
    // Intentar generar pregunta con IA
    const aiQuestion = await generateQuestion(category, difficulty);
    return aiQuestion;
  } catch (error) {
    console.warn('Error al generar pregunta con IA, usando banco estático:', error);
    // Fallback al banco estático
    return await generateQuestionFromBank(category, difficulty);
  }
};
```

**Ventajas del Fallback**:
- ✅ El juego nunca se detiene por fallos de API
- ✅ Experiencia consistente para el usuario
- ✅ Ahorro de costos si hay límite de API alcanzado

---

## 💰 Costos y Límites

### Plan Gratuito

Google AI Studio ofrece acceso gratuito con límites:

- **Cuota**: 60 solicitudes por minuto (RPM)
- **Tokens**: Según el modelo
- **Costo**: $0 hasta cierto límite mensual

### Monitoreo de Uso

Para monitorear tu uso:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Navega a **"APIs & Services" → "Dashboard"**
3. Selecciona **"Generative Language API"**
4. Revisa las métricas de uso

### Optimización de Costos

```typescript
// Implementar caché simple
const questionCache = new Map<string, Question>();

export async function generateQuestionCached(
  category: CategoryType,
  difficulty: DifficultyLevel
): Promise<Question> {
  const cacheKey = `${category}-${difficulty}`;
  
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }
  
  const question = await generateQuestion(category, difficulty);
  questionCache.set(cacheKey, question);
  
  return question;
}
```

---

## ✅ Verificar Configuración

### 1. Probar Generación de Pregunta

```bash
npm run dev
```

### 2. Crear un Juego

1. Configura un juego con cualquier categoría
2. Inicia el juego
3. Observa si se genera una pregunta

### 3. Revisar Consola

Abre las **DevTools del navegador** (F12):

```javascript
// Si funciona, verás:
✅ Pregunta generada con Gemini AI

// Si falla:
❌ Error al generar pregunta con IA, usando banco estático
```

---

## 🐛 Solución de Problemas

### Error: "API key not valid"

**Causa**: API Key incorrecta o no configurada
**Solución**:
1. Verifica que la variable `VITE_GEMINI_API_KEY` esté en `.env`
2. Verifica que la API Key sea correcta
3. Reinicia el servidor de desarrollo

### Error: "Model gemini-2.5-flash not found"

**Causa**: Modelo no disponible en tu región o cuenta
**Solución**: Cambia al modelo `gemini-pro`:

```typescript
// src/services/geminiService.ts
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

### Error: "Quota exceeded"

**Causa**: Has excedido tu límite de solicitudes
**Solución**:
1. Espera a que se restablezca la cuota (cada minuto)
2. El sistema usará automáticamente el banco estático
3. Considera implementar caché de preguntas

### Respuestas Vacías o Mal Formateadas

**Causa**: Problemas con el parsing de JSON
**Solución**: El código ya tiene manejo de errores:

```typescript
const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('No se pudo extraer JSON de la respuesta');
}
const questionData = JSON.parse(jsonMatch[0]);
```

---

## 🎯 Mejores Prácticas

### 1. Rate Limiting

```typescript
// Implementar delay entre solicitudes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateMultipleQuestions(count: number) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(await generateQuestion(category, difficulty));
    await delay(1000); // Esperar 1 segundo entre solicitudes
  }
  return questions;
}
```

### 2. Manejo de Errores Robusto

```typescript
try {
  const question = await generateQuestion(category, difficulty);
  return question;
} catch (error) {
  console.error('Error al generar pregunta:', error);
  // Fallback a banco estático
  return generateQuestionFromBank(category, difficulty);
}
```

### 3. Validación de Respuestas

```typescript
// Validar que la pregunta tenga todos los campos
if (!questionData.question || !questionData.answer) {
  throw new Error('Respuesta incompleta de Gemini');
}
```

---

## 🔗 Enlaces Útiles

- [Google AI Studio](https://makersuite.google.com/)
- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Modelos Disponibles](https://ai.google.dev/models/gemini)
- [Pricing](https://ai.google.dev/pricing)

---

## 📈 Próximas Mejoras

Ideas para mejorar la integración con Gemini:

- [ ] Implementar caché de preguntas generadas
- [ ] Pre-generar preguntas en background
- [ ] Personalización del tono según la audiencia
- [ ] Generación de preguntas multi-idioma
- [ ] Análisis de dificultad automático

---

**¿Problemas con Gemini AI?** Revisa la [sección de troubleshooting](../troubleshooting/common-issues.md#gemini-ai-issues) o contacta soporte.
