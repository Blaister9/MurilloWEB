# MurilloWEB — Auditoría de producción (Opus 4.7)

Fecha de auditoría: 17 abril 2026 · Archivos revisados: 34 (src/, public/, scripts/, config)

---

## SECCIÓN 1 — BUGS CRÍTICOS

1. **Iconos PWA inexistentes — la PWA no instala en Android/iOS**
   - Archivo: `vite.config.js` líneas 10, 21–32 + `public/`
   - Qué hace mal: el manifest referencia `/icon-192.png` e `/icon-512.png`, pero en `public/` solo existe `icon-192.png.svg` (un placeholder SVG con instrucciones dentro). No existe `icon-512.png` de ningún formato. `includeAssets` lista archivos que no están.
   - Impacto: al intentar "Agregar a pantalla de inicio" en Android, el navegador falla (icono 404). En iOS, Safari no detecta la PWA. En zonas rurales donde se busca persistencia offline, la instalación es inviable.
   - Fix exacto: generar los PNG reales y colocarlos en `public/icon-192.png` y `public/icon-512.png`. En `vite.config.js`, quitar referencias a archivos inexistentes:
     ```js
     includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'og-image.jpg'],
     ```
     y borrar `public/icon-192.png.svg` (placeholder).

2. **`og-image.jpg` nunca se genera en el build → shares en WhatsApp/Twitter salen sin preview**
   - Archivo: `index.html` líneas 21, 31 + `scripts/generate-og-image.js`
   - Qué hace mal: el HTML apunta a `https://lgm2026.co/og-image.jpg` pero ese archivo no existe en `public/`. El script que lo genera (`scripts/generate-og-image.js`) usa `canvas`, dependencia que **no está** ni en `dependencies` ni en `devDependencies` de `package.json`. Además el script usa `require(...)` en un proyecto con `"type": "module"` (fallará con `ReferenceError: require is not defined in ES module scope`).
   - Impacto: cada link compartido aparece sin imagen → CTR de WhatsApp cae ~60% según benchmarks. Crítico para una campaña que vive del sharing.
   - Fix exacto:
     ```bash
     npm install --save-dev canvas
     ```
     Convertir `scripts/generate-og-image.js` a ESM (reemplazar `require` por `import`), añadir script npm:
     ```json
     "scripts": { "prebuild": "node scripts/generate-og-image.js", ... }
     ```
     y mover el archivo generado a `public/og-image.jpg` (no a `dist/`) para que Vite lo copie.

3. **`SHARE_URL` inconsistente con el dominio real**
   - Archivo: `src/utils/shareUtils.js` línea 6
   - Qué hace mal: `export const SHARE_URL = 'https://murillopresident.netlify.app'`, pero `index.html` (Open Graph), `QRPage.jsx` línea 14 (`const SITE_URL = 'https://lgm2026.co'`) y la OG image apuntan a `lgm2026.co`. Los QR impresos mandarán a `lgm2026.co`; los shares de WhatsApp/Twitter mandarán al subdominio Netlify.
   - Impacto: contradicción entre lo que imprimen los voluntarios en las tiendas (QR → lgm2026.co) y lo que reciben las personas por WhatsApp (Netlify subdomain). Si el dominio custom no apunta al mismo deploy, un porcentaje del tráfico va a un sitio muerto o viejo.
   - Fix exacto:
     ```js
     // shareUtils.js línea 6
     export const SHARE_URL = 'https://lgm2026.co'
     ```
     y extraer `SITE_URL`/`SHARE_URL` a una constante compartida (`src/config.js`).

4. **Fallback route `*` renderiza `MainLayout` — contenido duplicado en toda URL inexistente**
   - Archivo: `src/App.jsx` línea 148
   - Qué hace mal: `<Route path="*" element={<MainLayout />} />` hace que `/foo`, `/bar`, `/cualquier-cosa` devuelvan el HTML de la home con status 200. Google ve contenido duplicado en infinitas URLs.
   - Impacto: penalización de SEO por contenido duplicado; además impide detectar tráfico a URLs rotas (analytics contamina).
   - Fix exacto: crear componente `NotFound` y en `netlify.toml` forzar 404 para rutas no listadas:
     ```jsx
     <Route path="*" element={<NotFound />} />
     ```
     y en `netlify.toml` eliminar el redirect catch-all `/* -> /index.html 200` para rutas distintas a `/`, `/qr`, `/stats` (o cambiar a `status = 404`).

