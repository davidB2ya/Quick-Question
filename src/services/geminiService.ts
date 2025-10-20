import { CategoryType, DifficultyLevel, Question } from '../types/game';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Timeout para las peticiones a la API (10 segundos)
const API_TIMEOUT = 10000;

// Caché simple para preguntas recientes (evita llamadas repetidas)
const questionCache: Map<string, Question[]> = new Map();
const CACHE_SIZE = 3; // Preguntas en caché por categoría/dificultad

const CATEGORY_THEMES: Record<CategoryType, string> = {
  deportes: 'deportes, atletas, equipos, competencias',
  musica: 'música, artistas, géneros musicales, canciones',
  historia: 'eventos históricos, personajes, fechas importantes',
  ciencia: 'ciencia, inventos, científicos, descubrimientos',
  entretenimiento: 'películas, series, celebridades, cultura pop',
  geografia: 'países, ciudades, monumentos, geografía mundial',
};

// Función helper para hacer fetch con timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La petición excedió el tiempo límite');
    }
    throw error;
  }
}

export async function generateQuestion(
  category: CategoryType,
  difficulty: DifficultyLevel
): Promise<Question> {
  // Intentar usar caché primero
  const cacheKey = `${category}_${difficulty}`;
  const cached = questionCache.get(cacheKey);
  
  if (cached && cached.length > 0) {
    // Devolver y remover la pregunta del caché
    const question = cached.shift()!;
    console.log(`✅ Pregunta obtenida del caché (${cacheKey})`);
    return question;
  }

  console.log(`🔄 Generando nueva pregunta con IA (${cacheKey})...`);

  const systemPrompt = `Eres un experto en crear preguntas de trivia CORTAS y directas para jóvenes. 
Tema: ${CATEGORY_THEMES[category]}.

REGLAS ESTRICTAS:
1. La PREGUNTA debe ser MUY CORTA (máximo 10-20 palabras)
2. La RESPUESTA debe ser BREVE (1-3 palabras, o una fecha/número)
3. El FUN FACT debe ser corto e interesante (máximo 15 palabras)
4. Preguntas claras y directas, sin rodeos
5. Adecuado para jóvenes latinoamericanos

Responde SOLO con JSON válido (sin markdown, sin explicaciones):
{
  "question": "pregunta corta aquí",
  "answer": "respuesta breve",
  "difficulty": "${difficulty}",
  "funFact": "dato curioso corto"
}`;

  const userPrompt = `Genera 1 pregunta de ${category}, dificultad ${difficulty}. Que sea CORTA y DIRECTA.`;

  try {
    const response = await fetchWithTimeout(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${userPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 1024, // Aumentado para asegurar respuesta completa
          candidateCount: 1,
        }
      })
    }, API_TIMEOUT);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Gemini API (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Validar que la respuesta tenga la estructura esperada
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Respuesta de API inválida:', JSON.stringify(data, null, 2));
      throw new Error('Respuesta inválida de la API - sin candidates');
    }

    // Verificar si la respuesta fue cortada por límite de tokens
    const candidate = data.candidates[0];
    if (candidate.finishReason === 'MAX_TOKENS') {
      console.warn('⚠️ Respuesta cortada por MAX_TOKENS, aumentando límite...');
      throw new Error('Respuesta incompleta - MAX_TOKENS alcanzado');
    }

    // Validar que exista parts
    const content = candidate.content;
    if (!content.parts || !Array.isArray(content.parts) || content.parts.length === 0) {
      console.error('Respuesta de API sin parts:', JSON.stringify(data, null, 2));
      throw new Error('Respuesta inválida de la API - sin parts');
    }

    // Validar que el primer part tenga texto
    if (!content.parts[0].text) {
      console.error('Respuesta de API sin texto:', JSON.stringify(data, null, 2));
      throw new Error('Respuesta inválida de la API - sin texto');
    }

    const generatedText = content.parts[0].text;
    
    // Limpiar el texto (remover markdown, espacios extras, etc.)
    let cleanedText = generatedText
      .replaceAll(/```json\n?/g, '')
      .replaceAll(/```\n?/g, '')
      .trim();
    
    // Extraer JSON del texto
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const questionData = JSON.parse(jsonMatch[0]);

    // Validar que los campos existan
    if (!questionData.question || !questionData.answer) {
      throw new Error('JSON inválido: faltan campos requeridos');
    }

    // Crear el objeto Question con ID único
    const question: Question = {
      id: `${category.substring(0, 3)}_${difficulty.substring(0, 3)}_${Date.now()}`,
      category,
      question: questionData.question.trim(),
      answer: questionData.answer.trim(),
      difficulty: questionData.difficulty || difficulty,
      funFact: questionData.funFact?.trim() || 'Dato curioso no disponible'
    };

    // Pre-cargar caché en segundo plano (sin bloquear)
    preloadCache(category, difficulty).catch(err => 
      console.warn('Error precargando caché:', err)
    );

    return question;

  } catch (error) {
    console.error('Error generando pregunta con Gemini:', error);
    throw error;
  }
}

