/**
 * Página de QR para impresión física
 * Diseñada para pegar en tiendas, juntas de acción comunal, iglesias, mercados
 * Optimizada para impresión en blanco y negro
 *
 * Uso: montar en ruta /qr con React Router
 * URL: lgm2026.co/qr
 */
import { useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Printer, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SITE_CONFIG } from '../../config.js'

const SITE_URL = SITE_CONFIG.url

export default function QRPage() {
  const navigate = useNavigate()

  // Cambiar el título al entrar
  useEffect(() => {
    document.title = 'QR — Luis Gilberto Murillo 2026'
    return () => {
      document.title = 'Luis Gilberto Murillo — La Colombia Olvidada | Candidato Presidencial 2026'
    }
  }, [])

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Barra de control — se oculta al imprimir */}
      <div className="print:hidden bg-fondo border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-textoSecundario hover:text-textoPrincipal transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-textoPrincipal text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Printer size={16} />
          Imprimir
        </button>
      </div>

      {/* Contenido imprimible — centrado en página A4 */}
      <div className="max-w-lg mx-auto px-8 py-10 print:py-6 print:max-w-full print:px-12">

        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <div className="inline-block border-4 border-black px-6 py-2 mb-4">
            <p className="font-impact text-4xl print:text-5xl tracking-widest text-black">
              LGM 2026
            </p>
          </div>
          <h1 className="font-display font-bold text-2xl print:text-3xl text-black leading-tight">
            Luis Gilberto Murillo
          </h1>
          <p className="text-gray-600 text-base print:text-lg mt-1">
            Candidato Presidencial Independiente · 31 de mayo de 2026
          </p>
        </div>

        {/* Instrucción */}
        <div className="bg-gray-100 rounded-2xl print:rounded-none p-5 text-center mb-8 border-2 border-gray-300">
          <p className="text-2xl mb-2">📱</p>
          <p className="font-display font-bold text-xl text-black mb-1">
            Escanea con tu celular
          </p>
          <p className="text-gray-600 text-sm">
            Apunta la cámara al código QR y abre el enlace.
            <br />
            Funciona sin instalar ninguna app.
          </p>
        </div>

        {/* QR grande — el centro visual de la pieza */}
        <div className="flex justify-center mb-8">
          <div className="p-5 border-4 border-black rounded-2xl print:rounded-none bg-white shadow-lg print:shadow-none">
            <QRCodeSVG
              value={SITE_URL}
              size={240}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* URL en texto grande — para quien no puede escanear */}
        <div className="text-center bg-black text-white rounded-2xl print:rounded-none py-4 px-6 mb-8">
          <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-mono">
            O escribe en tu celular:
          </p>
          <p className="font-impact text-3xl print:text-4xl tracking-wider text-white">
            {SITE_URL.replace('https://', '')}
          </p>
        </div>

        {/* Datos clave — sin imagen, puro texto para B&W */}
        <div className="border-2 border-gray-300 rounded-2xl print:rounded-none divide-y divide-gray-200 mb-8">
          {[
            { icon: '✅', text: 'Sin partido político' },
            { icon: '✅', text: 'Sin escándalos de corrupción en 30 años' },
            { icon: '✅', text: '1.2 millones de firmas ciudadanas verificadas' },
            { icon: '🇨🇴', text: 'Nació en Andagoya, Chocó' },
            { icon: '🏛️', text: 'Ex-Gobernador · Ex-Ministro · Ex-Canciller' },
          ].map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3">
              <span className="text-lg print:text-xl flex-shrink-0">{item.icon}</span>
              <span className="text-sm print:text-base text-black font-body">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Call to action secundario */}
        <div className="text-center mb-6">
          <p className="font-display font-bold text-lg text-black mb-1">
            "No soy el candidato de ningún político.
          </p>
          <p className="font-display font-bold text-lg text-black mb-3">
            Soy el candidato de la gente."
          </p>
          <p className="text-gray-500 text-xs font-body">
            — Luis Gilberto Murillo
          </p>
        </div>

        {/* Instrucciones de uso — solo en pantalla */}
        <div className="print:hidden mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm font-body text-blue-800 leading-relaxed">
            <strong>💡 Cómo usar esta página:</strong> Haz clic en "Imprimir" arriba. Imprime
            en blanco y negro en cualquier impresora. Pega el flyer en tiendas, juntas de acción
            comunal, iglesias o mercados. Una URL corta es fácil de recordar y escribir.
          </p>
        </div>

        {/* Footer de transparencia */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 font-body">
            Iniciativa ciudadana independiente · No es la web oficial de la campaña
            <br />
            Datos verificados con fuentes públicas a abril 2026
          </p>
        </div>
      </div>
    </div>
  )
}
