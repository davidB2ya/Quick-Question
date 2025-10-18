import type { Question, CategoryType, DifficultyLevel } from '@/types/game';

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
export const generateQuestion = async (category: CategoryType, difficulty: DifficultyLevel = 'medium'): Promise<Question> => {
  // Simulación con preguntas predefinidas para desarrollo
  // TODO: Reemplazar con llamada real a OpenAI API
  
  const questionBank: Record<CategoryType, Record<DifficultyLevel, Array<Omit<Question, 'id'>>>> = {
    deportes: {
      easy: [
        {
          category: 'deportes',
          question: '¿Cuántos jugadores hay en un equipo de fútbol?',
          answer: '11 jugadores',
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
      medium: [
        {
          category: 'deportes',
          question: '¿En qué deporte se usa el término "home run"?',
          answer: 'Béisbol',
          difficulty: 'medium',
          funFact: 'Babe Ruth fue famoso por sus home runs',
        },
        {
          category: 'deportes',
          question: '¿Cada cuántos años se celebran los Juegos Olímpicos?',
          answer: '4 años',
          difficulty: 'medium',
          funFact: 'Los primeros Juegos Olímpicos modernos fueron en 1896',
        },
      ],
      hard: [
        {
          category: 'deportes',
          question: '¿Quién tiene el récord de más goles en mundiales de fútbol?',
          answer: 'Miroslav Klose (16 goles)',
          difficulty: 'hard',
          funFact: 'Klose superó a Ronaldo Nazário en Brasil 2014',
        },
        {
          category: 'deportes',
          question: '¿En qué año se fundó la NBA?',
          answer: '1946',
          difficulty: 'hard',
          funFact: 'Originalmente se llamaba BAA (Basketball Association of America)',
        },
      ],
    },
    musica: {
      easy: [
        {
          category: 'musica',
          question: '¿Cuántas cuerdas tiene una guitarra?',
          answer: '6 cuerdas',
          difficulty: 'easy',
          funFact: 'La guitarra eléctrica fue inventada en 1931',
        },
        {
          category: 'musica',
          question: '¿Qué artista colombiano canta "Hawái"?',
          answer: 'Maluma',
          difficulty: 'easy',
          funFact: 'Maluma significa: "Mamá ama Luz y Marlli ama"',
        },
      ],
      medium: [
        {
          category: 'musica',
          question: '¿Cuál es el nombre real de Shakira?',
          answer: 'Shakira Isabel Mebarak Ripoll',
          difficulty: 'medium',
          funFact: 'Shakira habla 6 idiomas',
        },
        {
          category: 'musica',
          question: '¿En qué década nació el reggaetón?',
          answer: 'Los 90s',
          difficulty: 'medium',
          funFact: 'El reggaetón se originó en Puerto Rico',
        },
      ],
      hard: [
        {
          category: 'musica',
          question: '¿Qué álbum de Michael Jackson es el más vendido de la historia?',
          answer: 'Thriller (1982)',
          difficulty: 'hard',
          funFact: 'Thriller vendió más de 66 millones de copias',
        },
        {
          category: 'musica',
          question: '¿Cómo se llama el primer álbum de Bad Bunny?',
          answer: 'X 100pre',
          difficulty: 'hard',
          funFact: 'Bad Bunny es el artista más escuchado en Spotify',
        },
      ],
    },
    historia: {
      easy: [
        {
          category: 'historia',
          question: '¿Quién fue el primer hombre en la Luna?',
          answer: 'Neil Armstrong',
          difficulty: 'easy',
          funFact: 'Llegó el 20 de julio de 1969',
        },
        {
          category: 'historia',
          question: '¿En qué año se independizó Colombia?',
          answer: '1810',
          difficulty: 'easy',
          funFact: 'El 20 de julio es el día de la independencia',
        },
      ],
      medium: [
        {
          category: 'historia',
          question: '¿En qué año cayó el Muro de Berlín?',
          answer: '1989',
          difficulty: 'medium',
          funFact: 'El muro estuvo en pie por 28 años',
        },
        {
          category: 'historia',
          question: '¿Quién fue el libertador de América del Sur?',
          answer: 'Simón Bolívar',
          difficulty: 'medium',
          funFact: 'Bolívar liberó 6 países sudamericanos',
        },
      ],
      hard: [
        {
          category: 'historia',
          question: '¿En qué año comenzó la Primera Guerra Mundial?',
          answer: '1914',
          difficulty: 'hard',
          funFact: 'Duró 4 años y cambió el mundo para siempre',
        },
        {
          category: 'historia',
          question: '¿Quién escribió "El Art de la Guerra"?',
          answer: 'Sun Tzu',
          difficulty: 'hard',
          funFact: 'Fue escrito hace más de 2,500 años',
        },
      ],
    },
    ciencia: {
      easy: [
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
      medium: [
        {
          category: 'ciencia',
          question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
          answer: '206 huesos',
          difficulty: 'medium',
          funFact: 'Los bebés nacen con 270 huesos',
        },
        {
          category: 'ciencia',
          question: '¿Cuál es la velocidad de la luz?',
          answer: '300,000 km/segundo',
          difficulty: 'medium',
          funFact: 'La luz puede dar 7 vueltas a la Tierra en 1 segundo',
        },
      ],
      hard: [
        {
          category: 'ciencia',
          question: '¿Cuál es la fórmula química del agua?',
          answer: 'H2O',
          difficulty: 'hard',
          funFact: 'El agua cubre el 71% de la superficie terrestre',
        },
        {
          category: 'ciencia',
          question: '¿Quién propuso la teoría de la relatividad?',
          answer: 'Albert Einstein',
          difficulty: 'hard',
          funFact: 'Einstein ganó el Nobel de Física en 1921',
        },
      ],
    },
    entretenimiento: {
      easy: [
        {
          category: 'entretenimiento',
          question: '¿Qué plataforma se hizo viral con bailes de 15 segundos?',
          answer: 'TikTok',
          difficulty: 'easy',
          funFact: 'TikTok tiene más de 1 billón de usuarios',
        },
        {
          category: 'entretenimiento',
          question: '¿Cómo se llama el ratón más famoso de Disney?',
          answer: 'Mickey Mouse',
          difficulty: 'easy',
          funFact: 'Mickey Mouse apareció por primera vez en 1928',
        },
      ],
      medium: [
        {
          category: 'entretenimiento',
          question: '¿Cómo se llama el perrito de "Los Simpson"?',
          answer: 'Santa\'s Little Helper (Ayudante de Santa)',
          difficulty: 'medium',
          funFact: 'Los Simpson llevan más de 30 años al aire',
        },
        {
          category: 'entretenimiento',
          question: '¿Qué película de Marvel inició el MCU?',
          answer: 'Iron Man (2008)',
          difficulty: 'medium',
          funFact: 'Robert Downey Jr. improvisó muchas líneas',
        },
      ],
      hard: [
        {
          category: 'entretenimiento',
          question: '¿Cuántas temporadas tiene "Breaking Bad"?',
          answer: '5 temporadas',
          difficulty: 'hard',
          funFact: 'Breaking Bad es considerada una de las mejores series',
        },
        {
          category: 'entretenimiento',
          question: '¿Qué director hizo "Pulp Fiction"?',
          answer: 'Quentin Tarantino',
          difficulty: 'hard',
          funFact: 'Tarantino escribió el guión en apenas 3 semanas',
        },
      ],
    },
    geografia: {
      easy: [
        {
          category: 'geografia',
          question: '¿Cuál es la capital de Colombia?',
          answer: 'Bogotá',
          difficulty: 'easy',
          funFact: 'Bogotá está a 2,640 metros sobre el nivel del mar',
        },
        {
          category: 'geografia',
          question: '¿En qué continente está Brasil?',
          answer: 'América del Sur',
          difficulty: 'easy',
          funFact: 'Brasil es el país más grande de Sudamérica',
        },
      ],
      medium: [
        {
          category: 'geografia',
          question: '¿Cuál es el río más largo del mundo?',
          answer: 'El Amazonas',
          difficulty: 'medium',
          funFact: 'El Amazonas tiene más de 7,000 km de longitud',
        },
        {
          category: 'geografia',
          question: '¿Cuál es el país más pequeño del mundo?',
          answer: 'Ciudad del Vaticano',
          difficulty: 'medium',
          funFact: 'Tiene apenas 0.44 km² de superficie',
        },
      ],
      hard: [
        {
          category: 'geografia',
          question: '¿Cuál es la montaña más alta del mundo?',
          answer: 'Everest (8,848 metros)',
          difficulty: 'hard',
          funFact: 'El Everest crece 4mm cada año',
        },
        {
          category: 'geografia',
          question: '¿Cuántos países tiene África?',
          answer: '54 países',
          difficulty: 'hard',
          funFact: 'África tiene más de 1,300 millones de habitantes',
        },
      ],
    },
  };

  // Seleccionar pregunta aleatoria de la categoría y dificultad
  const questionsForDifficulty = questionBank[category][difficulty];
  const randomQuestion = questionsForDifficulty[Math.floor(Math.random() * questionsForDifficulty.length)];

  return {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    ...randomQuestion,
  };
};

// Función para integración futura con OpenAI
export const generateQuestionWithAI = async (
  category: CategoryType,
  difficulty: DifficultyLevel = 'medium'
): Promise<Question> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found, using fallback questions');
    return generateQuestion(category, difficulty);
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
            La dificultad debe ser "${difficulty}".
            Responde en formato JSON con: question, answer, difficulty, funFact.`,
          },
          {
            role: 'user',
            content: `Genera una pregunta de trivia de dificultad ${difficulty} sobre ${category}`,
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
    return generateQuestion(category, difficulty);
  }
};