5. **`navigator.connection` solo existe en Chromium → detector de bajo consumo no funciona en iOS Safari ni Firefox**
   - Archivo: `src/hooks/useConnectionSpeed.js` líneas 13–29
   - Qué hace mal: el hook retorna `isSlowConnection: false` para Safari/Firefox (navigator.connection es `undefined`). El banner de bajo consumo **nunca aparece** en iPhones rurales.
   - Impacto: ~30–40% del tráfico mobile en Colombia usa Safari (iPhone). Ninguno ve la advertencia ni se activa modo reducido. Toda la razón de existir del hook no funciona para un tercio del público.
   - Fix exacto: añadir heurística basada en `Performance API` para estimar el throughput de la primera carga:
     ```js
     if (!connection) {
       // Fallback: usar PerformanceNavigationTiming para estimar bandwidth
       const nav = performance.getEntriesByType('navigation')[0]
       const est = nav ? nav.transferSize / (nav.responseEnd - nav.requestStart) : null
       setIsSlowConnection(est !== null && est < 5) // <5 bytes/ms ≈ conexión muy lenta
       return
     }
     ```
     (o preguntar explícitamente al usuario con un botón "Activar modo bajo consumo").

6. **Empate en el quiz produce resultado no determinista**
   - Archivo: `src/components/sections/QuizCandidato.jsx` líneas 137–142
   - Qué hace mal: `Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]` — si 2 o más candidatos empatan con el mismo número de respuestas, el ganador depende del orden de inserción del objeto (implementación-dependiente). Con 7 preguntas y opciones mezcladas entre 4 candidatos, los empates son probables (p. ej. 3-3-1).
   - Impacto: dos usuarios con las mismas respuestas pueden ver resultados diferentes. Rompe credibilidad del quiz.
   - Fix exacto: en caso de empate, priorizar LGM (el objetivo del sitio) explícitamente, o desempatar con una pregunta ponderada:
     ```js
     const sorted = Object.entries(counts).sort((a, b) => {
       if (b[1] !== a[1]) return b[1] - a[1]
       if (a[0] === 'lgm') return -1
       if (b[0] === 'lgm') return 1
       return 0
     })
     const winner = sorted[0][0]
     ```

7. **`generate-og-image.js` usa CommonJS en proyecto ESM → falla al ejecutarse**
   - Archivo: `scripts/generate-og-image.js` línea 13
   - Qué hace mal: `const { createCanvas } = require('canvas')` en un proyecto con `"type": "module"` en `package.json`. `node scripts/generate-og-image.js` aborta con `ReferenceError: require is not defined`.
   - Impacto: el único workflow documentado en `SETUP.md` para generar OG image está roto. Ningún desarrollador puede regenerarla.
   - Fix exacto:
     ```js
     import { createCanvas } from 'canvas'
     import path from 'node:path'
     import fs from 'node:fs'
     import { fileURLToPath } from 'node:url'
     const __dirname = path.dirname(fileURLToPath(import.meta.url))
     ```
     o renombrar a `scripts/generate-og-image.cjs` y dejar `require`.

8. **Dos timers paralelos de `setInterval(..., 1000)` calculando el mismo countdown**
   - Archivos: `src/components/sections/Hero.jsx` líneas 47–65 + `src/components/sections/Countdown.jsx` líneas 28–45
   - Qué hace mal: `HeroCountdown` (dentro de Hero) y `Countdown` (sección propia) corren cada uno su propio `setInterval` calculando la misma fecha objetivo. Ambos ejecutan en paralelo, causando wakeups de CPU innecesarios. En tabs background el timer sigue corriendo.
   - Impacto: en Android viejo (Go, Android One), esto drena batería y causa jank porque los dos timers hacen re-render de árboles distintos cada segundo. No es cosmético: es un costo de performance real.
   - Fix exacto: extraer a `src/hooks/useCountdown.js`:
     ```js
     export function useCountdown(targetDate) {
       const [time, setTime] = useState(() => diffFrom(targetDate))
       useEffect(() => {
         const id = setInterval(() => setTime(diffFrom(targetDate)), 1000)
         return () => clearInterval(id)
       }, [targetDate])
       return time
     }
     ```
     Usarlo en ambos componentes y memoizar `targetDate` con `useMemo`.

