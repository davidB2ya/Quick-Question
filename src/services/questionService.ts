import type { Question, CategoryType, DifficultyLevel } from '@/types/game';
import { generateQuestion } from '@/services/geminiService';

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

// Generador principal de preguntas - Intenta IA primero, fallback a banco estático
export const generateQuestionTry = async (
  category: CategoryType,
  difficulty: DifficultyLevel = 'medium',
  gameId?: string
): Promise<Question> => {
  try {
    // Intentar generar pregunta con IA
    const aiQuestion = await generateQuestion(category, difficulty);

    // Verificar si la pregunta generada ya fue usada
    if (gameId && isQuestionUsed(gameId, aiQuestion.id)) {
      throw new Error('Pregunta generada por IA ya fue usada');
    }

    // Marcar la pregunta como usada y devolverla
    if (gameId) {
      markQuestionAsUsed(gameId, aiQuestion.id);
    }

    return aiQuestion;
  } catch (error) {
    console.warn('Error al generar pregunta con IA, usando banco estático:', error);

    // Fallback al banco estático
    const staticQuestion = await generateQuestionFromBank(category, difficulty);

    // Verificar si la pregunta del banco ya fue usada
    if (gameId && isQuestionUsed(gameId, staticQuestion.id)) {
      throw new Error('Pregunta del banco estático ya fue usada');
    }

    // Marcar la pregunta como usada y devolverla
    if (gameId) {
      markQuestionAsUsed(gameId, staticQuestion.id);
    }

    return staticQuestion;
  }
};

// Generador usando banco estático como fallback
export const generateQuestionFromBank = async (category: CategoryType, difficulty: DifficultyLevel = 'medium'): Promise<Question> => {
  // Usar directamente el banco expandido
  return generateExpandedQuestion(category, difficulty);
};

