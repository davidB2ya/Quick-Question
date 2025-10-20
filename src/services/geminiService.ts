import { CategoryType, DifficultyType, Question } from '../types/game';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Usa tu variable de entorno
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const CATEGORY_THEMES: Record<CategoryType, string> = {
  deportes: 'deportes, atletas, equipos, competencias, con humor para jóvenes',
  musica: 'música, artistas, géneros musicales, letras, con humor para jóvenes',
  historia: 'eventos históricos, personajes, fechas importantes, con humor para jóvenes',
  ciencia: 'ciencia, inventos, científicos, fenómenos naturales, con humor para jóvenes',
  entretenimiento: 'películas, series, celebridades, memes, con humor para jóvenes',
  geografia: 'países, ciudades, monumentos, culturas, con humor para jóvenes',
};

export async function generateQuestion(
  category: CategoryType,
  difficulty: DifficultyType
): Promise<Question> {
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

  const userPrompt = `Genera una pregunta de ${category} de dificultad ${difficulty} para jóvenes colombianos. Que sea divertida y actual.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error de Gemini API: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extraer JSON del texto (por si viene con markdown o texto adicional)
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const questionData = JSON.parse(jsonMatch[0]);

    // Crear el objeto Question con ID único
    const question: Question = {
      id: `${category.substring(0, 3)}_${difficulty.substring(0, 3)}_${Date.now()}`,
      category,
      question: questionData.question,
      answer: questionData.answer,
      difficulty: questionData.difficulty,
      funFact: questionData.funFact
    };

    return question;

  } catch (error) {
    console.error('Error generando pregunta:', error);
    throw error;
  }
}

// Función para generar múltiples preguntas
export async function generateMultipleQuestions(
  category: CategoryType,
  difficulty: DifficultyType,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const question = await generateQuestion(category, difficulty);
      questions.push(question);
      
      // Pequeña pausa para no exceder límites de rate
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generando pregunta ${i + 1}:`, error);
    }
  }
  
  return questions;
}

// Función para listar modelos disponibles en la API de Gemini
export async function listAvailableModels(): Promise<void> {
  const GEMINI_LIST_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

  try {
    const response = await fetch(`${GEMINI_LIST_MODELS_URL}?key=${GEMINI_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al listar modelos: ${response.status}`);
    }

    const data = await response.json();
    console.log('Modelos disponibles:', data.models);
  } catch (error) {
    console.error('Error al obtener modelos disponibles:', error);
  }
}

// Ejemplo de uso
export async function ejemplo() {
  try {
    // Generar una pregunta
    const pregunta = await generateQuestion('deportes', 'medium');
    console.log('Pregunta generada:', pregunta);

    // Generar múltiples preguntas
    const preguntas = await generateMultipleQuestions('musica', 'easy', 3);
    console.log('Preguntas generadas:', preguntas);

    // Listar modelos disponibles
    await listAvailableModels();

  } catch (error) {
    console.error('Error:', error);
  }
}