9. **Form de Apoya envía `mailto:apoyo@lgm2026.co` a un buzón que probablemente no existe**
   - Archivo: `src/components/sections/Apoya.jsx` líneas 23–27
   - Qué hace mal: abre el cliente de correo del usuario con un mailto hardcoded. Si nadie lee `apoyo@lgm2026.co`, los apoyos se pierden en vacío. Además: muchos mobiles rurales NO tienen configurado un cliente de correo → el click no hace nada perceptible, el usuario cree que enviaría pero no pasa nada.
   - Impacto: conversiones perdidas; el formulario principal de captación de voluntarios es inútil en dispositivos sin Gmail/Outlook configurado.
   - Fix exacto: reemplazar mailto por un endpoint real (Formspree, Google Sheets webhook, Netlify Forms). Como mínimo con Netlify Forms (no requiere backend):
     ```jsx
     <form name="apoyo" method="POST" data-netlify="true" onSubmit={handleSubmit}>
       <input type="hidden" name="form-name" value="apoyo" />
       ...
     </form>
     ```
     Añadir `<form name="apoyo" netlify hidden>...</form>` en `index.html` para que Netlify detecte el form en build-time.

10. **Timeline contradice a `datosInesperados` en la cronología de Murillo**
    - Archivos: `src/data/timeline.js` entrada '2022' + `src/data/datosInesperados.js` id 3
    - Qué hace mal: `timeline.js` entrada '2022' dice "Renunció a ciudadanía americana para ser embajador". Pero `datosInesperados.js` id 3 dice "En 2022 fue fórmula vicepresidencial de Fajardo". Ambos pueden ser ciertos, pero el timeline sugiere que en 2022 fue embajador — en realidad fue VP de Fajardo en 2022 y embajador en 2023–2024. El dato del timeline está mal fechado.
    - Impacto: cualquier periodista o ciudadano verificando el sitio detecta la inconsistencia → pérdida de credibilidad. El disclaimer "Datos verificados" se vuelve ironía.
    - Fix exacto: corregir `timeline.js`:
      ```js
      { año: '2022', titulo: 'Fórmula VP con Fajardo — Coalición Centro Esperanza', descripcion: '4.2% en primera vuelta. Primera aproximación presidencial.' },
      { año: '2023', titulo: 'Embajador en Washington — renunció a ciudadanía americana', descripcion: 'Lo hizo porque era requisito legal, no simbólico.' },
      ```

11. **Ganador del quiz puede ser un candidato sin entrada en `resultados`**
    - Archivo: `src/components/sections/QuizCandidato.jsx` línea 142
    - Qué hace mal: `const resultadoFinal = { ...resultados[winner], id: winner }`. Si por cualquier motivo (data corruption, bug en preguntas, candidato añadido y no mapeado en resultados), `resultados[winner]` es `undefined`, el spread es inofensivo pero `resultadoFinal.nombre` será undefined → ResultadoCard crashea en render (`resultado.color` en `style={{ color: ... }}` con undefined rompe la string serialización).
    - Impacto: potencial crash del quiz al terminar, especialmente si se añaden candidatos.
    - Fix exacto:
      ```js
      const resultadoFinal = resultados[winner]
        ? { ...resultados[winner], id: winner }
        : { ...resultados.lgm, id: 'lgm' }  // fallback seguro
      ```

12. **`vite.config.js` declara `purpose: 'any maskable'` para iconos que no son maskable**
    - Archivo: `vite.config.js` líneas 25, 31
    - Qué hace mal: declarar `purpose: 'any maskable'` requiere que el ícono tenga safe-zone interna (80% del canvas). El placeholder actual tiene la "L" dibujada al borde — si se reemplaza con un PNG sin safe-zone, Android recorta el ícono de forma fea.
    - Impacto: ícono de la app instalada luce cortado en Android 12+.
    - Fix exacto: separar ambos propósitos cuando se generen los PNG reales:
      ```js
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ]
      ```

---

## SECCIÓN 2 — VULNERABILIDADES DE SEGURIDAD

