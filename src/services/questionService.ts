import type { Question, CategoryType, DifficultyLevel } from '@/types/game';

const CATEGORY_THEMES: Record<CategoryType, string> = {
  deportes: 'deportes, atletas, equipos, competencias, con humor para jóvenes',
  musica: 'música, artistas, géneros musicales, letras, con humor para jóvenes',
  historia: 'eventos históricos, personajes, fechas importantes, con humor para jóvenes',
  ciencia: 'ciencia, inventos, científicos, fenómenos naturales, con humor para jóvenes',
  entretenimiento: 'películas, series, celebridades, memes, con humor para jóvenes',
  geografia: 'países, ciudades, monumentos, culturas, con humor para jóvenes',
};

// Generador principal de preguntas - Intenta IA primero, fallback a banco estático
export const generateQuestion = async (category: CategoryType, difficulty: DifficultyLevel = 'medium'): Promise<Question> => {
  // Usar el generador expandido que incluye cientos de variaciones dinámicas
  try {
    return await generateExpandedQuestion(category, difficulty);
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

// Generador expandido de preguntas con templates dinámicos para crear cientos de variaciones
const questionTemplates: Record<CategoryType, Record<DifficultyLevel, Array<{
  template: string;
  variations: string[];
  answers: string[];
  funFacts: string[];
}>>> = {
  deportes: {
    easy: [
      {
        template: "¿Cuántos jugadores tiene un equipo de {} en la cancha?",
        variations: ["fútbol", "basketball", "voleibol", "hockey", "rugby", "polo acuático", "handball"],
        answers: ["11", "5", "6", "6 por equipo", "15", "7", "7"],
        funFacts: ["El fútbol es el deporte más popular", "Basketball se inventó en 1891", "Voleibol se creó en 1895", "Hockey se juega sobre hielo", "Rugby se originó en Inglaterra", "Deporte olímpico desde 1900", "También llamado balonmano"]
      },
      {
        template: "¿En qué deporte se usa {}?",
        variations: ["una raqueta", "un bate", "patines", "una red", "guantes", "casco", "pelota ovalada"],
        answers: ["Tenis/Ping pong", "Béisbol/Cricket", "Hockey/Patinaje", "Voleibol/Tenis", "Boxeo/Portería", "Fútbol americano", "Rugby/Fútbol americano"],
        funFacts: ["Las raquetas varían según el deporte", "El béisbol es muy popular en USA", "El patinaje requiere equilibrio", "La red divide el campo", "Protegen las manos", "Protege la cabeza", "Forma aerodinámica"]
      },
      {
        template: "¿Cuánto dura un partido de {}?",
        variations: ["fútbol", "basketball NBA", "tenis", "hockey", "rugby", "fútbol americano"],
        answers: ["90 minutos", "48 minutos", "Variable", "60 minutos", "80 minutos", "60 minutos"],
        funFacts: ["Más tiempo adicional", "4 cuartos de 12 min", "No hay límite de tiempo", "3 períodos de 20 min", "2 tiempos de 40 min", "4 cuartos de 15 min"]
      }
    ],
    medium: [
      {
        template: "¿En qué año se creó {}?",
        variations: ["el basketball", "el voleibol", "la FIFA", "los Juegos Olímpicos modernos", "la Copa del Mundo"],
        answers: ["1891", "1895", "1904", "1896", "1930"],
        funFacts: ["James Naismith lo inventó", "William Morgan lo creó", "Se fundó en París", "Comenzaron en Atenas", "Primera en Uruguay"]
      },
      {
        template: "¿Cuántos {} hay en {}?",
        variations: ["sets", "rounds", "cuartos", "períodos", "tiempos"],
        answers: ["3-5 en tenis", "12 max en boxeo", "4 en basketball", "3 en hockey", "2 en fútbol"],
        funFacts: ["Puede ser al mejor de 3 o 5", "Antes eran 15 rounds", "Cada cuarto dura 12 min", "Cada período son 20 min", "Cada tiempo son 45 min"]
      }
    ],
    hard: [
      {
        template: "¿Quién tiene el récord de más {} en {}?",
        variations: ["goles", "puntos en NBA", "Grand Slams", "medallas olímpicas", "victorias en F1"],
        answers: ["Cristiano (890+)", "Kareem Abdul-Jabbar", "Novak Djokovic (24)", "Michael Phelps (28)", "Lewis Hamilton (103)"],
        funFacts: ["Incluye clubes y selección", "38,387 puntos totales", "Superó a Federer y Nadal", "23 de oro, 3 plata, 2 bronce", "7 títulos mundiales también"]
      }
    ]
  },
  historia: {
    easy: [
      {
        template: "¿En qué año {}?",
        variations: ["llegó Colón a América", "se independizó Colombia", "terminó la Segunda Guerra", "cayó el Muro de Berlín", "llegó el hombre a la Luna"],
        answers: ["1492", "1810", "1945", "1989", "1969"],
        funFacts: ["12 de octubre", "20 de julio", "2 de septiembre", "9 de noviembre", "20 de julio"]
      },
      {
        template: "¿Quién fue {}?",
        variations: ["Simón Bolívar", "Napoleón", "Cleopatra", "Gandhi", "Einstein"],
        answers: ["El Libertador", "Emperador francés", "Reina de Egipto", "Líder de la no violencia", "Físico alemán"],
        funFacts: ["Liberó 6 países", "Conquistó gran parte de Europa", "Última faraona", "Independencia de India", "Teoría de la relatividad"]
      }
    ],
    medium: [
      {
        template: "¿Cuándo comenzó {}?",
        variations: ["la Primera Guerra Mundial", "la Revolución Francesa", "el Renacimiento", "la Guerra Fría"],
        answers: ["1914", "1789", "Siglo XIV", "1947"],
        funFacts: ["Asesinato del archiduque", "Tomaron la Bastilla", "Comenzó en Italia", "Después de la Segunda Guerra"]
      }
    ],
    hard: [
      {
        template: "¿Cuándo terminó {}?",
        variations: ["el Imperio Romano", "la Edad Media", "el Imperio Bizantino", "la Guerra de los Cien Años"],
        answers: ["476 d.C.", "1453", "1453", "1453"],
        funFacts: ["Cayó Roma Occidental", "Cayó Constantinopla", "Mismo año que la Edad Media", "Inglaterra vs Francia"]
      }
    ]
  },
  ciencia: {
    easy: [
      {
        template: "¿Cuántos {} tiene {}?",
        variations: ["planetas", "huesos", "continentes", "elementos"],
        answers: ["8", "206 adulto", "7", "118 conocidos"],
        funFacts: ["Plutón ya no cuenta", "Bebés nacen con más", "Incluyendo Antártida", "Tabla periódica actual"]
      }
    ],
    medium: [
      {
        template: "¿Qué gas produce {}?",
        variations: ["la fotosíntesis", "la respiración", "la combustión", "la fermentación"],
        answers: ["Oxígeno", "Dióxido de carbono", "Dióxido de carbono", "Dióxido de carbono"],
        funFacts: ["Las plantas lo liberan", "Los animales lo expiran", "Quema combustibles", "Proceso de levaduras"]
      }
    ],
    hard: [
      {
        template: "¿Cuál es la fórmula de {}?",
        variations: ["la cafeína", "la aspirina", "la glucosa", "el ADN"],
        answers: ["C8H10N4O2", "C9H8O4", "C6H12O6", "Desoxirribonucleico"],
        funFacts: ["Estimulante natural", "Ácido acetilsalicílico", "Azúcar simple", "Contiene información genética"]
      }
    ]
  },
  geografia: {
    easy: [
      {
        template: "¿Cuál es la capital de {}?",
        variations: ["Francia", "Brasil", "Japón", "Australia", "Egipto", "Canadá", "Argentina"],
        answers: ["París", "Brasília", "Tokio", "Canberra", "El Cairo", "Ottawa", "Buenos Aires"],
        funFacts: ["Ciudad de la luz", "No es Río", "Antes era Edo", "No es Sídney", "Cerca de pirámides", "No es Toronto", "Puerto bueno"]
      }
    ],
    medium: [
      {
        template: "¿Qué río pasa por {}?",
        variations: ["París", "Londres", "Egipto", "Nueva York", "Roma"],
        answers: ["Sena", "Támesis", "Nilo", "Hudson", "Tíber"],
        funFacts: ["Divide la ciudad", "Big Ben está cerca", "El más largo del mundo", "Desemboca en el Atlántico", "Ciudad eterna"]
      }
    ],
    hard: [
      {
        template: "¿Cuál es el {} más {} del mundo?",
        variations: ["desierto|grande", "lago|profundo", "río|largo", "monte|alto"],
        answers: ["Sahara", "Baikal", "Nilo", "Everest"],
        funFacts: ["9 millones km²", "1,642m profundo", "6,650 km largo", "8,849m alto"]
      }
    ]
  },
  entretenimiento: {
    easy: [
      {
        template: "¿Quién creó {}?",
        variations: ["Mickey Mouse", "Harry Potter", "Pokemon", "Los Simpson", "Spider-Man"],
        answers: ["Walt Disney", "J.K. Rowling", "Satoshi Tajiri", "Matt Groening", "Stan Lee"],
        funFacts: ["1928 debut", "Escrito en cafeterías", "Inspirado en coleccionismo", "Comenzó como sketches", "Marvel Comics"]
      }
    ],
    medium: [
      {
        template: "¿En qué película se dice '{}'?",
        variations: ["Yo soy tu padre", "Que la fuerza te acompañe", "Hasta el infinito y más allá", "Hakuna Matata"],
        answers: ["Star Wars", "Star Wars", "Toy Story", "El Rey León"],
        funFacts: ["Darth Vader lo dice", "Saludo Jedi", "Buzz Lightyear", "Significa sin preocupaciones"]
      }
    ],
    hard: [
      {
        template: "¿Quién dirigió {}?",
        variations: ["Psycho", "2001 Odisea", "Pulp Fiction", "El Padrino"],
        answers: ["Alfred Hitchcock", "Stanley Kubrick", "Quentin Tarantino", "Francis Ford Coppola"],
        funFacts: ["Maestro del suspenso", "Perfeccionista obsesivo", "Diálogos únicos", "Trilogía legendaria"]
      }
    ]
  },
  musica: {
    easy: [
      {
        template: "¿Quién canta {}?",
        variations: ["Despacito", "Shape of You", "Bohemian Rhapsody", "Billie Jean"],
        answers: ["Luis Fonsi", "Ed Sheeran", "Queen", "Michael Jackson"],
        funFacts: ["Éxito mundial 2017", "Canción más escuchada", "6 minutos de duración", "Rey del pop"]
      }
    ],
    medium: [
      {
        template: "¿De qué país es {}?",
        variations: ["Shakira", "Coldplay", "ABBA", "U2"],
        answers: ["Colombia", "Reino Unido", "Suecia", "Irlanda"],
        funFacts: ["Barranquilla", "Londres", "Estocolmo", "Dublín"]
      }
    ],
    hard: [
      {
        template: "¿En qué año se formó {}?",
        variations: ["The Beatles", "Pink Floyd", "Led Zeppelin", "Queen"],
        answers: ["1960", "1965", "1968", "1970"],
        funFacts: ["Liverpool", "Londres", "Londres", "Londres con Freddie"]
      }
    ]
  }
};

// Función que combina banco estático + templates dinámicos para generar cientos de preguntas
const generateExpandedQuestion = async (category: CategoryType, difficulty: DifficultyLevel): Promise<Question> => {
  const allQuestions: Question[] = [];
  
  // Generar preguntas dinámicas desde templates (esto crea cientos de variaciones)
  const templates = questionTemplates[category]?.[difficulty] || [];
  for (const [templateIndex, template] of templates.entries()) {
    for (const [variationIndex, variation] of template.variations.entries()) {
      const question = template.template.split('{}').join(variation);
      allQuestions.push({
        id: `expanded_${category}_${difficulty}_${templateIndex}_${variationIndex}_${Date.now()}`,
        category,
        question,
        answer: template.answers[variationIndex] || template.answers[0],
        difficulty,
        funFact: template.funFacts[variationIndex] || template.funFacts[0]
      });
    }
  }
  
  if (allQuestions.length === 0) {
    // Fallback al banco original si no hay templates
    return await generateQuestionFromBank(category, difficulty);
  }
  
  const randomIndex = Math.floor(Math.random() * allQuestions.length);
  return allQuestions[randomIndex];
};