// Función principal para generación con OpenAI
export const generateQuestionWithAI = async (
  category: CategoryType,
  difficulty: DifficultyLevel = 'medium'
): Promise<Question> => {
  try {
    const geminiQuestion = await generateQuestion(category, difficulty);

    return {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      category,
      question: geminiQuestion.question,
      answer: geminiQuestion.answer,
      difficulty: geminiQuestion.difficulty,
      funFact: geminiQuestion.funFact,
    };
  } catch (error) {
    console.error('Error generating question with Gemini:', error);
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
      },
      {
        id: 'dep_hard_5',
        category: 'deportes',
        question: '¿Cuál es el récord mundial femenino en los 100 metros planos?',
        answer: '10.49 segundos',
        difficulty: 'hard',
        funFact: 'Lo tiene Florence Griffith-Joyner desde 1988'
      },
      {
        id: 'dep_hard_6',
        category: 'deportes',
        question: '¿En qué año se celebraron los primeros Juegos Olímpicos modernos?',
        answer: '1896',
        difficulty: 'hard',
        funFact: 'Se celebraron en Atenas, Grecia'
      },
      {
        id: 'dep_hard_7',
        category: 'deportes',
        question: '¿Cuántos anillos olímpicos hay y qué representan?',
        answer: '5 anillos, representan los 5 continentes',
        difficulty: 'hard',
        funFact: 'Los colores pueden formar la bandera de cualquier país'
      },
      {
        id: 'dep_hard_8',
        category: 'deportes',
        question: '¿Quién es el máximo goleador en la historia de los Mundiales?',
        answer: 'Miroslav Klose',
        difficulty: 'hard',
        funFact: 'Marcó 16 goles en 4 Mundiales con Alemania'
      },
      {
        id: 'dep_hard_9',
        category: 'deportes',
        question: '¿En qué deporte se compite por la Copa Davis?',
        answer: 'Tenis',
        difficulty: 'hard',
        funFact: 'Es la competencia internacional por equipos más importante'
      },
      {
        id: 'dep_hard_10',
        category: 'deportes',
        question: '¿Cuál es el único país que ha participado en todos los Mundiales de fútbol?',
        answer: 'Brasil',
        difficulty: 'hard',
        funFact: 'También es el que más Mundiales ha ganado con 5 títulos'
      },
      {
        id: 'dep_hard_11',
        category: 'deportes',
        question: '¿En qué año Muhammad Ali ganó su primer título mundial de peso pesado?',
        answer: '1964',
        difficulty: 'hard',
        funFact: 'Derrotó a Sonny Liston cuando aún se llamaba Cassius Clay'
      },
      {
        id: 'dep_hard_12',
        category: 'deportes',
        question: '¿Cuál es el torneo de tenis más antiguo del mundo?',
        answer: 'Wimbledon',
        difficulty: 'hard',
        funFact: 'Se celebra desde 1877 en Londres'
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
      },
      {
        id: 'hist_med_3',
        category: 'historia',
        question: '¿Quién fue el primer emperador de Roma?',
        answer: 'Augusto',
        difficulty: 'medium',
        funFact: 'Su nombre original era Cayo Julio César Octaviano'
      },
      {
        id: 'hist_med_4',
        category: 'historia',
        question: '¿En qué año cayó el Imperio Bizantino?',
        answer: '1453',
        difficulty: 'medium',
        funFact: 'Constantinopla fue conquistada por los otomanos'
      },
      {
        id: 'hist_med_5',
        category: 'historia',
        question: '¿Quién escribió "El Manifiesto Comunista"?',
        answer: 'Karl Marx y Friedrich Engels',
        difficulty: 'medium',
        funFact: 'Fue publicado en 1848'
      },
      {
        id: 'hist_med_6',
        category: 'historia',
        question: '¿En qué batalla derrotó Napoleón a los austríacos y rusos?',
        answer: 'Batalla de Austerlitz',
        difficulty: 'medium',
        funFact: 'También conocida como la Batalla de los Tres Emperadores'
      },
      {
        id: 'hist_med_7',
        category: 'historia',
        question: '¿Cuánto duró la Guerra de los Cien Años?',
        answer: '116 años',
        difficulty: 'medium',
        funFact: 'Fue entre Francia e Inglaterra de 1337 a 1453'
      },
      {
        id: 'hist_med_8',
        category: 'historia',
        question: '¿Quién fue el presidente de Estados Unidos durante la Guerra Civil?',
        answer: 'Abraham Lincoln',
        difficulty: 'medium',
        funFact: 'También abolió la esclavitud con la Proclamación de Emancipación'
      },
      {
        id: 'hist_med_9',
        category: 'historia',
        question: '¿En qué año se firmó la Independencia de Estados Unidos?',
        answer: '1776',
        difficulty: 'medium',
        funFact: 'Se firmó el 4 de julio, ahora día nacional'
      },
      {
        id: 'hist_med_10',
        category: 'historia',
        question: '¿Cuál fue la primera civilización en usar la escritura?',
        answer: 'Los sumerios',
        difficulty: 'medium',
        funFact: 'Desarrollaron la escritura cuneiforme hace 5000 años'
      },
      {
        id: 'hist_med_11',
        category: 'historia',
        question: '¿En qué año se hundió el Titanic?',
        answer: '1912',
        difficulty: 'medium',
        funFact: 'Se hundió en su viaje inaugural el 15 de abril'
      },
      {
        id: 'hist_med_12',
        category: 'historia',
        question: '¿Quién fue el líder de la Revolución Cubana?',
        answer: 'Fidel Castro',
        difficulty: 'medium',
        funFact: 'Gobernó Cuba por casi 50 años'
      },
      {
        id: 'hist_med_13',
        category: 'historia',
        question: '¿En qué año se construyó el Muro de Berlín?',
        answer: '1961',
        difficulty: 'medium',
        funFact: 'Separó Berlín Oriental de Occidental por 28 años'
      },
      {
        id: 'hist_med_14',
        category: 'historia',
        question: '¿Quién conquistó el Imperio Azteca?',
        answer: 'Hernán Cortés',
        difficulty: 'medium',
        funFact: 'Conquistó a Moctezuma II y el Imperio Azteca en 1521'
      },
      {
        id: 'hist_med_15',
        category: 'historia',
        question: '¿En qué siglo vivió Juana de Arco?',
        answer: 'Siglo XV',
        difficulty: 'medium',
        funFact: 'Fue quemada en la hoguera en 1431 a los 19 años'
      },
      {
        id: 'hist_med_16',
        category: 'historia',
        question: '¿Cuándo se creó la ONU?',
        answer: '1945',
        difficulty: 'medium',
        funFact: 'Se fundó después de la Segunda Guerra Mundial'
      },
      {
        id: 'hist_med_17',
        category: 'historia',
        question: '¿Quién fue el último emperador de Rusia?',
        answer: 'Nicolás II',
        difficulty: 'medium',
        funFact: 'Fue ejecutado junto a su familia en 1918'
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
      },
      {
        id: 'hist_hard_2',
        category: 'historia',
        question: '¿En qué año se firmó el Tratado de Versalles?',
        answer: '1919',
        difficulty: 'hard',
        funFact: 'Puso fin oficialmente a la Primera Guerra Mundial'
      },
      {
        id: 'hist_hard_3',
        category: 'historia',
        question: '¿Cuál fue la capital del Imperio Inca?',
        answer: 'Cusco',
        difficulty: 'hard',
        funFact: 'Los incas la llamaban "el ombligo del mundo"'
      },
      {
        id: 'hist_hard_4',
        category: 'historia',
        question: '¿En qué año se abolió la esclavitud en Brasil?',
        answer: '1888',
        difficulty: 'hard',
        funFact: 'Brasil fue el último país de América en abolir la esclavitud'
      },
      {
        id: 'hist_hard_5',
        category: 'historia',
        question: '¿Quién fue el faraón que construyó la Gran Pirámide de Giza?',
        answer: 'Keops (Khufu)',
        difficulty: 'hard',
        funFact: 'Fue una de las Siete Maravillas del Mundo Antiguo'
      },
      {
        id: 'hist_hard_6',
        category: 'historia',
        question: '¿En qué batalla se selló la derrota de Napoleón?',
        answer: 'Batalla de Waterloo',
        difficulty: 'hard',
        funFact: 'Ocurrió el 18 de junio de 1815 en Bélgica'
      },
      {
        id: 'hist_hard_7',
        category: 'historia',
        question: '¿Cuál fue la primera dinastía de China?',
        answer: 'Dinastía Xia',
        difficulty: 'hard',
        funFact: 'Existió aproximadamente desde 2070 hasta 1600 a.C.'
      },
      {
        id: 'hist_hard_8',
        category: 'historia',
        question: '¿En qué año comenzó la Revolución Rusa?',
        answer: '1917',
        difficulty: 'hard',
        funFact: 'Hubo dos revoluciones: en febrero y octubre de 1917'
      },
      {
        id: 'hist_hard_9',
        category: 'historia',
        question: '¿Quién fue el emperador romano cuando se legalizó el cristianismo?',
        answer: 'Constantino I',
        difficulty: 'hard',
        funFact: 'Promulgó el Edicto de Milán en 313 d.C.'
      },
      {
        id: 'hist_hard_10',
        category: 'historia',
        question: '¿Cuándo comenzó la peste negra en Europa?',
        answer: '1347',
        difficulty: 'hard',
        funFact: 'Mató a un tercio de la población europea'
      },
      {
        id: 'hist_hard_11',
        category: 'historia',
        question: '¿En qué año Colón hizo su segundo viaje a América?',
        answer: '1493',
        difficulty: 'hard',
        funFact: 'En este viaje fundó la primera colonia europea permanente'
      },
      {
        id: 'hist_hard_12',
        category: 'historia',
        question: '¿Quién fue el último emperador del Sacro Imperio Romano Germánico?',
        answer: 'Francisco II',
        difficulty: 'hard',
        funFact: 'Abdicó en 1806 tras las guerras napoleónicas'
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
      },
      {
        id: 'cien_med_2',
        category: 'ciencia',
        question: '¿Cuántos cromosomas tiene el ser humano?',
        answer: '46 cromosomas',
        difficulty: 'medium',
        funFact: '23 pares de cromosomas, uno de cada padre'
      },
      {
        id: 'cien_med_3',
        category: 'ciencia',
        question: '¿Qué científico desarrolló la teoría de la relatividad?',
        answer: 'Albert Einstein',
        difficulty: 'medium',
        funFact: 'Su ecuación más famosa es E=mc²'
      },
      {
        id: 'cien_med_4',
        category: 'ciencia',
        question: '¿Cuál es el elemento químico más abundante en el universo?',
        answer: 'Hidrógeno',
        difficulty: 'medium',
        funFact: 'Representa aproximadamente el 75% de la materia visible'
      },
      {
        id: 'cien_med_5',
        category: 'ciencia',
        question: '¿Qué órgano produce la insulina?',
        answer: 'El páncreas',
        difficulty: 'medium',
        funFact: 'La insulina regula los niveles de azúcar en la sangre'
      },
      {
        id: 'cien_med_6',
        category: 'ciencia',
        question: '¿Cuántos litros de sangre bombea el corazón por minuto?',
        answer: 'Aproximadamente 5 litros',
        difficulty: 'medium',
        funFact: 'En reposo, el corazón late entre 60-100 veces por minuto'
      },
      {
        id: 'cien_med_7',
        category: 'ciencia',
        question: '¿Qué parte del cerebro controla el equilibrio?',
        answer: 'El cerebelo',
        difficulty: 'medium',
        funFact: 'También coordina los movimientos musculares'
      },
      {
        id: 'cien_med_8',
        category: 'ciencia',
        question: '¿Cuál es la unidad básica de la herencia?',
        answer: 'El gen',
        difficulty: 'medium',
        funFact: 'Los genes están hechos de ADN'
      },
      {
        id: 'cien_med_9',
        category: 'ciencia',
        question: '¿Qué tipo de energía almacenan las baterías?',
        answer: 'Energía química',
        difficulty: 'medium',
        funFact: 'Se convierte en energía eléctrica cuando se usa'
      },
      {
        id: 'cien_med_10',
        category: 'ciencia',
        question: '¿Cuál es el hueso más largo del cuerpo humano?',
        answer: 'El fémur',
        difficulty: 'medium',
        funFact: 'Se encuentra en el muslo y puede soportar 30 veces el peso corporal'
      },
      {
        id: 'cien_med_11',
        category: 'ciencia',
        question: '¿Qué científica descubrió el radio y el polonio?',
        answer: 'Marie Curie',
        difficulty: 'medium',
        funFact: 'Fue la primera mujer en ganar un Premio Nobel'
      },
      {
        id: 'cien_med_12',
        category: 'ciencia',
        question: '¿Cuál es la fuerza que mantiene a los planetas en órbita?',
        answer: 'La gravedad',
        difficulty: 'medium',
        funFact: 'Newton fue el primero en describir la ley de gravitación universal'
      },
      {
        id: 'cien_med_13',
        category: 'ciencia',
        question: '¿Qué gas compone principalmente la atmósfera de Marte?',
        answer: 'Dióxido de carbono',
        difficulty: 'medium',
        funFact: 'La atmósfera marciana es 95% CO2'
      },
      {
        id: 'cien_med_14',
        category: 'ciencia',
        question: '¿Cuánto tarda la luz del Sol en llegar a la Tierra?',
        answer: 'Aproximadamente 8 minutos',
        difficulty: 'medium',
        funFact: 'Exactamente 8 minutos y 20 segundos'
      },
      {
        id: 'cien_med_15',
        category: 'ciencia',
        question: '¿Qué partícula subatómica tiene carga positiva?',
        answer: 'El protón',
        difficulty: 'medium',
        funFact: 'Los electrones tienen carga negativa y los neutrones son neutros'
      },
      {
        id: 'cien_med_16',
        category: 'ciencia',
        question: '¿Cuál es la escala para medir la acidez?',
        answer: 'Escala de pH',
        difficulty: 'medium',
        funFact: 'Va de 0 (muy ácido) a 14 (muy básico), 7 es neutro'
      },
      {
        id: 'cien_med_17',
        category: 'ciencia',
        question: '¿Qué proceso permite a las plantas crear su propio alimento?',
        answer: 'Fotosíntesis',
        difficulty: 'medium',
        funFact: 'Convierten luz solar, agua y CO2 en glucosa'
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
      },
      {
        id: 'cien_hard_2',
        category: 'ciencia',
        question: '¿Cuál es la constante de Avogadro?',
        answer: '6.022 × 10²³',
        difficulty: 'hard',
        funFact: 'Es el número de partículas en un mol de sustancia'
      },
      {
        id: 'cien_hard_3',
        category: 'ciencia',
        question: '¿Qué científico propuso el modelo atómico con electrones en órbitas?',
        answer: 'Niels Bohr',
        difficulty: 'hard',
        funFact: 'Su modelo explicaba las líneas espectrales del hidrógeno'
      },
      {
        id: 'cien_hard_4',
        category: 'ciencia',
        question: '¿Cuál es la temperatura del cero absoluto en Celsius?',
        answer: '-273.15°C',
        difficulty: 'hard',
        funFact: 'Es la temperatura más baja posible en el universo'
      },
      {
        id: 'cien_hard_5',
        category: 'ciencia',
        question: '¿Qué partícula mediadora transmite la fuerza electromagnética?',
        answer: 'El fotón',
        difficulty: 'hard',
        funFact: 'Los fotones no tienen masa ni carga eléctrica'
      },
      {
        id: 'cien_hard_6',
        category: 'ciencia',
        question: '¿Cuántos aminoácidos esenciales necesita el cuerpo humano?',
        answer: '9 aminoácidos esenciales',
        difficulty: 'hard',
        funFact: 'El cuerpo no puede producirlos, deben obtenerse de la dieta'
      },
      {
        id: 'cien_hard_7',
        category: 'ciencia',
        question: '¿Qué ley establece que la entropía del universo siempre aumenta?',
        answer: 'Segunda ley de la termodinámica',
        difficulty: 'hard',
        funFact: 'También explica por qué no existe el movimiento perpetuo'
      },
      {
        id: 'cien_hard_8',
        category: 'ciencia',
        question: '¿Cuál es la vida media del carbono-14?',
        answer: '5,730 años',
        difficulty: 'hard',
        funFact: 'Se usa para datar objetos orgánicos antiguos'
      },
      {
        id: 'cien_hard_9',
        category: 'ciencia',
        question: '¿Qué estructura celular contiene el ADN en las células eucariotas?',
        answer: 'El núcleo',
        difficulty: 'hard',
        funFact: 'Las células procariotas no tienen núcleo definido'
      },
      {
        id: 'cien_hard_10',
        category: 'ciencia',
        question: '¿Cuál es el punto de fusión del hierro puro?',
        answer: '1,538°C',
        difficulty: 'hard',
        funFact: 'Es uno de los metales con punto de fusión más alto'
      },
      {
        id: 'cien_hard_11',
        category: 'ciencia',
        question: '¿Qué principio establece que no se puede conocer simultáneamente la posición y momento de una partícula?',
        answer: 'Principio de incertidumbre de Heisenberg',
        difficulty: 'hard',
        funFact: 'Es fundamental en la mecánica cuántica'
      },
      {
        id: 'cien_hard_12',
        category: 'ciencia',
        question: '¿Cuántas cámaras tiene el corazón de un pez?',
        answer: '2 cámaras',
        difficulty: 'hard',
        funFact: 'Los humanos tienen 4, las ranas 3 y los peces 2'
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
      },
      {
        id: 'geo_hard_2',
        category: 'geografia',
        question: '¿Cuál es el punto más profundo de los océanos?',
        answer: 'Fosa de las Marianas',
        difficulty: 'hard',
        funFact: 'Alcanza una profundidad de 11,034 metros'
      },
      {
        id: 'geo_hard_3',
        category: 'geografia',
        question: '¿En qué país se encuentra el Lago Titicaca?',
        answer: 'Entre Perú y Bolivia',
        difficulty: 'hard',
        funFact: 'Es el lago navegable más alto del mundo'
      },
      {
        id: 'geo_hard_4',
        category: 'geografia',
        question: '¿Cuál es la capital de Kazajistán?',
        answer: 'Nur-Sultan (antes Astana)',
        difficulty: 'hard',
        funFact: 'Cambió su nombre en honor al primer presidente'
      },
      {
        id: 'geo_hard_5',
        category: 'geografia',
        question: '¿Qué país tiene más husos horarios?',
        answer: 'Francia',
        difficulty: 'hard',
        funFact: 'Tiene 12 husos horarios debido a sus territorios de ultramar'
      },
      {
        id: 'geo_hard_6',
        category: 'geografia',
        question: '¿Cuál es el río más caudaloso del mundo?',
        answer: 'Río Amazonas',
        difficulty: 'hard',
        funFact: 'Descarga más agua al océano que los siguientes 7 ríos juntos'
      },
      {
        id: 'geo_hard_7',
        category: 'geografia',
        question: '¿En qué cordillera se encuentra el K2?',
        answer: 'Karakóram',
        difficulty: 'hard',
        funFact: 'Es la segunda montaña más alta del mundo'
      },
      {
        id: 'geo_hard_8',
        category: 'geografia',
        question: '¿Cuál es la isla más grande del mundo?',
        answer: 'Groenlandia',
        difficulty: 'hard',
        funFact: 'Tiene más de 2 millones de km² pero solo 56,000 habitantes'
      },
      {
        id: 'geo_hard_9',
        category: 'geografia',
        question: '¿Qué estrecho separa Alaska de Rusia?',
        answer: 'Estrecho de Bering',
        difficulty: 'hard',
        funFact: 'En su punto más estrecho mide solo 85 kilómetros'
      },
      {
        id: 'geo_hard_10',
        category: 'geografia',
        question: '¿Cuál es el país con más volcanes activos?',
        answer: 'Indonesia',
        difficulty: 'hard',
        funFact: 'Tiene más de 130 volcanes activos'
      },
      {
        id: 'geo_hard_11',
        category: 'geografia',
        question: '¿En qué país está el desierto de Atacama?',
        answer: 'Chile',
        difficulty: 'hard',
        funFact: 'Es el desierto más árido del mundo'
      },
      {
        id: 'geo_hard_12',
        category: 'geografia',
        question: '¿Cuál es la capital de Myanmar?',
        answer: 'Naipyidó',
        difficulty: 'hard',
        funFact: 'Reemplazó a Yangón como capital en 2006'
      },
      {
        id: 'geo_hard_13',
        category: 'geografia',
        question: '¿Qué país tiene la frontera terrestre más larga del mundo?',
        answer: 'China',
        difficulty: 'hard',
        funFact: 'Comparte frontera con 14 países diferentes'
      },
      {
        id: 'geo_hard_14',
        category: 'geografia',
        question: '¿En qué continente está ubicado el Sahara?',
        answer: 'África',
        difficulty: 'hard',
        funFact: 'Cubre gran parte del norte de África'
      },
      {
        id: 'geo_hard_15',
        category: 'geografia',
        question: '¿Cuál es el lago más grande de África?',
        answer: 'Lago Victoria',
        difficulty: 'hard',
        funFact: 'Es compartido por Uganda, Kenia y Tanzania'
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
      },
      {
        id: 'ent_med_2',
        category: 'entretenimiento',
        question: '¿Quién dirigió la película Titanic?',
        answer: 'James Cameron',
        difficulty: 'medium',
        funFact: 'También dirigió Avatar y Terminator'
      },
      {
        id: 'ent_med_3',
        category: 'entretenimiento',
        question: '¿En qué año se estrenó la primera película de Harry Potter?',
        answer: '2001',
        difficulty: 'medium',
        funFact: 'Harry Potter y la Piedra Filosofal fue la primera'
      },
      {
        id: 'ent_med_4',
        category: 'entretenimiento',
        question: '¿Cuál es el nombre real de Iron Man en Marvel?',
        answer: 'Tony Stark',
        difficulty: 'medium',
        funFact: 'Robert Downey Jr. lo interpretó en 10 películas'
      },
      {
        id: 'ent_med_5',
        category: 'entretenimiento',
        question: '¿Qué serie de Netflix se desarrolla en los años 80 en Hawkins?',
        answer: 'Stranger Things',
        difficulty: 'medium',
        funFact: 'Los hermanos Duffer crearon la serie'
      },
      {
        id: 'ent_med_6',
        category: 'entretenimiento',
        question: '¿Quién interpretó a Jack en la película Titanic?',
        answer: 'Leonardo DiCaprio',
        difficulty: 'medium',
        funFact: 'Ganó su primer Oscar en 2016 por The Revenant'
      },
      {
        id: 'ent_med_7',
        category: 'entretenimiento',
        question: '¿Cuál es la saga de películas más taquillera de la historia?',
        answer: 'Marvel Cinematic Universe',
        difficulty: 'medium',
        funFact: 'Ha recaudado más de 25 mil millones de dólares'
      },
      {
        id: 'ent_med_8',
        category: 'entretenimiento',
        question: '¿En qué plataforma se puede ver "The Mandalorian"?',
        answer: 'Disney+',
        difficulty: 'medium',
        funFact: 'Es la serie más exitosa de la plataforma'
      },
      {
        id: 'ent_med_9',
        category: 'entretenimiento',
        question: '¿Quién creó la serie "Breaking Bad"?',
        answer: 'Vince Gilligan',
        difficulty: 'medium',
        funFact: 'También creó la serie spin-off "Better Call Saul"'
      },
      {
        id: 'ent_med_10',
        category: 'entretenimiento',
        question: '¿Cuál es el videojuego más vendido de todos los tiempos?',
        answer: 'Minecraft',
        difficulty: 'medium',
        funFact: 'Ha vendido más de 300 millones de copias'
      },
      {
        id: 'ent_med_11',
        category: 'entretenimiento',
        question: '¿En qué año se lanzó el primer iPhone?',
        answer: '2007',
        difficulty: 'medium',
        funFact: 'Steve Jobs lo presentó el 9 de enero de 2007'
      },
      {
        id: 'ent_med_12',
        category: 'entretenimiento',
        question: '¿Qué actor interpreta a Deadpool?',
        answer: 'Ryan Reynolds',
        difficulty: 'medium',
        funFact: 'Luchó durante años para hacer la película'
      },
      {
        id: 'ent_med_13',
        category: 'entretenimiento',
        question: '¿Cuál es la serie más vista de Netflix?',
        answer: 'Squid Game',
        difficulty: 'medium',
        funFact: 'Es una serie surcoreana que rompió récords'
      },
      {
        id: 'ent_med_14',
        category: 'entretenimiento',
        question: '¿Quién dirigió la trilogía original de Star Wars?',
        answer: 'George Lucas',
        difficulty: 'medium',
        funFact: 'También creó Indiana Jones'
      },
      {
        id: 'ent_med_15',
        category: 'entretenimiento',
        question: '¿En qué consola se lanzó originalmente Super Mario Bros?',
        answer: 'Nintendo Entertainment System (NES)',
        difficulty: 'medium',
        funFact: 'Fue lanzado en 1985 en Japón'
      },
      {
        id: 'ent_med_16',
        category: 'entretenimiento',
        question: '¿Cuál es el canal de YouTube con más suscriptores?',
        answer: 'T-Series',
        difficulty: 'medium',
        funFact: 'Es un canal de música de India'
      },
      {
        id: 'ent_med_17',
        category: 'entretenimiento',
        question: '¿Qué actriz interpretó a Hermione en Harry Potter?',
        answer: 'Emma Watson',
        difficulty: 'medium',
        funFact: 'Ahora es activista por los derechos de las mujeres'
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
      },
      {
        id: 'ent_hard_2',
        category: 'entretenimiento',
        question: '¿Cuál fue la primera película completamente animada por computadora?',
        answer: 'Toy Story (1995)',
        difficulty: 'hard',
        funFact: 'Fue producida por Pixar y distribuida por Disney'
      },
      {
        id: 'ent_hard_3',
        category: 'entretenimiento',
        question: '¿En qué año se fundó Netflix?',
        answer: '1997',
        difficulty: 'hard',
        funFact: 'Comenzó como servicio de alquiler de DVDs por correo',
      },
      {
        id: 'ent_hard_4',
        category: 'entretenimiento',
        question: '¿Cuál es el nombre real del actor que interpreta a The Rock?',
        answer: 'Dwayne Johnson',
        difficulty: 'hard',
        funFact: 'Fue luchador profesional antes de ser actor'
      },
      {
        id: 'ent_hard_5',
        category: 'entretenimiento',
        question: '¿Qué película ganó el primer Oscar a Mejor Película Animada?',
        answer: 'Shrek (2001)',
        difficulty: 'hard',
        funFact: 'Venció a Monsters, Inc. y Jimmy Neutron'
      },
      {
        id: 'ent_hard_6',
        category: 'entretenimiento',
        question: '¿En qué año se lanzó la primera consola PlayStation?',
        answer: '1994',
        difficulty: 'hard',
        funFact: 'Sony originalmente iba a colaborar con Nintendo'
      },
      {
        id: 'ent_hard_7',
        category: 'entretenimiento',
        question: '¿Quién compuso la música de la película Jaws (Tiburón)?',
        answer: 'John Williams',
        difficulty: 'hard',
        funFact: 'También compuso la música de Star Wars e Indiana Jones'
      },
      {
        id: 'ent_hard_8',
        category: 'entretenimiento',
        question: '¿Cuál es el nombre real de Lady Gaga?',
        answer: 'Stefani Joanne Angelina Germanotta',
        difficulty: 'hard',
        funFact: 'Su nombre artístico viene de la canción "Radio Ga Ga" de Queen'
      },
      {
        id: 'ent_hard_9',
        category: 'entretenimiento',
        question: '¿En qué serie aparece el personaje Walter White?',
        answer: 'Breaking Bad',
        difficulty: 'hard',
        funFact: 'Bryan Cranston ganó 4 Emmys por este papel'
      },
      {
        id: 'ent_hard_10',
        category: 'entretenimiento',
        question: '¿Cuál es el videojuego que popularizó el género Battle Royale?',
        answer: 'PlayerUnknown\'s Battlegrounds (PUBG)',
        difficulty: 'hard',
        funFact: 'Aunque Fortnite lo hizo más mainstream'
      },
      {
        id: 'ent_hard_11',
        category: 'entretenimiento',
        question: '¿Qué director ha ganado más Oscars a Mejor Director?',
        answer: 'John Ford',
        difficulty: 'hard',
        funFact: 'Ganó 4 Oscars a Mejor Director'
      },
      {
        id: 'ent_hard_12',
        category: 'entretenimiento',
        question: '¿En qué año se estrenó el primer episodio de Los Simpson?',
        answer: '1989',
        difficulty: 'hard',
        funFact: 'Es la serie animada más longeva de la historia'
      }
    ]
  },
  musica: {
    easy: [
      {
        id: 'mus_easy_1',
        category: 'musica',
        question: '¿Cuántas cuerdas tiene una guitarra?',
        answer: '6 cuerdas',
        difficulty: 'easy',
        funFact: 'La guitarra eléctrica fue inventada en 1931'
      },
      {
        id: 'mus_easy_2',
        category: 'musica',
        question: '¿Qué artista colombiano canta "Hawái"?',
        answer: 'Maluma',
        difficulty: 'easy',
        funFact: 'Maluma significa: "Mamá ama Luz y Marlli ama"'
      },
      {
        id: 'mus_easy_3',
        category: 'musica',
        question: '¿Cuántas teclas negras tiene un piano?',
        answer: '36 teclas negras',
        difficulty: 'easy',
        funFact: 'Un piano tiene 88 teclas en total'
      },
      {
        id: 'mus_easy_4',
        category: 'musica',
        question: '¿Quién canta "Despacito"?',
        answer: 'Luis Fonsi',
        difficulty: 'easy',
        funFact: 'Fue la canción más vista en YouTube por varios años'
      },
      {
        id: 'mus_easy_5',
        category: 'musica',
        question: '¿Qué instrumento toca principalmente un baterista?',
        answer: 'Batería',
        difficulty: 'easy',
        funFact: 'La batería moderna se desarrolló a principios del siglo XX'
      },
      {
        id: 'mus_easy_6',
        category: 'musica',
        question: '¿Quién es conocido como el "Rey del Pop"?',
        answer: 'Michael Jackson',
        difficulty: 'easy',
        funFact: 'Su álbum "Thriller" es el más vendido de la historia'
      },
      {
        id: 'mus_easy_7',
        category: 'musica',
        question: '¿Cuántas notas musicales hay?',
        answer: '7 notas (Do, Re, Mi, Fa, Sol, La, Si)',
        difficulty: 'easy',
        funFact: 'Estas notas se repiten en diferentes octavas'
      },
      {
        id: 'mus_easy_8',
        category: 'musica',
        question: '¿Qué artista colombiana canta "Hips Don\'t Lie"?',
        answer: 'Shakira',
        difficulty: 'easy',
        funFact: 'Shakira habla 6 idiomas diferentes'
      },
      {
        id: 'mus_easy_9',
        category: 'musica',
        question: '¿Qué género musical es típico de Jamaica?',
        answer: 'Reggae',
        difficulty: 'easy',
        funFact: 'Bob Marley es el artista de reggae más famoso'
      },
      {
        id: 'mus_easy_10',
        category: 'musica',
        question: '¿Quién canta "Blinding Lights"?',
        answer: 'The Weeknd',
        difficulty: 'easy',
        funFact: 'Fue la canción más popular de 2020'
      },
      {
        id: 'mus_easy_11',
        category: 'musica',
        question: '¿Qué cantante puertorriqueño es conocido como "El Conejo Malo"?',
        answer: 'Bad Bunny',
        difficulty: 'easy',
        funFact: 'Es el artista más escuchado en Spotify'
      },
      {
        id: 'mus_easy_12',
        category: 'musica',
        question: '¿Cuántas cuerdas tiene un violín?',
        answer: '4 cuerdas',
        difficulty: 'easy',
        funFact: 'El violín es el instrumento más agudo de la familia de cuerdas'
      },
      {
        id: 'mus_easy_13',
        category: 'musica',
        question: '¿Qué boy band cantaba "What Makes You Beautiful"?',
        answer: 'One Direction',
        difficulty: 'easy',
        funFact: 'Se formaron en el programa The X Factor en 2010'
      },
      {
        id: 'mus_easy_14',
        category: 'musica',
        question: '¿Quién canta "Someone Like You"?',
        answer: 'Adele',
        difficulty: 'easy',
        funFact: 'Adele ha ganado 15 premios Grammy'
      },
      {
        id: 'mus_easy_15',
        category: 'musica',
        question: '¿Qué instrumento toca principalmente en las orquestas el director?',
        answer: 'Batuta (no toca, dirige)',
        difficulty: 'easy',
        funFact: 'El director coordina a todos los músicos de la orquesta'
      }
    ],
    medium: [
      {
        id: 'mus_med_1',
        category: 'musica',
        question: '¿Cuál es el nombre real de Shakira?',
        answer: 'Shakira Isabel Mebarak Ripoll',
        difficulty: 'medium',
        funFact: 'Shakira habla 6 idiomas'
      },
      {
        id: 'mus_med_2',
        category: 'musica',
        question: '¿En qué década nació el reggaetón?',
        answer: 'Los 90s',
        difficulty: 'medium',
        funFact: 'El reggaetón se originó en Puerto Rico'
      },
      {
        id: 'mus_med_3',
        category: 'musica',
        question: '¿Qué banda británica cantó "Bohemian Rhapsody"?',
        answer: 'Queen',
        difficulty: 'medium',
        funFact: 'La canción dura 5 minutos y 55 segundos'
      },
      {
        id: 'mus_med_4',
        category: 'musica',
        question: '¿En qué año murió Michael Jackson?',
        answer: '2009',
        difficulty: 'medium',
        funFact: 'Murió el 25 de junio, conocido como el día más triste del pop'
      },
      {
        id: 'mus_med_5',
        category: 'musica',
        question: '¿Qué instrumento tocaba Mozart principalmente?',
        answer: 'Piano',
        difficulty: 'medium',
        funFact: 'Mozart compuso más de 600 obras musicales'
      },
      {
        id: 'mus_med_6',
        category: 'musica',
        question: '¿Cuál es el álbum más vendido de todos los tiempos?',
        answer: 'Thriller de Michael Jackson',
        difficulty: 'medium',
        funFact: 'Ha vendido más de 66 millones de copias'
      },
      {
        id: 'mus_med_7',
        category: 'musica',
        question: '¿Qué banda hizo famosa la canción "Stairway to Heaven"?',
        answer: 'Led Zeppelin',
        difficulty: 'medium',
        funFact: 'Es considerada una de las mejores canciones de rock de todos los tiempos'
      },
      {
        id: 'mus_med_8',
        category: 'musica',
        question: '¿En qué ciudad nació el jazz?',
        answer: 'Nueva Orleans',
        difficulty: 'medium',
        funFact: 'El jazz surgió a finales del siglo XIX'
      },
      {
        id: 'mus_med_9',
        category: 'musica',
        question: '¿Quién compuso "La Novena Sinfonía"?',
        answer: 'Ludwig van Beethoven',
        difficulty: 'medium',
        funFact: 'Beethoven estaba completamente sordo cuando la compuso'
      },
      {
        id: 'mus_med_10',
        category: 'musica',
        question: '¿Qué significa MTV?',
        answer: 'Music Television',
        difficulty: 'medium',
        funFact: 'MTV comenzó transmisiones el 1 de agosto de 1981'
      },
      {
        id: 'mus_med_11',
        category: 'musica',
        question: '¿Cuál es el nombre artístico de Stefani Germanotta?',
        answer: 'Lady Gaga',
        difficulty: 'medium',
        funFact: 'Su nombre artístico viene de la canción "Radio Ga Ga" de Queen'
      },
      {
        id: 'mus_med_12',
        category: 'musica',
        question: '¿Qué rapero estadounidense se llama Marshall Mathers?',
        answer: 'Eminem',
        difficulty: 'medium',
        funFact: 'Eminem es el artista que más álbumes ha vendido en la década de 2000'
      },
      {
        id: 'mus_med_13',
        category: 'musica',
        question: '¿En qué festival de música famoso tocó Jimi Hendrix en 1969?',
        answer: 'Woodstock',
        difficulty: 'medium',
        funFact: 'Su interpretación del himno estadounidense se volvió legendaria'
      },
      {
        id: 'mus_med_14',
        category: 'musica',
        question: '¿Qué boy band surcoreana es conocida mundialmente?',
        answer: 'BTS',
        difficulty: 'medium',
        funFact: 'BTS significa "Bangtan Sonyeondan" o "Bulletproof Boy Scouts"'
      },
      {
        id: 'mus_med_15',
        category: 'musica',
        question: '¿Cuál es el nombre real de The Weeknd?',
        answer: 'Abel Tesfaye',
        difficulty: 'medium',
        funFact: 'Eligió "The Weeknd" porque dejó la escuela un fin de semana y nunca regresó'
      }
    ],
    hard: [
      {
        id: 'mus_hard_1',
        category: 'musica',
        question: '¿Qué álbum de Michael Jackson es el más vendido de la historia?',
        answer: 'Thriller (1982)',
        difficulty: 'hard',
        funFact: 'Thriller vendió más de 66 millones de copias'
      },
      {
        id: 'mus_hard_2',
        category: 'musica',
        question: '¿Cómo se llama el primer álbum de Bad Bunny?',
        answer: 'X 100pre',
        difficulty: 'hard',
        funFact: 'Bad Bunny es el artista más escuchado en Spotify'
      },
      {
        id: 'mus_hard_3',
        category: 'musica',
        question: '¿En qué año murió Kurt Cobain?',
        answer: '1994',
        difficulty: 'hard',
        funFact: 'Era el líder de la banda grunge Nirvana'
      },
      {
        id: 'mus_hard_4',
        category: 'musica',
        question: '¿Cuál es el nombre real de Freddie Mercury?',
        answer: 'Farrokh Bulsara',
        difficulty: 'hard',
        funFact: 'Nació en Zanzíbar y tenía ascendencia parsi'
      },
      {
        id: 'mus_hard_5',
        category: 'musica',
        question: '¿Qué banda grabó el álbum "The Dark Side of the Moon"?',
        answer: 'Pink Floyd',
        difficulty: 'hard',
        funFact: 'Estuvo en las listas de Billboard por 14 años consecutivos'
      },
      {
        id: 'mus_hard_6',
        category: 'musica',
        question: '¿En qué año se fundó MTV?',
        answer: '1981',
        difficulty: 'hard',
        funFact: 'Su primer video fue "Video Killed the Radio Star"'
      },
      {
        id: 'mus_hard_7',
        category: 'musica',
        question: '¿Cuál es el verdadero nombre de Elton John?',
        answer: 'Reginald Kenneth Dwight',
        difficulty: 'hard',
        funFact: 'Cambió su nombre legalmente en 1972'
      },
      {
        id: 'mus_hard_8',
        category: 'musica',
        question: '¿Qué compositor escribió "La Flauta Mágica"?',
        answer: 'Wolfgang Amadeus Mozart',
        difficulty: 'hard',
        funFact: 'Fue su penúltima ópera antes de morir'
      },
      {
        id: 'mus_hard_9',
        category: 'musica',
        question: '¿En qué instrumento era virtuoso Paganini?',
        answer: 'Violín',
        difficulty: 'hard',
        funFact: 'Era tan hábil que algunos creían que había pactado con el diablo'
      },
      {
        id: 'mus_hard_10',
        category: 'musica',
        question: '¿Cuál fue la primera canción de los Beatles en llegar al #1 en Estados Unidos?',
        answer: 'I Want to Hold Your Hand',
        difficulty: 'hard',
        funFact: 'Marcó el inicio de la "Beatlemanía" en América'
      },
      {
        id: 'mus_hard_11',
        category: 'musica',
        question: '¿Qué rapero tiene el nombre real de Shawn Carter?',
        answer: 'Jay-Z',
        difficulty: 'hard',
        funFact: 'Es uno de los músicos más ricos del mundo'
      },
      {
        id: 'mus_hard_12',
        category: 'musica',
        question: '¿En qué año se disolvió oficialmente The Beatles?',
        answer: '1970',
        difficulty: 'hard',
        funFact: 'Paul McCartney anunció públicamente su salida en abril de 1970'
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
    throw new Error(`No questions available for ${category} - ${difficulty}`);
  }

  let availableQuestions = categoryQuestions;
  
  // Si se proporciona gameId, usar sistema anti-repetición
  if (gameId) {
    availableQuestions = categoryQuestions.filter(q => !isQuestionUsed(gameId, q.id));
    
    // Si todas las preguntas han sido usadas, reiniciar y usar todas
    if (availableQuestions.length === 0) {
      console.log(`All questions used for ${category}-${difficulty}, resetting...`);
      clearUsedQuestions(gameId);
      availableQuestions = categoryQuestions;
    }
  }

  // Seleccionar pregunta aleatoria
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const selectedQuestion = availableQuestions[randomIndex];

  // Marcar como usada si hay gameId
  if (gameId) {
    markQuestionAsUsed(gameId, selectedQuestion.id);
  }

  return selectedQuestion;
};