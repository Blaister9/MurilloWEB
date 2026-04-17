/**
 * Quiz interactivo: ¿Cuál candidato va con tus ideas?
 * 7 preguntas genuinamente reflexivas, analytics en localStorage (sin backend)
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, RefreshCw, ChevronRight } from 'lucide-react'
import { preguntas, resultados } from '../../data/quizPreguntas'
import { useShare } from '../../hooks/useShare'
import { guardarResultado } from '../../utils/quizAnalytics'

function ProgressBar({ current, total }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
      <motion.div
        className="h-1.5 rounded-full bg-gradient-to-r from-amarillo to-verde"
        initial={{ width: 0 }}
        animate={{ width: `${(current / total) * 100}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

function ResultadoCard({ resultado, onReset, share }) {
  const isLGM = resultado.id === 'lgm'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      className="text-center py-2"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-6xl mb-4"
      >
        {resultado.emoji}
      </motion.div>

      <p className="font-body text-textoSecundario text-sm mb-2">
        Tus respuestas coinciden más con...
      </p>
      <h3
        className="font-display font-bold text-2xl sm:text-3xl mb-4"
        style={{ color: resultado.color }}
      >
        {resultado.nombre}
      </h3>

      <p className="font-body text-textoSecundario text-sm max-w-md mx-auto mb-6 leading-relaxed">
        {resultado.descripcion}
      </p>

      {isLGM && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amarilloClaro border border-yellow-300 rounded-2xl mb-6"
        >
          <span className="text-lg">🏆</span>
          <span className="text-textoPrincipal font-body font-semibold text-sm">
            ¡El candidato independiente es el tuyo!
          </span>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isLGM && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              share({
                title: 'Hice el quiz y mi candidato es Luis Gilberto Murillo 🇨🇴',
                text: `Hice el quiz de candidatos y mis ideas coinciden con Luis Gilberto Murillo. El candidato independiente del Chocó, sin partido, sin escándalos. ¿Y tú? #LGMurillo #Colombia2026`,
              })
            }
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-azulCTA text-white font-body font-bold text-sm shadow-lg"
          >
            <Share2 size={16} />
            📲 Compartir mi resultado
          </motion.button>
        )}

        {resultado.cta && (
          <button
            onClick={() =>
              document.querySelector('#quien-es')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-amarillo text-textoPrincipal font-body font-semibold text-sm"
          >
            {resultado.cta}
            <ChevronRight size={16} />
          </button>
        )}

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-textoSecundario font-body font-semibold text-sm transition-colors"
        >
          <RefreshCw size={14} />
          Volver a intentar
        </button>
      </div>

      {!isLGM && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          <p className="font-semibold mb-1">¿Conoces a Luis Gilberto Murillo?</p>
          <p>
            Aunque tus ideas se acercan más a otro candidato en este quiz,
            te invitamos a revisar su trayectoria y propuestas.
            Puede que encuentres puntos en común que no esperabas.
          </p>
          <a href="#propuestas" className="inline-block mt-2 text-yellow-700 underline font-medium">
            Ver propuestas de LGM →
          </a>
        </div>
      )}
    </motion.div>
  )
}

export default function QuizCandidato() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({}) // { preguntaId: candidatoId }
  const [selectedOption, setSelectedOption] = useState(null)
  const [finished, setFinished] = useState(false)
  const [resultado, setResultado] = useState(null)
  const { share } = useShare()

  function handleSelect(candidatoId) {
    setSelectedOption(candidatoId)
  }

  function handleNext() {
    if (!selectedOption) return

    const pregunta = preguntas[currentQuestion]
    const newAnswers = { ...answers, [pregunta.id]: selectedOption }
    setAnswers(newAnswers)
    setSelectedOption(null)

    if (currentQuestion < preguntas.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Calcular resultado — candidato con más respuestas
      const counts = {}
      Object.values(newAnswers).forEach((candidato) => {
        counts[candidato] = (counts[candidato] || 0) + 1
      })
      const sorted = Object.entries(counts).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]
        if (a[0] === 'lgm') return -1
        if (b[0] === 'lgm') return 1
        return 0
      })
      const winner = sorted[0][0]
      const resultadoFinal = { ...resultados[winner], id: winner }
      setResultado(resultadoFinal)
      setFinished(true)

      // Guardar analytics locales (localStorage, sin backend)
      guardarResultado(newAnswers, winner)
    }
  }

  function handleReset() {
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedOption(null)
    setFinished(false)
    setResultado(null)
  }

  const pregunta = preguntas[currentQuestion]

  return (
    <section id="quiz" className="py-20 px-4 bg-fondo">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            Interactivo
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-textoPrincipal mb-3">
            ¿Cuál candidato va con tus ideas?
          </h2>
          <p className="text-textoSecundario font-body text-sm max-w-md mx-auto">
            {preguntas.length} preguntas sobre temas clave. Sin mencionar nombres hasta el final.
            Responde según tu posición real, no la que crees que debería ser.
          </p>
        </motion.div>

        {/* Card del quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8"
        >
          {!finished ? (
            <div>
              <ProgressBar current={currentQuestion} total={preguntas.length} />

              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-xs text-textoSecundario uppercase tracking-wider">
                  Pregunta {currentQuestion + 1} de {preguntas.length}
                </span>
                <span className="text-xs font-body text-gray-400">
                  {preguntas.length - currentQuestion - 1} restantes
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                >
                  <h3 className="font-display font-semibold text-lg sm:text-xl text-textoPrincipal mb-6 leading-snug">
                    {pregunta.pregunta}
                  </h3>

                  <div className="flex flex-col gap-3 mb-6">
                    {pregunta.opciones.map((opcion, i) => {
                      const isSelected = selectedOption === opcion.candidato
                      return (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(opcion.candidato)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all font-body text-sm leading-snug ${
                            isSelected
                              ? 'border-azulCTA bg-blue-50 text-azulCTA font-semibold shadow-sm'
                              : 'border-gray-200 bg-white text-textoPrincipal hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 transition-all ${
                                isSelected
                                  ? 'border-azulCTA bg-azulCTA text-white'
                                  : 'border-gray-300 text-gray-400'
                              }`}
                            >
                              {isSelected ? '✓' : String.fromCharCode(65 + i)}
                            </span>
                            <span>{opcion.texto}</span>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className={`w-full py-3 rounded-xl font-body font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      selectedOption
                        ? 'bg-textoPrincipal text-white hover:bg-gray-800 shadow-lg cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestion < preguntas.length - 1 ? (
                      <>
                        Siguiente pregunta
                        <ChevronRight size={16} />
                      </>
                    ) : (
                      <>
                        Ver mi resultado
                        <span>🎯</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <ResultadoCard resultado={resultado} onReset={handleReset} share={share} />
          )}
        </motion.div>

        {/* Nota de privacidad */}
        <p className="text-center text-xs text-gray-400 font-body mt-4">
          🔒 El quiz es anónimo. No se recopilan datos personales.
        </p>
      </div>
    </section>
  )
}
