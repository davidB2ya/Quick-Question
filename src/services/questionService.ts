import type { Question, CategoryType, DifficultyLevel } from '@/types/game';

// Sistema anti-repetición: tracking de preguntas usadas por partida
const usedQuestions: Record<string, Set<string>> = {};

// Función para limpiar preguntas usadas al terminar una partida
export const clearUsedQuestions = (gameId: string): void => {
  delete usedQuestions[gameId];
};

// Función para verificar si una pregunta ya fue usada
const isQuestionUsed = (gameId: string, questionId: string): boolean => {
  if (!usedQuestions[gameId]) {
    usedQuestions[gameId] = new Set();
  }
  return usedQuestions[gameId].has(questionId);
};

// Función para marcar una pregunta como usada
const markQuestionAsUsed = (gameId: string, questionId: string): void => {
  if (!usedQuestions[gameId]) {
    usedQuestions[gameId] = new Set();
  }
  usedQuestions[gameId].add(questionId);
};

const CATEGORY_THEMES: Record<CategoryType, string> = {
  deportes: 'deportes, atletas, equipos, competencias, con humor para jóvenes',
  musica: 'música, artistas, géneros musicales, letras, con humor para jóvenes',
  historia: 'eventos históricos, personajes, fechas importantes, con humor para jóvenes',
  ciencia: 'ciencia, inventos, científicos, fenómenos naturales, con humor para jóvenes',
  entretenimiento: 'películas, series, celebridades, memes, con humor para jóvenes',
  geografia: 'países, ciudades, monumentos, culturas, con humor para jóvenes',
};

// Generador principal de preguntas - Intenta IA primero, fallback a banco estático
export const generateQuestion = async (
  category: CategoryType, 
  difficulty: DifficultyLevel = 'medium',
  gameId?: string
): Promise<Question> => {
  // Usar el generador expandido con sistema anti-repetición
  try {
    return await generateExpandedQuestion(category, difficulty, gameId);
  } catch (error) {
    console.warn('Expanded generation failed, using static bank:', error);
    return generateQuestionFromBank(category, difficulty);
  }
};

