# MurilloWEB v2 — Instrucciones de instalación

## Pasos para correr el proyecto

### 1. Instalar dependencias
```bash
cd C:\WEBMURILLO_PResidente
npm install
```

Nuevas dependencias en v2:
- `vite-plugin-pwa` — convierte el sitio en PWA (funciona offline)
- `qrcode.react` — genera el QR para impresión en `/qr`

### 2. Correr en desarrollo
```bash
npm run dev
```
Abre http://localhost:5173

Rutas disponibles:
- `/` — sitio principal
- `/qr` — página de QR para imprimir y pegar en municipios

### 3. Build de producción
```bash
npm run build
```
El output queda en `/dist/`

---

## Configuración pendiente antes del deploy

### A. Formspree — analytics del quiz (anónimos)
1. Crea cuenta gratuita en https://formspree.io
2. Crea un nuevo formulario
3. Copia el ID (formato: `xpwqabcd`)
4. En `src/components/sections/QuizCandidato.jsx`, línea 18:
   ```js
   const FORMSPREE_ID = 'TU_FORMSPREE_ID'  // ← reemplaza esto
   ```
   Por ejemplo: `const FORMSPREE_ID = 'xpwqabcd'`

### B. Iconos PWA (para que aparezca "Agregar a inicio" en Android)
Genera los iconos en: https://www.pwabuilder.com/imageGenerator
- Sube una imagen cuadrada del logo LGM
- Descarga `icon-192.png` e `icon-512.png`
- Colócalos en la carpeta `public/`

### C. Dominio corto (crucial para WhatsApp)
Opciones recomendadas:
- `lgm2026.co` — verifica disponibilidad en https://mi.co
- `murillopresidente.co`
- `colombiaolvidada.co`

Una vez desplegado en Netlify, configura el dominio personalizado en:
Netlify → Site settings → Domain management → Add custom domain

Después actualiza la constante en `src/utils/shareUtils.js`:
```js
export const SHARE_URL = 'https://lgm2026.co'  // ← tu dominio real
```

Y en `src/components/sections/QRPage.jsx`:
```js
const SITE_URL = 'https://lgm2026.co'  // ← tu dominio real
```

---

## Pasos finales antes del deploy (v3)

### 1. Instalar dependencia para og-image (solo en dev)
```bash
npm install canvas --save-dev
```

### 2. Generar la og-image
```bash
node scripts/generate-og-image.js
```
Esto genera `public/og-image.jpg` (1200×630px) para WhatsApp y Twitter Card.

### 3. Build de producción
```bash
npm run build
```
Los chunks estarán separados: `vendor`, `animations`, `utils` (ver `vite.config.js`).

---

## Deploy en GitHub + Netlify

```bash
# Primera vez
git init
git add .
git commit -m "feat: MurilloWEB v3 — DatosInesperados, KitWhatsapp rewrite, localStorage analytics, og-image, code splitting"
git remote add origin https://github.com/Blaister9/MurilloWEB.git
git push -u origin main

# Actualización (si ya tienes el repo)
git add .
git commit -m "feat: MurilloWEB v3 production ready"
git push origin main
```

Netlify detecta el push y hace el deploy automáticamente.
- Build command: `npm run build`
- Publish directory: `dist`
- El `netlify.toml` ya está configurado

### D. Analytics ocultos
Navega a `https://lgm2026.co/stats` (no está en el menú) para ver los datos
de quiz y shares guardados en el localStorage de ese navegador.

---

## Resumen de cambios v3

| Cambio | Descripción |
|---|---|
| localStorage quiz | Reemplaza Formspree — cero dependencias externas |
| difusionTracker | Conteo de shares con badge motivacional por nivel |
| KitWhatsapp v3 | Tabs: Mensajes / Estados WA / Por región — sin scripts de audio |
| Mensajes reescritos | Historia personal, honestidad incómoda, pregunta, dato de contraste |
| Personalización tarjetas | Nombre + ciudad + mensaje opcionales en el PNG exportado |
| Datos Inesperados | Nueva sección flip-card — 7 datos sorprendentes entre Comparador y Tarjetas |
| /stats oculto | Analytics locales — quizzes + shares, solo visible si sabes la URL |
| Code splitting | manualChunks en Rollup: vendor / animations / utils |
| og-image generada | Script Node que produce 1200×630 JPG sin CDN externo |
| Dedup contenido | Sin escándalos solo en Comparador, 1.2M firmas solo en Hero |

---

## Resumen de cambios v2

| Cambio | Descripción |
|---|---|
| Fuentes verificadas | Cada propuesta tiene links a medios reales |
| Nota de transparencia | Footer y banner de "iniciativa ciudadana" |
| Carrusel de tarjetas | Reemplaza la grilla plana — swipe, flechas, descarga PNG |
| Quiz mejorado | 7 preguntas genuinamente reflexivas |
| PWA | Funciona offline tras primer cargue |
| Modo bajo consumo | Banner automático en conexiones 2G |
| Kit WhatsApp | 4 mensajes + 3 scripts de nota de voz para zonas rurales |
| Página QR | `/qr` — imprimible en B&W para municipios |

---
Sitio ciudadano independiente · Datos verificados a abril 2026
