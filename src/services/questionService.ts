import type { Question, CategoryType } from '@/types/game';

const CATEGORY_THEMES: Record<CategoryType, string> = {
  deportes: 'deportes, atletas, equipos, competencias, con humor para jóvenes',
  musica: 'música, artistas, géneros musicales, letras, con humor para jóvenes',
  historia: 'eventos históricos, personajes, fechas importantes, con humor para jóvenes',
  ciencia: 'ciencia, inventos, científicos, fenómenos naturales, con humor para jóvenes',
  entretenimiento: 'películas, series, celebridades, memes, con humor para jóvenes',
  geografia: 'países, ciudades, monumentos, culturas, con humor para jóvenes',
};

// Simulador de generación de preguntas con IA
// En producción, esto debería ser una API serverless que llame a OpenAI
export const generateQuestion = async (category: CategoryType): Promise<Question> => {
  // Simulación con preguntas predefinidas para desarrollo
  // TODO: Reemplazar con llamada real a OpenAI API
  
  const questionBank: Record<CategoryType, Array<Omit<Question, 'id'>>> = {
    deportes: [
      {
        category: 'deportes',
        question: '¿Qué deporte practica alguien que siempre está "metiendo goles" en las conversaciones?',
        answer: 'Fútbol (o el arte de ser pesado)',
        difficulty: 'easy',
        funFact: '¡El fútbol es el deporte más popular del mundo!',
      },
      {
        category: 'deportes',
        question: '¿Cuántos jugadores hay en un equipo de basketball?',
        answer: '5 jugadores',
        difficulty: 'easy',
        funFact: 'Michael Jordan es considerado el mejor jugador de todos los tiempos',
      },
    ],
    musica: [
      {
        category: 'musica',
        question: '¿Qué artista colombiano canta "Hawái"?',
        answer: 'Maluma',
        difficulty: 'easy',
        funFact: 'Maluma significa: "Mamá ama Luz y Marlli ama"',
      },
      {
        category: 'musica',
        question: '¿Cuántas cuerdas tiene una guitarra?',
        answer: '6 cuerdas',
        difficulty: 'easy',
        funFact: 'La guitarra eléctrica fue inventada en 1931',
      },
    ],
    historia: [
      {
        category: 'historia',
        question: '¿En qué año cayó el Muro de Berlín?',
        answer: '1989',
        difficulty: 'medium',
        funFact: 'El muro estuvo en pie por 28 años',
      },
      {
        category: 'historia',
        question: '¿Quién fue el primer hombre en la Luna?',
        answer: 'Neil Armstrong',
        difficulty: 'easy',
        funFact: 'Llegó el 20 de julio de 1969',
      },
    ],
    ciencia: [
      {
        category: 'ciencia',
        question: '¿Cuál es el planeta más cercano al Sol?',
        answer: 'Mercurio',
        difficulty: 'easy',
        funFact: 'Mercurio no tiene atmósfera',
      },
      {
        category: 'ciencia',
        question: '¿Qué gas respiran las plantas?',
        answer: 'Dióxido de carbono (CO2)',
        difficulty: 'easy',
        funFact: 'Las plantas producen oxígeno durante la fotosíntesis',
      },
    ],
    entretenimiento: [
      {
        category: 'entretenimiento',
        question: '¿Cómo se llama el perrito de "Los Simpson"?',
        answer: 'Santa\'s Little Helper (Ayudante de Santa)',
        difficulty: 'medium',
        funFact: 'Los Simpson llevan más de 30 años al aire',
      },
      {
        category: 'entretenimiento',
        question: '¿Qué plataforma se hizo viral con bailes de 15 segundos?',
        answer: 'TikTok',
        difficulty: 'easy',
        funFact: 'TikTok tiene más de 1 billón de usuarios',
      },
    ],
    geografia: [
      {
        category: 'geografia',
        question: '¿Cuál es la capital de Colombia?',
        answer: 'Bogotá',
        difficulty: 'easy',
        funFact: 'Bogotá está a 2,640 metros sobre el nivel del mar',
      },
      {
        category: 'geografia',
        question: '¿Cuál es el río más largo del mundo?',
        answer: 'El Amazonas',
        difficulty: 'medium',
        funFact: 'El Amazonas tiene más de 7,000 km de longitud',
      },
    ],
  };

  // Seleccionar pregunta aleatoria de la categoría
  const questions = questionBank[category];
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  return {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    ...randomQuestion,
  };
};

// Función para integración futura con OpenAI
export const generateQuestionWithAI = async (
  category: CategoryType
): Promise<Question> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found, using fallback questions');
    return generateQuestion(category);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres un generador de preguntas de trivia divertidas para jóvenes. 
            Genera preguntas cortas con respuestas breves sobre ${CATEGORY_THEMES[category]}.
            Las preguntas deben ser entretenidas, con un toque de humor, pero educativas.
            Responde en formato JSON con: question, answer, difficulty (easy/medium/hard), funFact.`,
          },
          {
            role: 'user',
            content: `Genera una pregunta de trivia sobre ${category}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      category,
      question: content.question,
      answer: content.answer,
      difficulty: content.difficulty,
      funFact: content.funFact,
    };
  } catch (error) {
    console.error('Error generating question with AI:', error);
    return generateQuestion(category);
  }
};