// Generador usando banco estático como fallback
export const generateQuestionFromBank = async (category: CategoryType, difficulty: DifficultyLevel = 'medium'): Promise<Question> => {
  
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
        {
          category: 'deportes',
          question: '¿En qué deporte se usa una pelota amarilla?',
          answer: 'Tenis',
          difficulty: 'easy',
          funFact: 'Las pelotas de tenis son amarillas desde 1972',
        },
        {
          category: 'deportes',
          question: '¿Cómo se llama el deporte donde nadas?',
          answer: 'Natación',
          difficulty: 'easy',
          funFact: 'La natación es uno de los ejercicios más completos',
        },
        {
          category: 'deportes',
          question: '¿Qué deporte practica Lionel Messi?',
          answer: 'Fútbol',
          difficulty: 'easy',
          funFact: 'Messi ganó 8 Balones de Oro',
        },
        {
          category: 'deportes',
          question: '¿Cuántas bases hay en el béisbol?',
          answer: '4 bases',
          difficulty: 'easy',
          funFact: 'El béisbol se originó en Estados Unidos',
        },
        {
          category: 'deportes',
          question: '¿En qué deporte se hace gol?',
          answer: 'Fútbol',
          difficulty: 'easy',
          funFact: 'El primer Mundial fue en Uruguay 1930',
        },
        {
          category: 'deportes',
          question: '¿Cómo se llama el deporte de los carros?',
          answer: 'Automovilismo o Fórmula 1',
          difficulty: 'easy',
          funFact: 'La Fórmula 1 alcanza velocidades de 350 km/h',
        },
        {
          category: 'deportes',
          question: '¿Qué deporte se juega en una cancha con aro?',
          answer: 'Basketball',
          difficulty: 'easy',
          funFact: 'El basketball fue inventado en 1891',
        },
        {
          category: 'deportes',
          question: '¿En qué deporte se usa raqueta?',
          answer: 'Tenis',
          difficulty: 'easy',
          funFact: 'Wimbledon es el torneo más antiguo de tenis',
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
        {
          category: 'deportes',
          question: '¿Cuántos sets se necesitan para ganar Wimbledon masculino?',
          answer: '3 sets',
          difficulty: 'medium',
          funFact: 'Los partidos masculinos son al mejor de 5 sets',
        },
        {
          category: 'deportes',
          question: '¿Cuántos periodos tiene un partido de hockey?',
          answer: '3 periodos',
          difficulty: 'medium',
          funFact: 'Cada periodo dura 20 minutos',
        },
        {
          category: 'deportes',
          question: '¿En qué país se originó el rugby?',
          answer: 'Inglaterra',
          difficulty: 'medium',
          funFact: 'Se creó en la escuela Rugby en 1823',
        },
        {
          category: 'deportes',
          question: '¿Cuántos puntos vale un touchdown en fútbol americano?',
          answer: '6 puntos',
          difficulty: 'medium',
          funFact: 'Después se puede intentar el punto extra',
        },
        {
          category: 'deportes',
          question: '¿Cuál es la distancia de una maratón?',
          answer: '42.195 kilómetros',
          difficulty: 'medium',
          funFact: 'Esta distancia se estableció en 1908',
        },
        {
          category: 'deportes',
          question: '¿En qué deporte James Rodríguez ganó la Bota de Oro?',
          answer: 'Fútbol (Mundial 2014)',
          difficulty: 'medium',
          funFact: 'Marcó 6 goles en el Mundial de Brasil',
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
        {
          category: 'musica',
          question: '¿Cuántas teclas negras tiene un piano?',
          answer: '36 teclas negras',
          difficulty: 'easy',
          funFact: 'Un piano tiene 88 teclas en total',
        },
        {
          category: 'musica',
          question: '¿Quién canta "Despacito"?',
          answer: 'Luis Fonsi',
          difficulty: 'easy',
          funFact: 'Fue la canción más vista en YouTube por varios años',
        },
        {
          category: 'musica',
          question: '¿Qué instrumento toca principalmente un baterista?',
          answer: 'Batería',
          difficulty: 'easy',
          funFact: 'La batería moderna se desarrolló a principios del siglo XX',
        },
        {
          category: 'musica',
          question: '¿Quién es conocido como el "Rey del Pop"?',
          answer: 'Michael Jackson',
          difficulty: 'easy',
          funFact: 'Su álbum "Thriller" es el más vendido de la historia',
        },
        {
          category: 'musica',
          question: '¿Cuántas notas musicales hay?',
          answer: '7 notas (Do, Re, Mi, Fa, Sol, La, Si)',
          difficulty: 'easy',
          funFact: 'Estas notas se repiten en diferentes octavas',
        },
        {
          category: 'musica',
          question: '¿Qué artista colombiana canta "Hips Don\'t Lie"?',
          answer: 'Shakira',
          difficulty: 'easy',
          funFact: 'Shakira habla 6 idiomas diferentes',
        },
        {
          category: 'musica',
          question: '¿Qué género musical es típico de Jamaica?',
          answer: 'Reggae',
          difficulty: 'easy',
          funFact: 'Bob Marley es el artista de reggae más famoso',
        },
        {
          category: 'musica',
          question: '¿Quién canta "Blinding Lights"?',
          answer: 'The Weeknd',
          difficulty: 'easy',
          funFact: 'Fue la canción más popular de 2020',
        },
        {
          category: 'musica',
          question: '¿Qué cantante puertorriqueño es conocido como "El Conejo Malo"?',
          answer: 'Bad Bunny',
          difficulty: 'easy',
          funFact: 'Es el artista más escuchado en Spotify',
        },
        {
          category: 'musica',
          question: '¿Cuántas cuerdas tiene un violín?',
          answer: '4 cuerdas',
          difficulty: 'easy',
          funFact: 'El violín es el instrumento más agudo de la familia de cuerdas',
        },
        {
          category: 'musica',
          question: '¿Qué boy band cantaba "What Makes You Beautiful"?',
          answer: 'One Direction',
          difficulty: 'easy',
          funFact: 'Se formaron en el programa The X Factor en 2010',
        },
        {
          category: 'musica',
          question: '¿Quién canta "Someone Like You"?',
          answer: 'Adele',
          difficulty: 'easy',
          funFact: 'Adele ha ganado 15 premios Grammy',
        },
        {
          category: 'musica',
          question: '¿Qué instrumento toca principalmente en las orquestas el director?',
          answer: 'Batuta (no toca, dirige)',
          difficulty: 'easy',
          funFact: 'El director coordina a todos los músicos de la orquesta',
        }
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
        {
          category: 'musica',
          question: '¿Qué banda británica cantó "Bohemian Rhapsody"?',
          answer: 'Queen',
          difficulty: 'medium',
          funFact: 'La canción dura 5 minutos y 55 segundos',
        },
        {
          category: 'musica',
          question: '¿En qué año murió Michael Jackson?',
          answer: '2009',
          difficulty: 'medium',
          funFact: 'Murió el 25 de junio, conocido como el día más triste del pop',
        },
        {
          category: 'musica',
          question: '¿Qué instrumento tocaba Mozart principalmente?',
          answer: 'Piano',
          difficulty: 'medium',
          funFact: 'Mozart compuso más de 600 obras musicales',
        },
        {
          category: 'musica',
          question: '¿Cuál es el álbum más vendido de todos los tiempos?',
          answer: 'Thriller de Michael Jackson',
          difficulty: 'medium',
          funFact: 'Ha vendido más de 66 millones de copias',
        },
        {
          category: 'musica',
          question: '¿Qué banda hizo famosa la canción "Stairway to Heaven"?',
          answer: 'Led Zeppelin',
          difficulty: 'medium',
          funFact: 'Es considerada una de las mejores canciones de rock de todos los tiempos',
        },
        {
          category: 'musica',
          question: '¿En qué ciudad nació el jazz?',
          answer: 'Nueva Orleans',
          difficulty: 'medium',
          funFact: 'El jazz surgió a finales del siglo XIX',
        },
        {
          category: 'musica',
          question: '¿Quién compuso "La Novena Sinfonía"?',
          answer: 'Ludwig van Beethoven',
          difficulty: 'medium',
          funFact: 'Beethoven estaba completamente sordo cuando la compuso',
        },
        {
          category: 'musica',
          question: '¿Qué significa MTV?',
          answer: 'Music Television',
          difficulty: 'medium',
          funFact: 'MTV comenzó transmisiones el 1 de agosto de 1981',
        },
        {
          category: 'musica',
          question: '¿Cuál es el nombre artístico de Stefani Germanotta?',
          answer: 'Lady Gaga',
          difficulty: 'medium',
          funFact: 'Su nombre artístico viene de la canción "Radio Ga Ga" de Queen',
        },
        {
          category: 'musica',
          question: '¿Qué rapero estadounidense se llama Marshall Mathers?',
          answer: 'Eminem',
          difficulty: 'medium',
          funFact: 'Eminem es el artista que más álbumes ha vendido en la década de 2000',
        },
        {
          category: 'musica',
          question: '¿En qué festival de música famoso tocó Jimi Hendrix en 1969?',
          answer: 'Woodstock',
          difficulty: 'medium',
          funFact: 'Su interpretación del himno estadounidense se volvió legendaria',
        },
        {
          category: 'musica',
          question: '¿Qué boy band surcoreana es conocida mundialmente?',
          answer: 'BTS',
          difficulty: 'medium',
          funFact: 'BTS significa "Bangtan Sonyeondan" o "Bulletproof Boy Scouts"',
        },
        {
          category: 'musica',
          question: '¿Cuál es el nombre real de The Weeknd?',
          answer: 'Abel Tesfaye',
          difficulty: 'medium',
          funFact: 'Eligió "The Weeknd" porque dejó la escuela un fin de semana y nunca regresó',
        }
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

// Función principal para generación con OpenAI
export const generateQuestionWithAI = async (
  category: CategoryType,
  difficulty: DifficultyLevel = 'medium'
): Promise<Question> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
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
    return generateExpandedQuestion(category, difficulty);
  }
};

// Banco de preguntas mejorado - elimino templates problemáticos y uso preguntas fijas
const expandedQuestionBank: Record<CategoryType, Record<DifficultyLevel, Question[]>> = {
  deportes: {
    easy: [
      {
        id: 'dep_easy_1',
        category: 'deportes',
        question: '¿Cuántos jugadores tiene un equipo de fútbol en la cancha?',
        answer: '11 jugadores',
        difficulty: 'easy',
        funFact: 'El fútbol es el deporte más popular del mundo'
      },
      {
        id: 'dep_easy_2',
        category: 'deportes',
        question: '¿Cuántos jugadores tiene un equipo de basketball?',
        answer: '5 jugadores',
        difficulty: 'easy',
        funFact: 'El basketball se inventó en 1891'
      },
      {
        id: 'dep_easy_3',
        category: 'deportes',
        question: '¿En qué deporte se usa una raqueta?',
        answer: 'Tenis',
        difficulty: 'easy',
        funFact: 'Wimbledon es el torneo de tenis más antiguo'
      },
      {
        id: 'dep_easy_4',
        category: 'deportes',
        question: '¿Cuál es el deporte de Messi?',
        answer: 'Fútbol',
        difficulty: 'easy',
        funFact: 'Messi ha ganado 8 Balones de Oro'
      },
      {
        id: 'dep_easy_5',
        category: 'deportes',
        question: '¿Cuánto dura un partido de fútbol?',
        answer: '90 minutos',
        difficulty: 'easy',
        funFact: 'Se pueden agregar minutos de descuento'
      },
      {
        id: 'dep_easy_6',
        category: 'deportes',
        question: '¿En qué deporte se usa un bate?',
        answer: 'Béisbol',
        difficulty: 'easy',
        funFact: 'El béisbol es muy popular en Estados Unidos'
      },
      {
        id: 'dep_easy_7',
        category: 'deportes',
        question: '¿Cuántos jugadores tiene un equipo de voleibol?',
        answer: '6 jugadores',
        difficulty: 'easy',
        funFact: 'El voleibol se creó en 1895'
      },
      {
        id: 'dep_easy_8',
        category: 'deportes',
        question: '¿Qué deporte se juega en una piscina?',
        answer: 'Natación',
        difficulty: 'easy',
        funFact: 'Michael Phelps tiene 23 medallas de oro olímpicas'
      },
      {
        id: 'dep_easy_9',
        category: 'deportes',
        question: '¿En qué deporte se usa una pelota naranja?',
        answer: 'Basketball',
        difficulty: 'easy',
        funFact: 'La NBA es la liga más famosa de basketball'
      },
      {
        id: 'dep_easy_10',
        category: 'deportes',
        question: '¿Cuántos jugadores tiene un equipo de hockey sobre hielo?',
        answer: '6 jugadores',
        difficulty: 'easy',
        funFact: 'Canadá es el país más famoso en hockey'
      },
      {
        id: 'dep_easy_11',
        category: 'deportes',
        question: '¿En qué deporte se usa un arco y flecha?',
        answer: 'Tiro con arco',
        difficulty: 'easy',
        funFact: 'Es un deporte olímpico desde 1900'
      },
      {
        id: 'dep_easy_12',
        category: 'deportes',
        question: '¿Qué deporte practica un boxeador?',
        answer: 'Boxeo',
        difficulty: 'easy',
        funFact: 'Muhammad Ali es considerado el mejor de todos los tiempos'
      },
      {
        id: 'dep_easy_13',
        category: 'deportes',
        question: '¿En qué deporte se usa una tabla sobre olas?',
        answer: 'Surf',
        difficulty: 'easy',
        funFact: 'Hawái es considerado el lugar de nacimiento del surf'
      },
      {
        id: 'dep_easy_14',
        category: 'deportes',
        question: '¿Cuántos jugadores tiene un equipo de rugby?',
        answer: '15 jugadores',
        difficulty: 'easy',
        funFact: 'El rugby se originó en Inglaterra en 1823'
      },
      {
        id: 'dep_easy_15',
        category: 'deportes',
        question: '¿En qué deporte se usa una bicicleta?',
        answer: 'Ciclismo',
        difficulty: 'easy',
        funFact: 'La Tour de France es la carrera más famosa'
      },
      {
        id: 'dep_easy_16',
        category: 'deportes',
        question: '¿Qué deporte se juega en una mesa con paletas?',
        answer: 'Ping pong o Tenis de mesa',
        difficulty: 'easy',
        funFact: 'China domina este deporte a nivel mundial'
      },
      {
        id: 'dep_easy_17',
        category: 'deportes',
        question: '¿En qué deporte los jugadores usan cascos y hombreras?',
        answer: 'Fútbol americano',
        difficulty: 'easy',
        funFact: 'El Super Bowl es el evento más visto en USA'
      },
      {
        id: 'dep_easy_18',
        category: 'deportes',
        question: '¿Cuál es el deporte de Tiger Woods?',
        answer: 'Golf',
        difficulty: 'easy',
        funFact: 'Tiger Woods ha ganado 15 majors'
      },
      {
        id: 'dep_easy_19',
        category: 'deportes',
        question: '¿En qué deporte se usa una canasta alta?',
        answer: 'Basketball',
        difficulty: 'easy',
        funFact: 'La canasta está a 3.05 metros de altura'
      },
      {
        id: 'dep_easy_20',
        category: 'deportes',
        question: '¿Qué deporte se practica en un tatami?',
        answer: 'Judo o Karate',
        difficulty: 'easy',
        funFact: 'Japón es el país de origen de estas artes marciales'
      }
    ],
    medium: [
      {
        id: 'dep_med_1',
        category: 'deportes',
        question: '¿En qué año se creó el basketball?',
        answer: '1891',
        difficulty: 'medium',
        funFact: 'James Naismith lo inventó en Massachusetts'
      },
      {
        id: 'dep_med_2',
        category: 'deportes',
        question: '¿Cada cuántos años se celebran los Juegos Olímpicos?',
        answer: '4 años',
        difficulty: 'medium',
        funFact: 'Los primeros Juegos Olímpicos modernos fueron en 1896'
      },
      {
        id: 'dep_med_3',
        category: 'deportes',
        question: '¿Cuántos sets se necesitan para ganar en tenis masculino de Grand Slam?',
        answer: '3 sets',
        difficulty: 'medium',
        funFact: 'Es al mejor de 5 sets'
      },
      {
        id: 'dep_med_4',
        category: 'deportes',
        question: '¿En qué deporte se usa el término "home run"?',
        answer: 'Béisbol',
        difficulty: 'medium',
        funFact: 'Babe Ruth fue famoso por sus home runs'
      },
      {
        id: 'dep_med_5',
        category: 'deportes',
        question: '¿Cuántos períodos tiene un partido de hockey?',
        answer: '3 períodos',
        difficulty: 'medium',
        funFact: 'Cada período dura 20 minutos'
      },
      {
        id: 'dep_med_6',
        category: 'deportes',
        question: '¿Cuál es la distancia de una maratón?',
        answer: '42.195 kilómetros',
        difficulty: 'medium',
        funFact: 'Esta distancia se estableció en las Olimpiadas de 1908'
      },
      {
        id: 'dep_med_7',
        category: 'deportes',
        question: '¿En qué país se originó el rugby?',
        answer: 'Inglaterra',
        difficulty: 'medium',
        funFact: 'Se creó en la escuela Rugby en 1823'
      },
      {
        id: 'dep_med_8',
        category: 'deportes',
        question: '¿Cuántos puntos vale un touchdown en fútbol americano?',
        answer: '6 puntos',
        difficulty: 'medium',
        funFact: 'Después se puede intentar el punto extra'
      },
      {
        id: 'dep_med_9',
        category: 'deportes',
        question: '¿En qué deporte James Rodríguez ganó la Bota de Oro?',
        answer: 'Fútbol',
        difficulty: 'medium',
        funFact: 'Marcó 6 goles en el Mundial de Brasil 2014'
      },
      {
        id: 'dep_med_10',
        category: 'deportes',
        question: '¿Cuántos cuartos tiene un partido de basketball en la NBA?',
        answer: '4 cuartos',
        difficulty: 'medium',
        funFact: 'Cada cuarto dura 12 minutos'
      },
      {
        id: 'dep_med_11',
        category: 'deportes',
        question: '¿En qué año se fundó la FIFA?',
        answer: '1904',
        difficulty: 'medium',
        funFact: 'Se fundó en París con 7 países fundadores'
      },
      {
        id: 'dep_med_12',
        category: 'deportes',
        question: '¿Cuánto mide una cancha de tenis en singles?',
        answer: '23.77 metros de largo',
        difficulty: 'medium',
        funFact: 'En dobles es más ancha: 10.97 metros'
      },
      {
        id: 'dep_med_13',
        category: 'deportes',
        question: '¿En qué deporte se usan los términos "strike" y "spare"?',
        answer: 'Bowling',
        difficulty: 'medium',
        funFact: 'Un strike es derribar todos los pinos en el primer tiro'
      },
      {
        id: 'dep_med_14',
        category: 'deportes',
        question: '¿Cuántas vueltas tiene una carrera de Fórmula 1 típicamente?',
        answer: 'Entre 50-70 vueltas',
        difficulty: 'medium',
        funFact: 'Depende del circuito, pero debe durar máximo 2 horas'
      },
      {
        id: 'dep_med_15',
        category: 'deportes',
        question: '¿En qué deporte se usa el término "ace"?',
        answer: 'Tenis',
        difficulty: 'medium',
        funFact: 'Un ace es un saque que no puede ser devuelto'
      }
    ],
    hard: [
      {
        id: 'dep_hard_1',
        category: 'deportes',
        question: '¿Quién tiene el récord mundial de los 100 metros planos?',
        answer: 'Usain Bolt',
        difficulty: 'hard',
        funFact: 'Su récord es de 9.58 segundos establecido en 2009'
      },
      {
        id: 'dep_hard_2',
        category: 'deportes',
        question: '¿En qué año Colombia ganó la Copa América por primera vez?',
        answer: '2001',
        difficulty: 'hard',
        funFact: 'Fue en su propio país, derrotando a México en la final'
      },
      {
        id: 'dep_hard_3',
        category: 'deportes',
        question: '¿Quién tiene más títulos de Grand Slam en tenis masculino?',
        answer: 'Novak Djokovic',
        difficulty: 'hard',
        funFact: 'Djokovic tiene 24 títulos de Grand Slam'
      },
      {
        id: 'dep_hard_4',
        category: 'deportes',
        question: '¿En qué año se fundó la FIFA?',
        answer: '1904',
        difficulty: 'hard',
        funFact: 'Se fundó en París con 7 países fundadores'
      }
    ]
  },
  historia: {
    easy: [
      {
        id: 'hist_easy_1',
        category: 'historia',
        question: '¿En qué año llegó Colón a América?',
        answer: '1492',
        difficulty: 'easy',
        funFact: 'Fue el 12 de octubre de 1492'
      },
      {
        id: 'hist_easy_2',
        category: 'historia',
        question: '¿En qué año se independizó Colombia?',
        answer: '1810',
        difficulty: 'easy',
        funFact: 'El 20 de julio de 1810'
      },
      {
        id: 'hist_easy_3',
        category: 'historia',
        question: '¿Quién fue Simón Bolívar?',
        answer: 'El Libertador',
        difficulty: 'easy',
        funFact: 'Liberó 6 países sudamericanos'
      },
      {
        id: 'hist_easy_4',
        category: 'historia',
        question: '¿En qué año terminó la Segunda Guerra Mundial?',
        answer: '1945',
        difficulty: 'easy',
        funFact: 'Terminó el 2 de septiembre de 1945'
      },
      {
        id: 'hist_easy_5',
        category: 'historia',
        question: '¿En qué año comenzó la Primera Guerra Mundial?',
        answer: '1914',
        difficulty: 'easy',
        funFact: 'Comenzó tras el asesinato del Archiduque Francisco Fernando'
      },
      {
        id: 'hist_easy_6',
        category: 'historia',
        question: '¿Quién fue Napoleón Bonaparte?',
        answer: 'Emperador francés',
        difficulty: 'easy',
        funFact: 'Conquistó gran parte de Europa'
      },
      {
        id: 'hist_easy_7',
        category: 'historia',
        question: '¿En qué año cayó el Muro de Berlín?',
        answer: '1989',
        difficulty: 'easy',
        funFact: 'Fue el 9 de noviembre de 1989'
      },
      {
        id: 'hist_easy_8',
        category: 'historia',
        question: '¿En qué año llegó el hombre a la Luna?',
        answer: '1969',
        difficulty: 'easy',
        funFact: 'Neil Armstrong fue el primero el 20 de julio'
      },
      {
        id: 'hist_easy_9',
        category: 'historia',
        question: '¿Quién fue Cleopatra?',
        answer: 'Reina de Egipto',
        difficulty: 'easy',
        funFact: 'Fue la última faraona de Egipto'
      },
      {
        id: 'hist_easy_10',
        category: 'historia',
        question: '¿En qué siglo vivió Leonardo da Vinci?',
        answer: 'Siglo XV-XVI',
        difficulty: 'easy',
        funFact: 'Fue pintor, inventor y científico del Renacimiento'
      },
      {
        id: 'hist_easy_11',
        category: 'historia',
        question: '¿Quién descubrió América?',
        answer: 'Cristóbal Colón',
        difficulty: 'easy',
        funFact: 'Era un navegante genovés'
      },
      {
        id: 'hist_easy_12',
        category: 'historia',
        question: '¿En qué año se fundó Roma?',
        answer: '753 a.C.',
        difficulty: 'easy',
        funFact: 'Según la leyenda, fue fundada por Rómulo y Remo'
      },
      {
        id: 'hist_easy_13',
        category: 'historia',
        question: '¿Quién fue Gandhi?',
        answer: 'Líder de la independencia de India',
        difficulty: 'easy',
        funFact: 'Promovió la no violencia'
      },
      {
        id: 'hist_easy_14',
        category: 'historia',
        question: '¿En qué año comenzó la Revolución Francesa?',
        answer: '1789',
        difficulty: 'easy',
        funFact: 'Tomaron la Bastilla el 14 de julio'
      },
      {
        id: 'hist_easy_15',
        category: 'historia',
        question: '¿Quién fue el primer presidente de Estados Unidos?',
        answer: 'George Washington',
        difficulty: 'easy',
        funFact: 'Rechazó ser rey y estableció la democracia'
      }
    ],
    medium: [
      {
        id: 'hist_med_1',
        category: 'historia',
        question: '¿Cuándo comenzó la Primera Guerra Mundial?',
        answer: '1914',
        difficulty: 'medium',
        funFact: 'Comenzó tras el asesinato del Archiduque Francisco Fernando'
      },
      {
        id: 'hist_med_2',
        category: 'historia',
        question: '¿En qué año comenzó la Revolución Francesa?',
        answer: '1789',
        difficulty: 'medium',
        funFact: 'Tomaron la Bastilla el 14 de julio'
      }
    ],
    hard: [
      {
        id: 'hist_hard_1',
        category: 'historia',
        question: '¿Cuándo cayó el Imperio Romano de Occidente?',
        answer: '476 d.C.',
        difficulty: 'hard',
        funFact: 'Cayó cuando Odoacro depuso a Rómulo Augusto'
      }
    ]
  },
  ciencia: {
    easy: [
      {
        id: 'cien_easy_1',
        category: 'ciencia',
        question: '¿Cuántos planetas hay en nuestro sistema solar?',
        answer: '8 planetas',
        difficulty: 'easy',
        funFact: 'Plutón ya no se considera planeta desde 2006'
      },
      {
        id: 'cien_easy_2',
        category: 'ciencia',
        question: '¿Cuál es la fórmula química del agua?',
        answer: 'H2O',
        difficulty: 'easy',
        funFact: 'Dos átomos de hidrógeno y uno de oxígeno'
      },
      {
        id: 'cien_easy_3',
        category: 'ciencia',
        question: '¿Cuál es el planeta más grande del sistema solar?',
        answer: 'Júpiter',
        difficulty: 'easy',
        funFact: 'Es un gigante gaseoso más grande que todos los otros planetas juntos'
      },
      {
        id: 'cien_easy_4',
        category: 'ciencia',
        question: '¿Qué gas respiramos?',
        answer: 'Oxígeno',
        difficulty: 'easy',
        funFact: 'El oxígeno representa el 21% del aire'
      },
      {
        id: 'cien_easy_5',
        category: 'ciencia',
        question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
        answer: '206 huesos',
        difficulty: 'easy',
        funFact: 'Los bebés nacen con más de 270 huesos'
      },
      {
        id: 'cien_easy_6',
        category: 'ciencia',
        question: '¿Qué órgano bombea la sangre?',
        answer: 'El corazón',
        difficulty: 'easy',
        funFact: 'Late aproximadamente 100,000 veces al día'
      },
      {
        id: 'cien_easy_7',
        category: 'ciencia',
        question: '¿Cuál es el animal más grande del mundo?',
        answer: 'La ballena azul',
        difficulty: 'easy',
        funFact: 'Puede medir hasta 30 metros de largo'
      },
      {
        id: 'cien_easy_8',
        category: 'ciencia',
        question: '¿A qué temperatura hierve el agua?',
        answer: '100 grados Celsius',
        difficulty: 'easy',
        funFact: 'Al nivel del mar y a presión normal'
      },
      {
        id: 'cien_easy_9',
        category: 'ciencia',
        question: '¿Cuál es el metal más abundante en la corteza terrestre?',
        answer: 'Aluminio',
        difficulty: 'easy',
        funFact: 'Representa el 8% de la corteza terrestre'
      },
      {
        id: 'cien_easy_10',
        category: 'ciencia',
        question: '¿Qué científico propuso la teoría de la evolución?',
        answer: 'Charles Darwin',
        difficulty: 'easy',
        funFact: 'Viajó en el barco HMS Beagle'
      },
      {
        id: 'cien_easy_11',
        category: 'ciencia',
        question: '¿Cuál es la velocidad de la luz?',
        answer: '300,000 km/s',
        difficulty: 'easy',
        funFact: 'Es la velocidad máxima posible en el universo'
      },
      {
        id: 'cien_easy_12',
        category: 'ciencia',
        question: '¿Qué inventó Alexander Graham Bell?',
        answer: 'El teléfono',
        difficulty: 'easy',
        funFact: 'La primera llamada fue en 1876'
      }
    ],
    medium: [
      {
        id: 'cien_med_1',
        category: 'ciencia',
        question: '¿Qué gas producen las plantas durante la fotosíntesis?',
        answer: 'Oxígeno',
        difficulty: 'medium',
        funFact: 'Las plantas liberan oxígeno y absorben CO2'
      }
    ],
    hard: [
      {
        id: 'cien_hard_1',
        category: 'ciencia',
        question: '¿Cuál es la velocidad de la luz en el vacío?',
        answer: '299,792,458 m/s',
        difficulty: 'hard',
        funFact: 'Es la velocidad máxima posible en el universo'
      }
    ]
  },
  geografia: {
    easy: [
      {
        id: 'geo_easy_1',
        category: 'geografia',
        question: '¿Cuál es la capital de Francia?',
        answer: 'París',
        difficulty: 'easy',
        funFact: 'También conocida como la Ciudad de la Luz'
      },
      {
        id: 'geo_easy_2',
        category: 'geografia',
        question: '¿Cuál es la capital de Brasil?',
        answer: 'Brasília',
        difficulty: 'easy',
        funFact: 'No es Río de Janeiro como muchos piensan'
      },
      {
        id: 'geo_easy_3',
        category: 'geografia',
        question: '¿Cuál es la capital de Colombia?',
        answer: 'Bogotá',
        difficulty: 'easy',
        funFact: 'Está ubicada a 2640 metros sobre el nivel del mar'
      },
      {
        id: 'geo_easy_4',
        category: 'geografia',
        question: '¿En qué continente está Brasil?',
        answer: 'América del Sur',
        difficulty: 'easy',
        funFact: 'Brasil ocupa casi la mitad del continente sudamericano'
      },
      {
        id: 'geo_easy_5',
        category: 'geografia',
        question: '¿Cuál es el océano más grande?',
        answer: 'Océano Pacífico',
        difficulty: 'easy',
        funFact: 'Cubre más de un tercio de la superficie terrestre'
      },
      {
        id: 'geo_easy_6',
        category: 'geografia',
        question: '¿En qué país está la Torre Eiffel?',
        answer: 'Francia',
        difficulty: 'easy',
        funFact: 'Fue construida en 1889 y mide 324 metros'
      },
      {
        id: 'geo_easy_7',
        category: 'geografia',
        question: '¿Cuál es la capital de España?',
        answer: 'Madrid',
        difficulty: 'easy',
        funFact: 'Es la capital más alta de Europa'
      },
      {
        id: 'geo_easy_8',
        category: 'geografia',
        question: '¿En qué continente está Egipto?',
        answer: 'África',
        difficulty: 'easy',
        funFact: 'También tiene una pequeña parte en Asia'
      },
      {
        id: 'geo_easy_9',
        category: 'geografia',
        question: '¿Cuál es el país más grande del mundo?',
        answer: 'Rusia',
        difficulty: 'easy',
        funFact: 'Abarca 11 zonas horarias diferentes'
      },
      {
        id: 'geo_easy_10',
        category: 'geografia',
        question: '¿Cuál es la montaña más alta del mundo?',
        answer: 'Monte Everest',
        difficulty: 'easy',
        funFact: 'Mide 8849 metros de altura'
      },
      {
        id: 'geo_easy_11',
        category: 'geografia',
        question: '¿Cuál es la capital de México?',
        answer: 'Ciudad de México',
        difficulty: 'easy',
        funFact: 'Es una de las ciudades más pobladas del mundo'
      },
      {
        id: 'geo_easy_12',
        category: 'geografia',
        question: '¿En qué país está Machu Picchu?',
        answer: 'Perú',
        difficulty: 'easy',
        funFact: 'Fue construida por los incas en el siglo XV'
      },
      {
        id: 'geo_easy_13',
        category: 'geografia',
        question: '¿Cuál es la capital de Argentina?',
        answer: 'Buenos Aires',
        difficulty: 'easy',
        funFact: 'Es conocida como el París de América del Sur'
      },
      {
        id: 'geo_easy_14',
        category: 'geografia',
        question: '¿Cuál es el río más largo del mundo?',
        answer: 'Río Amazonas',
        difficulty: 'easy',
        funFact: 'Tiene más de 6400 kilómetros de longitud'
      },
      {
        id: 'geo_easy_15',
        category: 'geografia',
        question: '¿En qué océano están las islas Maldivas?',
        answer: 'Océano Índico',
        difficulty: 'easy',
        funFact: 'Están formadas por 1192 islas coralinas'
      }
    ],
    medium: [
      {
        id: 'geo_med_1',
        category: 'geografia',
        question: '¿Qué río pasa por París?',
        answer: 'Río Sena',
        difficulty: 'medium',
        funFact: 'Divide la ciudad y tiene muchos puentes famosos'
      },
      {
        id: 'geo_med_2',
        category: 'geografia',
        question: '¿Cuál es la capital de Australia?',
        answer: 'Canberra',
        difficulty: 'medium',
        funFact: 'No es Sydney ni Melbourne como muchos creen'
      },
      {
        id: 'geo_med_3',
        category: 'geografia',
        question: '¿Qué estrecho separa Europa de África?',
        answer: 'Estrecho de Gibraltar',
        difficulty: 'medium',
        funFact: 'Tiene solo 14 kilómetros de ancho en su punto más estrecho'
      },
      {
        id: 'geo_med_4',
        category: 'geografia',
        question: '¿En qué cordillera está el Aconcagua?',
        answer: 'Cordillera de los Andes',
        difficulty: 'medium',
        funFact: 'Es la montaña más alta de América con 6962 metros'
      },
      {
        id: 'geo_med_5',
        category: 'geografia',
        question: '¿Cuál es el país más pequeño del mundo?',
        answer: 'Ciudad del Vaticano',
        difficulty: 'medium',
        funFact: 'Tiene solo 0.17 millas cuadradas de superficie'
      },
      {
        id: 'geo_med_6',
        category: 'geografia',
        question: '¿Qué canal conecta el Atlántico y el Pacífico?',
        answer: 'Canal de Panamá',
        difficulty: 'medium',
        funFact: 'Fue inaugurado en 1914 y mide 82 kilómetros'
      },
      {
        id: 'geo_med_7',
        category: 'geografia',
        question: '¿En qué país está la región de Transilvania?',
        answer: 'Rumania',
        difficulty: 'medium',
        funFact: 'Es famosa por las leyendas de vampiros y Drácula'
      },
      {
        id: 'geo_med_8',
        category: 'geografia',
        question: '¿Cuál es el lago más profundo del mundo?',
        answer: 'Lago Baikal',
        difficulty: 'medium',
        funFact: 'Contiene el 20% del agua dulce no congelada del mundo'
      },
      {
        id: 'geo_med_9',
        category: 'geografia',
        question: '¿Qué islas pertenecen a Ecuador?',
        answer: 'Islas Galápagos',
        difficulty: 'medium',
        funFact: 'Inspiraron la teoría de la evolución de Darwin'
      },
      {
        id: 'geo_med_10',
        category: 'geografia',
        question: '¿Cuál es la capital de Canadá?',
        answer: 'Ottawa',
        difficulty: 'medium',
        funFact: 'No es Toronto ni Montreal como muchos piensan'
      },
      {
        id: 'geo_med_11',
        category: 'geografia',
        question: '¿En qué mar está la isla de Creta?',
        answer: 'Mar Mediterráneo',
        difficulty: 'medium',
        funFact: 'Es la isla más grande de Grecia'
      },
      {
        id: 'geo_med_12',
        category: 'geografia',
        question: '¿Qué cordillera separa Europa de Asia?',
        answer: 'Montes Urales',
        difficulty: 'medium',
        funFact: 'Se extiende por más de 2500 kilómetros'
      },
      {
        id: 'geo_med_13',
        category: 'geografia',
        question: '¿Cuál es el volcán más alto del mundo?',
        answer: 'Nevado Ojos del Salado',
        difficulty: 'medium',
        funFact: 'Está ubicado entre Chile y Argentina, a 6893 metros'
      },
      {
        id: 'geo_med_14',
        category: 'geografia',
        question: '¿En qué país están las cataratas Victoria?',
        answer: 'Entre Zambia y Zimbabwe',
        difficulty: 'medium',
        funFact: 'Son llamadas "el humo que truena" por los locales'
      },
      {
        id: 'geo_med_15',
        category: 'geografia',
        question: '¿Cuál es la capital de Sudáfrica?',
        answer: 'Pretoria (ejecutiva)',
        difficulty: 'medium',
        funFact: 'Sudáfrica tiene tres capitales: Pretoria, Ciudad del Cabo y Bloemfontein'
      }
    ],
    hard: [
      {
        id: 'geo_hard_1',
        category: 'geografia',
        question: '¿Cuál es el desierto más grande del mundo?',
        answer: 'Sahara',
        difficulty: 'hard',
        funFact: 'Cubre aproximadamente 9 millones de km²'
      }
    ]
  },
  entretenimiento: {
    easy: [
      {
        id: 'ent_easy_1',
        category: 'entretenimiento',
        question: '¿Quién creó Mickey Mouse?',
        answer: 'Walt Disney',
        difficulty: 'easy',
        funFact: 'Mickey Mouse debutó en 1928'
      },
      {
        id: 'ent_easy_2',
        category: 'entretenimiento',
        question: '¿Quién escribió Harry Potter?',
        answer: 'J.K. Rowling',
        difficulty: 'easy',
        funFact: 'Escribió gran parte del primer libro en cafeterías'
      },
      {
        id: 'ent_easy_3',
        category: 'entretenimiento',
        question: '¿Cómo se llama el perro de Mickey Mouse?',
        answer: 'Pluto',
        difficulty: 'easy',
        funFact: 'Pluto apareció por primera vez en 1930'
      },
      {
        id: 'ent_easy_4',
        category: 'entretenimiento',
        question: '¿En qué película aparece el personaje Buzz Lightyear?',
        answer: 'Toy Story',
        difficulty: 'easy',
        funFact: 'Fue la primera película completamente animada por computadora'
      },
      {
        id: 'ent_easy_5',
        category: 'entretenimiento',
        question: '¿Cuál es el nombre real de Superman?',
        answer: 'Clark Kent',
        difficulty: 'easy',
        funFact: 'Superman fue creado en 1938'
      },
      {
        id: 'ent_easy_6',
        category: 'entretenimiento',
        question: '¿Qué color es Bob Esponja?',
        answer: 'Amarillo',
        difficulty: 'easy',
        funFact: 'Bob Esponja vive en una piña bajo el mar'
      },
      {
        id: 'ent_easy_7',
        category: 'entretenimiento',
        question: '¿Cómo se llama la princesa de la película Frozen?',
        answer: 'Elsa',
        difficulty: 'easy',
        funFact: 'La canción "Let It Go" ganó un Oscar'
      },
      {
        id: 'ent_easy_8',
        category: 'entretenimiento',
        question: '¿En qué ciudad vive Batman?',
        answer: 'Gotham City',
        difficulty: 'easy',
        funFact: 'Gotham City está inspirada en Nueva York'
      },
      {
        id: 'ent_easy_9',
        category: 'entretenimiento',
        question: '¿Cuántos dedos tiene Mickey Mouse en cada mano?',
        answer: 'Cuatro',
        difficulty: 'easy',
        funFact: 'Disney decidió que cuatro dedos se veían mejor en animación'
      },
      {
        id: 'ent_easy_10',
        category: 'entretenimiento',
        question: '¿Cómo se llama el pez de Nemo?',
        answer: 'Pez payaso',
        difficulty: 'easy',
        funFact: 'Los peces payaso pueden cambiar de sexo'
      },
      {
        id: 'ent_easy_11',
        category: 'entretenimiento',
        question: '¿En qué película aparece el personaje Shrek?',
        answer: 'Shrek',
        difficulty: 'easy',
        funFact: 'Shrek fue la primera película en ganar el Oscar a Mejor Película Animada'
      },
      {
        id: 'ent_easy_12',
        category: 'entretenimiento',
        question: '¿Cuál es el nombre del león en El Rey León?',
        answer: 'Simba',
        difficulty: 'easy',
        funFact: 'Simba significa "león" en swahili'
      },
      {
        id: 'ent_easy_13',
        category: 'entretenimiento',
        question: '¿Qué videojuego tiene un fontanero como protagonista?',
        answer: 'Super Mario Bros',
        difficulty: 'easy',
        funFact: 'Mario originalmente se llamaba Jumpman'
      },
      {
        id: 'ent_easy_14',
        category: 'entretenimiento',
        question: '¿Cómo se llama la casa de los Simpson?',
        answer: 'Springfield',
        difficulty: 'easy',
        funFact: 'Los Simpson llevan más de 30 años al aire'
      },
      {
        id: 'ent_easy_15',
        category: 'entretenimiento',
        question: '¿En qué red social se publican fotos y videos cortos?',
        answer: 'TikTok',
        difficulty: 'easy',
        funFact: 'TikTok originalmente se llamaba Musical.ly'
      }
    ],
    medium: [
      {
        id: 'ent_med_1',
        category: 'entretenimiento',
        question: '¿En qué película se dice "Que la fuerza te acompañe"?',
        answer: 'Star Wars',
        difficulty: 'medium',
        funFact: 'Es el saludo tradicional de los Jedi'
      }
    ],
    hard: [
      {
        id: 'ent_hard_1',
        category: 'entretenimiento',
        question: '¿Quién dirigió la película Psycho?',
        answer: 'Alfred Hitchcock',
        difficulty: 'hard',
        funFact: 'Es considerado el maestro del suspenso'
      }
    ]
  },
  musica: {
    easy: [
      {
        id: 'mus_easy_1',
        category: 'musica',
        question: '¿Quién canta "Despacito"?',
        answer: 'Luis Fonsi',
        difficulty: 'easy',
        funFact: 'Fue un éxito mundial en 2017'
      },
      {
        id: 'mus_easy_2',
        category: 'musica',
        question: '¿Quién cantaba "Billie Jean"?',
        answer: 'Michael Jackson',
        difficulty: 'easy',
        funFact: 'Michael Jackson era conocido como el Rey del Pop'
      }
    ],
    medium: [
      {
        id: 'mus_med_1',
        category: 'musica',
        question: '¿De qué país es Shakira?',
        answer: 'Colombia',
        difficulty: 'medium',
        funFact: 'Es de Barranquilla, Colombia'
      }
    ],
    hard: [
      {
        id: 'mus_hard_1',
        category: 'musica',
        question: '¿En qué año se formó la banda Queen?',
        answer: '1970',
        difficulty: 'hard',
        funFact: 'Freddie Mercury era su carismático vocalista'
      }
    ]
  }
};

// Función mejorada con sistema anti-repetición
const generateExpandedQuestion = async (
  category: CategoryType, 
  difficulty: DifficultyLevel, 
  gameId?: string
): Promise<Question> => {
  const categoryQuestions = expandedQuestionBank[category]?.[difficulty] || [];
  
  if (categoryQuestions.length === 0) {
    // Fallback al banco original si no hay preguntas en el expandido
    return await generateQuestionFromBank(category, difficulty);
  }
  
  // Si no hay gameId, comportamiento normal (sin tracking)
  if (!gameId) {
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const selectedQuestion = categoryQuestions[randomIndex];
    return {
      ...selectedQuestion,
      id: `${selectedQuestion.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
  }
  
  // Sistema anti-repetición: filtrar preguntas ya usadas
  const availableQuestions = categoryQuestions.filter(q => !isQuestionUsed(gameId, q.id));
  
  // Si todas las preguntas de esta categoría/dificultad fueron usadas, resetear y usar todas
  if (availableQuestions.length === 0) {
    console.log(`Todas las preguntas de ${category}/${difficulty} fueron usadas. Reseteando...`);
    for (const q of categoryQuestions) {
      if (usedQuestions[gameId]) {
        usedQuestions[gameId].delete(q.id);
      }
    }
    return generateExpandedQuestion(category, difficulty, gameId);
  }
  
  // Seleccionar pregunta no usada
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const selectedQuestion = availableQuestions[randomIndex];
  
  // Marcar como usada
  markQuestionAsUsed(gameId, selectedQuestion.id);
  
  return {
    ...selectedQuestion,
    id: `${selectedQuestion.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`
  };
};
