export const candidatos = [
  { id: 'lgm', nombre: 'Luis Gilberto Murillo', partido: 'Independiente (firmas)', color: '#F5A623' },
  { id: 'cepeda', nombre: 'Iván Cepeda', partido: 'Pacto Histórico', color: '#DC2626' },
  { id: 'paloma', nombre: 'Paloma Valencia', partido: 'Centro Democrático', color: '#1D4ED8' },
  { id: 'espriella', nombre: 'A. de la Espriella', partido: 'Defensores de la Patria', color: '#374151' },
]

export const criterios = [
  {
    id: 'procesos',
    label: 'Procesos penales propios',
    fuente: 'Fiscalía General, registros públicos',
    valores: {
      lgm: { tipo: 'bien', texto: 'Ninguno documentado' },
      cepeda: {
        tipo: 'bien',
        texto: 'Ninguno — Uribe lo denunció, Corte Suprema archivó y abrió caso contra Uribe',
      },
      paloma: { tipo: 'bien', texto: 'Ninguno propio' },
      espriella: {
        tipo: 'neutral',
        texto: 'Investigado por parapolítica y vínculos (exonerado en casos principales)',
      },
    },
  },
  {
    id: 'vinculos',
    label: 'Vínculos documentados con actores ilegales',
    fuente: 'Fiscalía, Corte Suprema, medios verificados',
    valores: {
      lgm: { tipo: 'bien', texto: 'Ninguno relevante documentado' },
      cepeda: {
        tipo: 'neutral',
        texto: 'Mencionado en computadores Raúl Reyes — sin imputación ni proceso',
      },
      paloma: {
        tipo: 'neutral',
        texto: 'Partido sí tiene casos de parapolítica — ella personalmente no',
      },
      espriella: {
        tipo: 'mal',
        texto: 'Alex Saab (2013-2019), DMG Grupo ($760M en lobby según Fiscalía), Diego Cadena',
      },
    },
  },
  {
    id: 'independencia',
    label: 'Independencia política real',
    fuente: 'Registraduría Nacional, declaraciones públicas',
    valores: {
      lgm: {
        tipo: 'bien',
        texto: 'Total. Financiado solo por firmas ciudadanas. Sin aval de partido.',
      },
      cepeda: {
        tipo: 'mal',
        texto: 'Candidato oficial del Pacto Histórico. Respaldado por Petro.',
      },
      paloma: {
        tipo: 'mal',
        texto: 'Candidata del Centro Democrático. Acompañó a Uribe a votar en la consulta.',
      },
      espriella: {
        tipo: 'neutral',
        texto: 'Se presenta como outsider pero tiene vínculos históricos con el uribismo.',
      },
    },
  },
  {
    id: 'experiencia',
    label: 'Experiencia en el Estado',
    fuente: 'Hojas de vida públicas',
    valores: {
      lgm: {
        tipo: 'bien',
        texto: 'Gobernador del Chocó · Ministro de Ambiente · Embajador en EE.UU. · Canciller',
      },
      cepeda: { tipo: 'bien', texto: 'Representante a la Cámara (2010) · Senador desde 2014' },
      paloma: { tipo: 'bien', texto: 'Senadora del Centro Democrático' },
      espriella: { tipo: 'mal', texto: 'Ningún cargo público. Solo ejercicio privado del derecho.' },
    },
  },
  {
    id: 'anticorrupcion',
    label: 'Coherencia anticorrupción',
    fuente: 'Declaraciones públicas verificadas, El Tiempo, El Espectador, abril 2026',
    valores: {
      lgm: {
        tipo: 'bien',
        texto: 'Alta. Sin contradicciones documentadas entre discurso y trayectoria.',
      },
      cepeda: {
        tipo: 'mal',
        texto:
          'Propone anticorrupción pero guarda silencio ante 24 escándalos del gobierno Petro, incluidos 2 ministros en la cárcel.',
      },
      paloma: { tipo: 'bien', texto: 'Coherente con su línea política.' },
      espriella: {
        tipo: 'mal',
        texto:
          'Dice nunca haber contratado con el Estado — SECOP muestra contrato por $600M con Fondo Adaptación (2018).',
      },
    },
  },
  {
    id: 'regiones',
    label: 'Representación de regiones olvidadas',
    fuente: 'Biografías públicas verificadas',
    valores: {
      lgm: {
        tipo: 'bien',
        texto: 'Nació en Andagoya, Chocó. Creció en uno de los territorios más olvidados del país.',
      },
      cepeda: {
        tipo: 'neutral',
        texto: 'Bogotá. Exiliado en Europa. Poca presencia en regiones.',
      },
      paloma: {
        tipo: 'neutral',
        texto: 'Bogotá. Vinculada a élite política tradicional.',
      },
      espriella: {
        tipo: 'neutral',
        texto: 'Bogotá / Córdoba. Élite jurídica.',
      },
    },
  },
]
