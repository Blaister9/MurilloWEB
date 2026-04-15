/**
 * App.jsx v3 — MurilloWEB
 * - React Router: "/" principal | "/qr" para impresión | "/stats" analytics oculto
 * - Banner ciudadano y modo bajo consumo
 * - DatosInesperados entre Comparador y TarjetasShare (nuevo en v3)
 * - KitWhatsapp entre Apoya y Footer
 * - Lazy loading para todas las secciones below-the-fold
 */
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Countdown from './components/sections/Countdown'
import { CitizenBanner, LowBandwidthBanner } from './components/ui/LowBandwidthBanner'
import { useConnectionSpeed } from './hooks/useConnectionSpeed'

// Lazy loading para secciones below-the-fold
const QuienEs         = lazy(() => import('./components/sections/QuienEs'))
const Propuestas      = lazy(() => import('./components/sections/Propuestas'))
const Comparador      = lazy(() => import('./components/sections/Comparador'))
const DatosInesperados= lazy(() => import('./components/sections/DatosInesperados'))
const TarjetasShare   = lazy(() => import('./components/sections/TarjetasShare'))
const QuizCandidato   = lazy(() => import('./components/sections/QuizCandidato'))
const Apoya           = lazy(() => import('./components/sections/Apoya'))
const KitWhatsapp     = lazy(() => import('./components/sections/KitWhatsapp'))
const QRPage          = lazy(() => import('./components/sections/QRPage'))
const Stats           = lazy(() => import('./components/sections/Stats'))

// Skeleton genérico de carga
function SectionSkeleton() {
  return (
    <div className="py-20 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="h-7 bg-gray-200 rounded-xl animate-pulse mb-4 w-1/3 mx-auto" />
        <div className="h-4 bg-gray-100 rounded-xl animate-pulse mb-2 w-2/3 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Layout principal del sitio
function MainLayout() {
  const { isSlowConnection } = useConnectionSpeed()

  return (
    <div className="min-h-screen bg-fondo">
      {/* Banner "iniciativa ciudadana" — siempre visible, descartable */}
      <CitizenBanner />

      {/* Banner de modo bajo consumo — solo aparece en 2G/slow-2G */}
      <LowBandwidthBanner isSlowConnection={isSlowConnection} />

      {/* Navbar fijo */}
      <Navbar />

      {/* Hero — sin lazy (above the fold) */}
      <Hero />

      {/* Contador regresivo */}
      <Countdown />

      {/* Secciones lazy */}
      <Suspense fallback={<SectionSkeleton />}>
        <QuienEs />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Propuestas />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Comparador />
      </Suspense>

      {/* ✨ Nuevo en v3: datos sorprendentes entre Comparador y TarjetasShare */}
      <Suspense fallback={<SectionSkeleton />}>
        <DatosInesperados />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TarjetasShare />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <QuizCandidato />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Apoya />
      </Suspense>

      {/* Kit de difusión para WhatsApp — entre Apoya y Footer */}
      <Suspense fallback={<SectionSkeleton />}>
        <KitWhatsapp />
      </Suspense>

      {/* Footer + botón flotante WhatsApp */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<MainLayout />} />

        {/* Página de QR para impresión física — sin Navbar/Footer propios */}
        <Route
          path="/qr"
          element={
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-amarillo border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-body text-textoSecundario text-sm">Cargando página de QR...</p>
                </div>
              </div>
            }>
              <QRPage />
            </Suspense>
          }
        />

        {/* Página oculta de analytics locales — solo accesible en /stats */}
        <Route
          path="/stats"
          element={
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-amarillo border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Stats />
            </Suspense>
          }
        />

        {/* Fallback para rutas no encontradas */}
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
