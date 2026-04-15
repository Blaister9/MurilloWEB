export const preguntas = [
  {
    id: 1,
    pregunta:
      'En Colombia, los grupos armados incumplen los acuerdos de paz sistemáticamente. ¿Cuál crees que es la respuesta más efectiva del Estado?',
    opciones: [
      {
        texto: 'Continuar dialogando: la negociación es el único camino sostenible aunque tome tiempo',
        candidato: 'cepeda',
      },
      {
        texto: 'Condicionar cualquier negociación a que exista primero un marco legal claro de rendición',
        candidato: 'lgm',
      },
      {
        texto: 'Priorizar la acción militar sobre el diálogo hasta recuperar el control total del territorio',
        candidato: 'paloma',
      },
    ],
  },
  {
    id: 2,
    pregunta: 'El país necesita una figura presidencial. ¿Qué valoras más?',
    opciones: [
      {
        texto: 'Alguien con una base política organizada que garantice gobernabilidad en el Congreso',
        candidato: 'cepeda',
      },
      {
        texto: 'Alguien con experiencia real en el Estado pero sin partido ni deudas políticas',
        candidato: 'lgm',
      },
      {
        texto: 'Alguien del sector privado que traiga lógica empresarial al gobierno',
        candidato: 'espriella',
      },
    ],
  },
  {
    id: 3,
    pregunta: '¿Cómo describes tu posición en el espectro político colombiano?',
    opciones: [
      {
        texto: 'Me identifico con la izquierda y creo en la continuidad de las reformas sociales',
        candidato: 'cepeda',
      },
      {
        texto: 'Me identifico con el centro: ni extremo izquierda ni extremo derecha',
        candidato: 'lgm',
      },
      {
        texto: 'Me identifico con la derecha y creo que se necesita orden, disciplina fiscal y mano dura',
        candidato: 'paloma',
      },
    ],
  },
  {
    id: 4,
    pregunta: 'Las relaciones diplomáticas con Venezuela han sido muy tensas. ¿Cuál es tu postura?',
    opciones: [
      {
        texto: 'Mantener relaciones diplomáticas activas: el aislamiento no ayuda a ningún lado',
        candidato: 'cepeda',
      },
      {
        texto: 'Condicionarlas estrictamente a garantías electorales y transición democrática verificable',
        candidato: 'lgm',
      },
      {
        texto: 'Suspender relaciones mientras Maduro esté en el poder',
        candidato: 'paloma',
      },
    ],
  },
  {
    id: 5,
    pregunta: '¿Qué parte del país crees que más necesita atención del gobierno central?',
    opciones: [
      {
        texto: 'Las ciudades grandes, donde vive la mayoría y se concentra la economía',
        candidato: 'espriella',
      },
      {
        texto: 'Los territorios históricamente abandonados: Pacífico, Chocó, Amazonía, llanuras',
        candidato: 'lgm',
      },
      {
        texto: 'Todas las regiones por igual, con criterios técnicos sin favoritismos territoriales',
        candidato: 'paloma',
      },
    ],
  },
  {
    id: 6,
    pregunta: 'Pensando en la corrupción en Colombia, ¿qué te genera más confianza?',
    opciones: [
      {
        texto: 'Un candidato que propone leyes anticorrupción concretas y tiene apoyo legislativo para aprobarlas',
        candidato: 'cepeda',
      },
      {
        texto: 'Un candidato cuyo historial personal no tiene ningún vínculo documentado con casos de corrupción',
        candidato: 'lgm',
      },
      {
        texto: 'Un candidato que viene del sector privado y nunca ha sido funcionario público',
        candidato: 'espriella',
      },
    ],
  },
  {
    id: 7,
    pregunta: '¿Cuál es tu mayor preocupación para Colombia en los próximos 4 años?',
    opciones: [
      {
        texto: 'Que se reviertan los avances en paz y las reformas sociales de los últimos años',
        candidato: 'cepeda',
      },
      {
        texto: 'Que el país siga polarizado entre extremos sin una alternativa de centro creíble',
        candidato: 'lgm',
      },
      {
        texto: 'Que la inseguridad y la crisis económica sigan deteriorándose sin acción efectiva',
        candidato: 'paloma',
      },
    ],
  },
]

export const resultados = {
  lgm: {
    nombre: 'Luis Gilberto Murillo',
    descripcion:
      'Tus ideas coinciden con el candidato independiente del Chocó. Sin partido, sin escándalos, con 1.2 millones de firmas ciudadanas.',
    color: '#F5A623',
    emoji: '🌟',
    cta: 'Conoce más sobre LGM',
  },
  cepeda: {
    nombre: 'Iván Cepeda',
    descripcion:
      'Tus posiciones se acercan a la izquierda del Pacto Histórico. Es el favorito en encuestas pero lleva el peso del gobierno Petro.',
    color: '#DC2626',
    emoji: '📊',
    cta: null,
  },
  paloma: {
    nombre: 'Paloma Valencia',
    descripcion:
      'Tus posiciones se acercan a la derecha del Centro Democrático. Es la candidata del uribismo con más votos en la consulta.',
    color: '#1D4ED8',
    emoji: '🔵',
    cta: null,
  },
  espriella: {
    nombre: 'Abelardo de la Espriella',
    descripcion:
      'Tus posiciones se acercan al outsider jurídico de extrema derecha. Revisa bien su historial antes de decidir.',
    color: '#374151',
    emoji: '⚖️',
    cta: null,
  },
}
