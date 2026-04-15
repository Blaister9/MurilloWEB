/**
 * Mensajes pre-escritos para difusión por WhatsApp — v3
 * Psicología narrativa: historia personal, honestidad incómoda,
 * pregunta provocadora, dato de contraste.
 * Sin bullet-lists de atributos. Sin "✅".
 */
export const mensajes = [
  {
    id: 1,
    titulo: 'La historia que no sale en televisión',
    emoji: '📖',
    region: 'todas',
    texto: `Hay algo que no sale en los debates televisados.

Luis Gilberto Murillo nació en Andagoya, Chocó — uno de los municipios con mayor pobreza y menor cobertura de servicios en Colombia. Llegó a estudiar geología en Moscú con una beca del Icetex cuando tenía 18 años. No sabía ruso. No tenía familia allá.

Décadas después, cuando el gobierno de EE.UU. le ofreció la ciudadanía americana, la rechazó para poder ser embajador de Colombia. Dijo que no podía servir a su país con pasaporte extranjero.

La gente que lo conoce dice que es el mismo de siempre. No cambió de acento. No cambió de lado.

Si quieres saber más sobre él, esta web lo explica con fuentes verificadas:
lgm2026.co`,
  },
  {
    id: 2,
    titulo: 'Lo que él mismo admite públicamente',
    emoji: '🎙️',
    region: 'todas',
    texto: `Algo poco común en política colombiana: Luis Gilberto Murillo admite públicamente que apoyó el proceso de Paz Total de Petro y que cree que fue un error no negociarlo de otra manera.

No lo está ocultando. Lo dijo en entrevista abierta.

En un país donde los políticos nunca reconocen errores, me parece que eso vale la pena notar.

Tiene 30 años de trayectoria como gobernador, ministro de Ambiente y canciller. En ese tiempo, ninguna investigación penal con condena. Eso tampoco es lo más común.

Si te genera curiosidad, esta web tiene las fuentes de cada cosa que afirma:
lgm2026.co`,
  },
  {
    id: 3,
    titulo: 'Una pregunta para pensar antes del 31 de mayo',
    emoji: '🤔',
    region: 'todas',
    texto: `¿Cuántos candidatos presidenciales en la historia de Colombia llegaron al tarjetón sin partido político, recogiendo firmas de ciudadanos desde cero?

Muy pocos. Luis Gilberto Murillo llegó con más de un millón doscientas mil.

No te estoy diciendo que votes por él. Te estoy preguntando: ¿Cuándo fue la última vez que revisaste las propuestas de los candidatos antes de decidir?

Esta web tiene sus propuestas con la fuente de cada una, para que puedas leer lo que él realmente dijo — no lo que otros dicen que dijo:
lgm2026.co`,
  },
  {
    id: 4,
    titulo: 'Antes de votar, un dato',
    emoji: '📊',
    region: 'todas',
    texto: `Un dato concreto antes del 31 de mayo:

Colombia lleva décadas eligiendo presidentes que vienen de los mismos partidos, las mismas familias políticas, las mismas ciudades. El Chocó nunca ha dado un presidente.

Luis Gilberto Murillo es el primer candidato presidencial nacido en ese departamento con posibilidad real de primera vuelta. Llegó sin partido. Sin financiación de élites. Con firmas ciudadanas.

Puede gustarte o no. Pero si no lo conoces, esta web tiene todo con fuentes verificables:
lgm2026.co`,
  },
]

/**
 * Textos cortos para Estados de WhatsApp (máx 700 caracteres)
 * Se muestran en el tab "Estados WA" del KitWhatsapp
 */
export const estadosWA = [
  {
    id: 1,
    titulo: 'Estado: Historia',
    texto: `¿Sabías que hay un candidato presidencial colombiano que rechazó la ciudadanía americana para poder servir a su país? Se llama Luis Gilberto Murillo. Nació en el Chocó. lgm2026.co`,
  },
  {
    id: 2,
    titulo: 'Estado: Pregunta',
    texto: `Antes del 31 de mayo te pregunto algo: ¿Ya leíste las propuestas de todos los candidatos? No las noticias sobre ellos — sus propuestas directas. Aquí las de LGM con fuentes: lgm2026.co`,
  },
  {
    id: 3,
    titulo: 'Estado: Dato',
    texto: `Ningún candidato presidencial nacido en el Chocó ha llegado tan lejos en la historia de Colombia. Luis Gilberto Murillo llegó al tarjetón con más de 1.2M de firmas ciudadanas — sin partido. lgm2026.co`,
  },
]

/**
 * Mensajes regionales — tono adaptado por zona del país
 */
export const mensajesRegionales = {
  pacifico: {
    label: 'Pacífico',
    emoji: '🌊',
    texto: `Para los que vivimos en el Pacífico colombiano:

Luis Gilberto Murillo nació en Andagoya, Chocó. Creció en un territorio donde el Estado llega tarde y mal — igual que en muchos municipios del Pacífico.

Propone conectividad, agua potable y presencia institucional real en las regiones que siempre han quedado por fuera. No como promesa — como parte de su historia de vida.

Mira su propuesta en: lgm2026.co`,
  },
  caribe: {
    label: 'Caribe',
    emoji: '☀️',
    texto: `Para la Costa Caribe:

En la Costa sabemos lo que es que Bogotá decida por nosotros. Luis Gilberto Murillo propone una descentralización real — que los recursos y las decisiones lleguen directamente a los departamentos.

Fue gobernador del Chocó antes de ser ministro y canciller. Conoce lo que es gestionar desde la periferia, no desde el centro.

Más información: lgm2026.co`,
  },
  andina: {
    label: 'Zona Andina',
    emoji: '⛰️',
    texto: `Para la región Andina:

Colombia no es solo Bogotá, Medellín y Cali. Luis Gilberto Murillo lleva su campaña a municipios que raramente reciben visitas presidenciales.

Propone modernización del Estado, reducción de burocracia y acceso a servicios digitales para todo el territorio. Con fuentes verificadas para cada propuesta.

Más información: lgm2026.co`,
  },
  orinoquia: {
    label: 'Orinoquía / Amazonía',
    emoji: '🌿',
    texto: `Para la Orinoquía y Amazonía:

Luis Gilberto Murillo fue Ministro de Ambiente. Conoce de primera mano los conflictos entre desarrollo económico y conservación en territorios como los nuestros.

Propone economía verde y desarrollo sostenible — no como slogan, sino como política de Estado con modelo concreto.

Conoce más: lgm2026.co`,
  },
  interior: {
    label: 'Interior / Eje Cafetero',
    emoji: '☕',
    texto: `Para el Eje Cafetero y el interior del país:

Somos una región que exige resultados concretos a sus políticos. Luis Gilberto Murillo tiene 30 años de trayectoria en cargos públicos — gobernador, ministro, canciller — sin una investigación penal con condena.

Eso no lo hace perfecto. Pero en Colombia de 2026 sí lo hace inusual.

Lee sus propuestas con fuentes: lgm2026.co`,
  },
}
