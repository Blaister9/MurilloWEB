import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <p className="text-6xl font-bold text-yellow-500 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-8">Esta URL no existe en el sitio.</p>
      <Link to="/" className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
        Volver al inicio
      </Link>
    </div>
  )
}
