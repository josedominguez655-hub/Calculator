# Resurrection Calculator - Trading Recovery & Averaging Down Tool

Una aplicación web progresiva (PWA) de alto rendimiento para calcular estrategias de recuperación ("Resurrection / Averaging Down") en posiciones de trading e inversión bursátil. Permite diluir pérdidas porcentuales calculando con precisión la cantidad de acciones y capital necesarios para alcanzar objetivos como "reducir pérdida al 50%", "reducir pérdida al 25%", "Break-Even (0%)" o porcentajes personalizados.

---

## 🚀 Requisitos previos

- **Node.js**: Versión 18 o superior (recomendado Node 20 LTS)
- **npm** (incluido con Node.js), **pnpm** o **yarn**

---

## 🛠️ Cómo ejecutar el proyecto localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible inmediatamente en `http://localhost:3000`.

3. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Genera los archivos optimizados en la carpeta `/dist/`.

4. **Iniciar en producción:**
   ```bash
   npm start
   ```

---

## 📁 Estructura del proyecto

- `src/`
  - `components/`: Componentes modulares de interfaz (Calculadora, Simulador de Escenarios, Historial, Exportación, Temas, etc.).
  - `context/`: Proveedor de temas (Windows 11 Fluent, Material Design Android, Terminal Pro, Cyberpunk).
  - `utils/calculator.ts`: Motor matemático de cálculo de promedio ponderado y drawdown.
  - `types.ts`: Interfaces TypeScript del modelo de datos.
- `public/`: Iconos PWA de alta resolución (192x192, 512x512, maskable), `manifest.json` y `sw.js` (Service Worker).
- `server.ts`: Servidor backend en Express con soporte para Vite, CORS y compresión.

---

## 📦 Transferir a otro entorno o programa

- **Visual Studio Code / Cursor**: Simplemente abre la carpeta raíz en el editor y corre `npm install && npm run dev`.
- **Hosting / Deploy**: Compatible con Vercel, Netlify, Cloud Run, Docker, AWS, Render o cualquier servidor VPS Node.js.
- **Android APK**: Puedes empaquetar el proyecto usando Capacitor (`npm i @capacitor/core @capacitor/cli`) o subirlo a PWABuilder.