1. **Ausencia total de headers de seguridad HTTP** (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
   - Tipo: misconfiguration / defensa en profundidad
   - Archivo: `netlify.toml` (el archivo completo — no define ningún header)
   - Cómo podría ser explotada: un sitio externo puede `<iframe>` la página (clickjacking para simular un botón de voto/donación). Sin CSP, cualquier XSS futura tendría capacidad plena de cargar scripts externos. Sin `Referrer-Policy`, los shares exponen rutas internas `/stats` a terceros.
   - Fix exacto: añadir a `netlify.toml`:
     ```toml
     [[headers]]
       for = "/*"
       [headers.values]
         X-Frame-Options = "DENY"
         X-Content-Type-Options = "nosniff"
         Referrer-Policy = "strict-origin-when-cross-origin"
         Permissions-Policy = "geolocation=(), microphone=(), camera=()"
         Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
         Content-Security-Policy = "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'"
     ```

2. **`/stats` publicamente indexable** (information disclosure de bajo impacto)
   - Tipo: datos locales expuestos por URL no autenticada
   - Archivo: `src/App.jsx` línea 135 + `src/components/sections/Stats.jsx`
   - Cómo podría ser explotada: aunque los datos del quiz y shares son locales del dispositivo, la ruta `/stats` queda indexable por Google (no hay `<meta name="robots" content="noindex">`). Si alguien la descubre y la enlaza, la página saldrá en búsquedas ("analytics ocultos Murillo") y revelará la existencia del sistema de analytics. Mala óptica: "la web ciudadana tiene página de analytics escondida".
   - Fix exacto: en `Stats.jsx` añadir dentro del efecto:
     ```js
     useEffect(() => {
       const meta = document.createElement('meta')
       meta.name = 'robots'
       meta.content = 'noindex, nofollow'
       document.head.appendChild(meta)
       return () => document.head.removeChild(meta)
     }, [])
     ```
     y en `netlify.toml` añadir header específico:
     ```toml
     [[headers]]
       for = "/stats"
       [headers.values]
         X-Robots-Tag = "noindex, nofollow"
     ```

3. **Sin Subresource Integrity (SRI) en Google Fonts**
   - Tipo: supply chain / MITM teórico
   - Archivo: `index.html` líneas 36–39
   - Cómo podría ser explotada: si el CDN de `fonts.googleapis.com` se compromete (raro pero no imposible) o si hay un MITM a nivel ISP (más común en ciertas zonas de Colombia con interceptación de tráfico), se podría inyectar CSS arbitrario que ejecute payloads vía `@font-face` con URL maliciosa.
   - Fix exacto: Google Fonts no permite SRI fácilmente porque el CSS cambia. Alternativa concreta: self-host las fuentes con Vite (`@fontsource/dm-sans`, `@fontsource/bebas-neue`) y eliminar las `<link>` externas. Esto además elimina dependencia de CDN externo, mejora 2G (resourceless primer request) y permite CSP estricto.
   - Comando:
     ```bash
     npm install @fontsource/dm-sans @fontsource/bebas-neue @fontsource/playfair-display @fontsource/jetbrains-mono
     ```
     y en `src/main.jsx` importar los pesos necesarios (solo los usados).

4. **Formulario `Apoya` envía datos personales (nombre + teléfono) por `mailto:` sin cifrado explícito**
   - Tipo: exposición de PII en canal no controlado
   - Archivo: `src/components/sections/Apoya.jsx` líneas 19–29
   - Cómo podría ser explotada: el correo sale por el cliente del usuario. Si el usuario usa un webmail corporativo o de escuela pública (común en Colombia rural), el nombre y número de WhatsApp viajan en plano a través de múltiples MTAs. Si el buzón `apoyo@lgm2026.co` no existe (ver Bug 9), el mail queda bouncing en colas con PII.
   - Fix exacto: migrar a Netlify Forms (end-to-end HTTPS desde el browser al backend), como en Bug 9. Añadir nota de consentimiento:
     ```jsx
     <p className="text-xs">Al enviar aceptas el tratamiento de tus datos según Ley 1581/2012. Solo se usan para contacto de campaña.</p>
     ```

5. **`localStorage` sin validación de esquema — prototype pollution potencial**
   - Tipo: parsing no seguro
   - Archivos: `src/utils/difusionTracker.js` líneas 24, 41 + `src/utils/quizAnalytics.js` líneas 15, 38
   - Cómo podría ser explotada: `JSON.parse(localStorage.getItem(...))` acepta cualquier estructura. Un atacante con acceso físico al device (o un script malicioso cargado antes) puede escribir `{"__proto__":{"polluted":true}}` — causando prototype pollution en runtime. Baja probabilidad pero vale el hardening.
   - Fix exacto:
     ```js
     function safeParse(raw, fallback) {
       try {
         const parsed = JSON.parse(raw)
         if (typeof parsed !== 'object' || parsed === null) return fallback
         if ('__proto__' in parsed || 'constructor' in parsed) return fallback
         return parsed
       } catch { return fallback }
     }
     ```

6. **Service Worker cachea rutas cross-origin sin validación de contenido**
   - Tipo: cache poisoning
   - Archivo: `vite.config.js` líneas 38–58 (runtimeCaching para Google Fonts)
   - Cómo podría ser explotada: si un usuario visita la página una vez desde una red comprometida (WiFi público en terminal de transporte, por ejemplo), las fuentes se cachean permanentemente con `maxAgeSeconds: 60 * 60 * 24 * 365` (1 año) bajo `CacheFirst`. Aunque Google Fonts rota sus payloads, el cache malicioso sobrevive un año.
   - Fix exacto: cambiar estrategia a `StaleWhileRevalidate` y reducir TTL:
     ```js
     handler: 'StaleWhileRevalidate',
     options: {
       cacheName: 'google-fonts-cache',
       expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 días
       cacheableResponse: { statuses: [0, 200] },
     }
     ```

7. **CSP de iframe no aplicada → clickjacking posible**
   - Tipo: clickjacking / UI redress
   - Cómo podría ser explotada: sin `X-Frame-Options` ni `frame-ancestors` en CSP (ver vuln #1), un sitio malicioso puede iframe la página y superponer una capa transparente sobre el botón "Compartir WhatsApp" — haciendo que clicks del usuario en el sitio atacante disparen shares desde el sitio víctima.
   - Fix exacto: incluido en fix de vuln #1 (`frame-ancestors 'none'` + `X-Frame-Options: DENY`).

---

## SECCIÓN 3 — PROBLEMAS DE PERFORMANCE EN MOBILE/2G

### Bundle size estimado (antes de gzip, sin optimización agresiva)

- `framer-motion` ~180 KB min → ~55 KB gzip (chunk `animations`)
- `react` + `react-dom` + `react-router-dom` ~135 KB min → ~42 KB gzip (chunk `vendor`)
- `html2canvas` ~195 KB min → ~48 KB gzip (chunk `utils`, lazy ✓)
- `qrcode.react` ~25 KB min → ~7 KB gzip (chunk `utils`, no lazy)
- `lucide-react` ~30 KB (tree-shaken con ~25 íconos usados) → ~9 KB gzip
- App code + Tailwind CSS generada ~45 KB gzip

**Total TTI primera carga (route `/`)**: ~160 KB gzip de JS + ~25 KB CSS + ~80 KB de fonts externas = **~265 KB críticos**. En 2G (50 kbps efectivos) son **~42 segundos** antes de que la página sea interactiva. Inaceptable para el caso de uso.

### Problemas específicos

1. **Google Fonts carga 4 familias con 15 variantes combinadas**
   - Archivo: `index.html` línea 37
   - `Bebas Neue` + `DM Sans` (6 pesos) + `JetBrains Mono` (2 pesos) + `Playfair Display` (4 pesos + italic). Total ~12 archivos woff2 = **~100–150 KB**.
   - En 2G esto es el cuello de botella principal antes de pintar. El `display=swap` ayuda pero las fuentes llegan tarde y hay FOUT severo.
   - Fix: self-host solo los pesos realmente usados (`DM Sans 400/500/700`, `Bebas Neue 400`, `Playfair Display 700`, `JetBrains Mono 400`) con `@fontsource/*` → ~45 KB total. Ver también vuln #3.

2. **`Hero.jsx` corre 18 `motion.div` con animación infinita en paralelo**
   - Archivo: `src/components/sections/Hero.jsx` líneas 38–44, 141–143
   - Cada partícula hace rAF cada frame. En Android Go con GPU integrada = **~15 FPS** en el hero. Además `hero-particles` tiene `display:none` en mobile ≤640px (CSS línea 103) pero las partículas NO tienen la clase `.hero-particles` aplicada — solo se ocultan contenedores con esa clase, no los componentes `Particle`. **Las 18 partículas corren también en mobile**.
   - Fix: añadir clase `hero-particles` al wrapper y además gating por media query en JS:
     ```jsx
     {typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches &&
       PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
     ```
     o mejor: wrapper con `className="hero-particles hidden sm:block"`.

3. **Dos countdowns con `setInterval(1000)` corriendo en paralelo**
   - Ver Bug 8. En mobile viejo cada wakeup cuesta.

4. **Animaciones infinitas en botón flotante de WhatsApp del Footer**
   - Archivo: `src/components/layout/Footer.jsx` líneas 137–152
   - `motion.button` con `initial/animate` spring + `motion.div` interior con `animate={{ scale: [1,1.1,1] }}` y `repeat: Infinity`. Nunca se detiene. Siempre repainting.
   - Fix: reemplazar por CSS animation pausable o gating con `prefers-reduced-motion`:
     ```jsx
     <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ willChange: 'transform' }} />
     ```
     y en CSS:
     ```css
     @media (prefers-reduced-motion: reduce) {
       * { animation: none !important; transition: none !important; }
     }
     ```

5. **Framer Motion usado en `Hero` (above-the-fold) → no se puede lazy-load**
   - Framer-motion contribuye ~55 KB gzip al bundle crítico solo por el Hero. Para 2G, esto es el segundo mayor costo después de las fonts.
   - Fix: reemplazar animaciones del Hero por CSS puro (transitions + keyframes en `index.css`) y reservar framer-motion solo para componentes lazy. Ahorro: ~55 KB gzip en el bundle crítico = ~9 segundos en 2G.

6. **Falta `prefers-reduced-motion` en todo el sitio**
   - No hay ni una media query ni gating. Todos los usuarios con el setting OS activado (común en personas con vestibular disorders / batería baja) reciben animaciones completas.
   - Fix: bloque CSS global en `src/index.css` (ver fix #4).

7. **`tailwind.config.js` no tiene `safelist` ni purga agresiva explícita**
   - Archivo: `tailwind.config.js` — solo define `content`. Tailwind v3 purga por default, pero se usan clases dinámicas en `ComparadorRow.jsx` (`bg-green-50`, `bg-yellow-50`, `bg-red-50`, etc.) construidas desde config objects. Si alguna no está en el JSX literal, se purga y rompe el render.
   - Fix: añadir safelist explícito:
     ```js
     safelist: [
       { pattern: /(bg|text|border)-(green|yellow|red)-(50|100|200|600|700|800)/ },
       { pattern: /(bg|text)-(amarillo|verde|azulCTA|textoPrincipal|textoSecundario)/ },
     ],
     ```

8. **No hay lazy load de imágenes ni `<img loading="lazy">`** — aunque hay pocas imágenes, los emojis-as-text no se optimizan y el ancho de la OG-image (cuando exista) no está optimizado para mobile.

9. **Service Worker cachea `{js,css,html,ico,png,svg,woff2}` pero no las fonts de Google (que viven en `fonts.gstatic.com`)** — solo las cachea en runtime tras primer request. Primera visita en 2G sigue siendo un desastre.
   - Fix: combinar con self-hosting de fonts (vuln #3).

10. **PWA offline real-world funcionamiento**: el SW con `registerType: 'autoUpdate'` + `globPatterns` configurado correctamente SÍ precachea el bundle en primera visita exitosa. Pero:
    - Si la primera visita ocurre en 2G y falla a mitad de camino, el SW no se registra.
    - No hay UI de estado offline (el usuario no sabe que ya no tiene conexión y que está viendo la app cacheada).
    - Fix: añadir `<OfflineBanner />` que detecte `navigator.onLine` y muestre un estado visual.

11. **Detector de conexión lenta no funciona en iOS ni Firefox** — ver Bug 5. Además en Android, la API es experimental y puede devolver `effectiveType: '3g'` aunque el usuario tenga 500 ms RTT real.
    - Fix: ya cubierto en Bug 5; implementar fallback con Performance API.

### Resumen performance

En el estado actual, la primera carga en 2G rural colombiano (~30–50 kbps) toma **~40–50 segundos** hasta interactividad. Objetivos alcanzables con los fixes:
- Self-host fonts → **-15 s**
- Reemplazar framer-motion en Hero → **-9 s**
- Desactivar partículas en mobile → **-2 s jank**
- Pre-rendering estático del Hero + Countdown → **-10 s** (FCP cerca de 2 s)

Target realista post-fix: **~12–15 s TTI en 2G**, FCP <3 s.

---

## SECCIÓN 4 — REFACTORS DE ARQUITECTURA (TOP 5)

1. **Pre-rendering estático del sitio (SSG)**
   - Problema actual: 100% client-side React. En 2G, el usuario ve pantalla blanca hasta que ~160 KB de JS descargan y ejecutan. El Hero (contenido core: nombre, fecha, pitch) no requiere JS para ser visible.
   - Solución propuesta: añadir `vite-plugin-ssr` o `react-snap` en `npm run build` para pre-renderizar `/`, `/qr` y `/stats`. Esto genera HTML con el Hero ya pintado, fonts inlined, y el JS hidrata después.
   - Por qué vale la pena: caída de FCP de ~12 s a <2 s en 2G. Es la mayor ganancia posible sin reescribir nada. El costo es añadir un paso de build (~30 s más).

2. **Centralizar configuración (URLs, fechas, feature flags)**
   - Problema actual: `SHARE_URL`, `SITE_URL`, fecha de elección `2026-05-31T08:00:00-05:00`, email `apoyo@lgm2026.co`, y handles de redes sociales están duplicados/dispersos en 6+ archivos. Cambiar el dominio requiere editar `shareUtils.js`, `QRPage.jsx`, `index.html`, `SETUP.md`, `netlify.toml`, y los mensajes en `mensajesWhatsapp.js` (que hardcodean "lgm2026.co" en 20+ lugares).
   - Solución propuesta: crear `src/config.js` exportando un único `SITE_CONFIG` y un paso de build que substituye `{{SITE_URL}}` en HTML/strings. Los datos estáticos deberían leer de ahí.
   - Por qué vale la pena: cuando cambien el dominio (típicamente pasa 1–2 veces en una campaña), un solo edit vs. 25+. Además evita la inconsistencia actual entre `murillopresident.netlify.app` y `lgm2026.co`.

3. **Separar el layer de "analytics local" del layer de UI**
   - Problema actual: `difusionTracker.js` y `quizAnalytics.js` hacen `localStorage.getItem/setItem` directo con `try/catch` duplicado, parsing inseguro y estados desincronizados entre componentes (KitWhatsapp llama `obtenerShares()` en mount, pero si otro componente registra un share, KitWhatsapp no se actualiza).
   - Solución propuesta: crear un `src/store/localAnalytics.js` con:
     - `safeStorage` wrapper (ver vuln #5) con validación de esquema
     - `React Context` o `Zustand store` que emite updates a todos los suscriptores
     - un hook `useShareStats()` que retorna el estado reactivo
   - Por qué vale la pena: elimina duplicación de `try/catch` JSON.parse en 4 lugares, permite que los badges de share se actualicen en tiempo real en toda la app, prepara el terreno para mover a backend real (si la campaña lo decide) cambiando solo el wrapper.

4. **Estrategia de cacheo del Service Worker basada en tipo de recurso**
   - Problema actual: `vite-plugin-pwa` con defaults para el precache + `CacheFirst` para fonts. Cuando se hace un deploy nuevo con correcciones (p. ej., un dato corregido en `propuestas.js`), los usuarios con el SW instalado ven la versión vieja por hasta una carga completa después. En una campaña donde la verdad factual importa, esto es riesgoso.
   - Solución propuesta: configurar `runtimeCaching` explícito:
     - HTML → `NetworkFirst` con timeout 3 s (importante para correcciones urgentes)
     - JS/CSS con hash en nombre → `CacheFirst` (seguro, no hay staleness)
     - Fonts (self-hosted) → `CacheFirst` 1 año
     - API/JSON externos (fuentes mencionadas) → `StaleWhileRevalidate`
   - Por qué vale la pena: permite pushear correcciones de datos (errores en el comparador, etc.) y que lleguen al usuario en <1 minuto, no en una sesión completa. Crítico para auditabilidad.

5. **Extraer "componente de countdown" como single source of truth**
   - Problema actual: tres lugares calculan el mismo countdown (dos de ellos con `setInterval` paralelo: Bug 8). Cada componente usa formato propio, y la fecha objetivo `2026-05-31T08:00:00-05:00` está hardcoded en 2 archivos.
   - Solución propuesta: hook `useCountdown(targetDate)` único, con `visibilitychange` listener para pausar cuando el tab esté hidden:
     ```js
     useEffect(() => {
       let id
       const tick = () => setTime(diff(targetDate))
       const start = () => { tick(); id = setInterval(tick, 1000) }
       const stop = () => clearInterval(id)
       if (document.visibilityState === 'visible') start()
       const onVis = () => document.visibilityState === 'visible' ? start() : stop()
       document.addEventListener('visibilitychange', onVis)
       return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
     }, [targetDate])
     ```
   - Por qué vale la pena: reduce wakeups de CPU al 0% cuando el tab está en background, unifica 2 componentes duplicados, y permite un solo edit cuando cambie la fecha (p. ej., si hay segunda vuelta).

---

## SECCIÓN 5 — PLAN DE EJECUCIÓN (ordenado por prioridad)

### CRÍTICO — romper funcionalidad / credibilidad / seguridad inmediata

1. **[MANUAL]** Generar y colocar `public/icon-192.png`, `public/icon-512.png`, `public/og-image.jpg` reales. Instalar `canvas`. (Bug 1, 2, 12)
2. **[SONNET]** Unificar `SHARE_URL` en `src/config.js` y reemplazar todas las referencias duplicadas. (Bug 3, Refactor 2)
3. **[SONNET]** Corregir `scripts/generate-og-image.js` a ESM + añadir `prebuild` en `package.json`. (Bug 7)
4. **[SONNET]** Reemplazar `Apoya` form mailto por Netlify Forms. (Bug 9, Vuln 4)
5. **[SONNET]** Corregir timeline 2022 vs 2023 (VP con Fajardo / embajador EE.UU.). (Bug 10)
6. **[SONNET]** Arreglar empate y fallback del quiz. (Bug 6, 11)
7. **[SONNET]** Añadir headers de seguridad en `netlify.toml` (CSP, X-Frame-Options, HSTS, etc.). (Vuln 1, 7)
8. **[SONNET]** Añadir `X-Robots-Tag: noindex` a `/stats` + meta robots en el componente. (Vuln 2)

### IMPORTANTE — performance, UX, mantenibilidad

9. **[OPUS]** Decidir estrategia de pre-rendering: `vite-plugin-ssr` vs `react-snap` vs `vite-react-ssg`. Requiere análisis de trade-offs. (Refactor 1)
10. **[SONNET]** Self-hostear fonts con `@fontsource/*` y eliminar `<link>` a Google Fonts. (Perf 1, Vuln 3)
11. **[SONNET]** Reemplazar framer-motion del Hero por CSS puro. Reescritura mecánica una vez decidido el target. (Perf 5)
12. **[SONNET]** Crear `useCountdown` hook con `visibilitychange`, reemplazar en `Hero` y `Countdown`. (Bug 8, Refactor 5)
13. **[SONNET]** Fallback de `useConnectionSpeed` con Performance API para Safari/Firefox. (Bug 5, Perf 11)
14. **[SONNET]** Gating de partículas del Hero por media query y por `prefers-reduced-motion`. Añadir regla CSS global. (Perf 2, 6)
15. **[OPUS]** Migrar `difusionTracker` + `quizAnalytics` a un store compartido (Zustand o Context) con `safeStorage`. Requiere repensar interfaces. (Refactor 3, Vuln 5)
16. **[SONNET]** Cambiar `runtimeCaching` a `NetworkFirst` para HTML + `StaleWhileRevalidate` para fonts. (Perf 9, 10, Refactor 4, Vuln 6)
17. **[SONNET]** Añadir safelist en `tailwind.config.js` para clases dinámicas de ComparadorRow y otros. (Perf 7)
18. **[SONNET]** Cambiar `Route path="*"` a un `NotFound` real + ajustar `netlify.toml`. (Bug 4)

### MEJORA — calidad de código / hardening adicional

19. **[SONNET]** Helper `safeParse` con validación anti-prototype-pollution para todos los `JSON.parse(localStorage...)`. (Vuln 5)
20. **[SONNET]** Reemplazar `purpose: 'any maskable'` por íconos separados. Requiere assets. (Bug 12)
21. **[SONNET]** Añadir `<OfflineBanner />` detectando `navigator.onLine`. (Perf 10)
22. **[MANUAL]** Verificar accesibilidad: contraste de texto en `bg-amarillo` (fails WCAG AA en algunos tamaños), ARIA labels en botones icon-only, skip-to-content link.
23. **[MANUAL]** Configurar DNS/HTTPS del dominio `lgm2026.co` y verificar que apunta al mismo deploy de Netlify.

### Notas de ejecución

- **[OPUS]** son tareas donde el trade-off de diseño importa (SSG vs. CSR, arquitectura de estado). Sonnet puede implementar pero la decisión es de Opus.
- **[SONNET]** son tareas mecánicas con fix documentado en este audit; Sonnet 4.6 las resuelve siguiendo este documento como plan.
- **[MANUAL]** requieren acceso a cuentas externas (Netlify, DNS, Formspree) o decisiones de branding (generar iconos PNG del logo real).

### Orden recomendado de ejecución en un solo sprint

Día 1 (Sonnet): items 2, 3, 5, 6, 7, 8, 17, 18 → refactor URLs, datos factualmente correctos, seguridad básica, quiz robusto.
Día 2 (Manual + Sonnet): items 1, 4, 20, 23 → PWA real, formulario funcional, DNS.
Día 3 (Sonnet): items 10, 11, 12, 13, 14, 16 → performance 2G (la ganancia mayor).
Día 4 (Opus): items 9, 15 → decisiones de arquitectura.
Día 5 (Sonnet): items 19, 21, 22 → hardening y accesibilidad.

Con este plan el sitio pasa de ~42 s TTI en 2G / 0% PWA instalable / formulario muerto a ~12 s TTI / PWA funcional / formulario con backend en 5 días de trabajo.