// Función auxiliar para pre-cargar caché en segundo plano
async function preloadCache(category: CategoryType, difficulty: DifficultyLevel): Promise<void> {
  const cacheKey = `${category}_${difficulty}`;
  const cached = questionCache.get(cacheKey) || [];
  
  // Solo pre-cargar si el caché está vacío o tiene pocas preguntas
  if (cached.length >= CACHE_SIZE) {
    return;
  }

  try {
    console.log(`📦 Pre-cargando caché para ${cacheKey}...`);
    
    const systemPrompt = `Eres un experto en crear preguntas de trivia CORTAS y directas para jóvenes. 
Tema: ${CATEGORY_THEMES[category]}.

REGLAS ESTRICTAS:
1. La PREGUNTA debe ser MUY CORTA (máximo 10-12 palabras)
2. La RESPUESTA debe ser BREVE (1-3 palabras, o una fecha/número)
3. El FUN FACT debe ser corto e interesante (máximo 15 palabras)

Responde SOLO con un array JSON de ${CACHE_SIZE} preguntas (sin markdown):
[
  {
    "question": "pregunta 1",
    "answer": "respuesta 1",
    "difficulty": "${difficulty}",
    "funFact": "dato 1"
  },
  {
    "question": "pregunta 2",
    "answer": "respuesta 2",
    "difficulty": "${difficulty}",
    "funFact": "dato 2"
  }
]`;

    const response = await fetchWithTimeout(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 1024,
          candidateCount: 1,
        }
      })
    }, API_TIMEOUT);

    if (response.ok) {
      try {
        const data = await response.json();
        
        // Validar estructura de respuesta
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          console.warn('Respuesta de caché inválida - sin candidates');
          return;
        }

        const content = data.candidates[0].content;
        if (!content.parts || !Array.isArray(content.parts) || content.parts.length === 0) {
          console.warn('Respuesta de caché inválida - sin parts');
          return;
        }

        if (!content.parts[0].text) {
          console.warn('Respuesta de caché inválida - sin texto');
          return;
        }

        const generatedText = content.parts[0].text;
        
        let cleanedText = generatedText
          .replaceAll(/```json\n?/g, '')
          .replaceAll(/```\n?/g, '')
          .trim();
        
        const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          const questions = JSON.parse(arrayMatch[0]);
        
          if (Array.isArray(questions)) {
            const validQuestions = questions
              .filter(q => q.question && q.answer)
              .map((q, index) => ({
                id: `${category.substring(0, 3)}_${difficulty.substring(0, 3)}_cache_${Date.now()}_${index}`,
                category,
                question: q.question.trim(),
                answer: q.answer.trim(),
                difficulty: q.difficulty || difficulty,
                funFact: q.funFact?.trim() || 'Dato curioso'
              }));
            
            questionCache.set(cacheKey, validQuestions);
            console.log(`✅ Caché cargado: ${validQuestions.length} preguntas para ${cacheKey}`);
          }
        }
      } catch (error) {
        console.warn('Error procesando respuesta de caché:', error);
      }
    }
  } catch (error) {
    console.warn('Error precargando caché (no crítico):', error);
  }
}

