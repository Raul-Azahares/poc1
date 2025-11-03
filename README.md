# MediConsult AI

Sistema inteligente de consulta médica con IA, optimizado para Vercel.

## Características

- 🔐 **Autenticación básica** - Login y registro sin verificación de email
- 🤖 **IA Real Opcional (Groq)** - Conversaciones naturales con IA gratuita
- 💬 **Chat médico guiado** - Sistema basado en reglas como fallback
- 📄 **Generación de reportes PDF** - Descarga un informe completo de tu consulta
- 📱 **Diseño moderno y responsive** - UI optimizada para todos los dispositivos
- ⚡ **Optimizado para Vercel** - Despliegue rápido y sin configuración adicional
- 🆓 **100% Gratuito** - Funciona sin APIs o con Groq gratis

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **jsPDF** - Generación de PDFs
- **Lucide React** - Iconos modernos
- **LocalStorage** - Persistencia de datos (sin backend necesario)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## Despliegue en Vercel

1. Sube tu código a GitHub
2. Importa el proyecto en Vercel
3. Vercel detectará automáticamente Next.js
4. Haz clic en "Deploy"

¡Listo! Tu aplicación estará disponible en unos segundos.

## Uso

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Dashboard**: Ve tu historial de consultas
3. **Nueva Consulta**: Haz clic en el botón "+" para iniciar
4. **Chat Médico**: Responde las preguntas del asistente
5. **Descarga PDF**: Al finalizar, descarga tu reporte médico

## 🤖 Activar IA Real (Opcional pero Recomendado)

Por defecto, el sistema usa un sistema basado en reglas (4 preguntas predefinidas). Para activar IA real con Groq:

### Método Rápido (Script Automático):
```bash
./setup-groq.sh
```

### Método Manual:
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Ve a https://console.groq.com y obtén una API Key gratis
3. Agrega esto al archivo:
```bash
NEXT_PUBLIC_GROQ_API_KEY=tu_key_aqui
```
4. Reinicia el servidor: `npm run dev`

📖 Ver guía completa: `SETUP_IA.md` y `HOW_TO_GET_GROQ_API_KEY.md`

## Estructura del Proyecto

```
├── app/
│   ├── page.tsx              # Página de login
│   ├── dashboard/            # Dashboard principal
│   ├── consultation/[id]/    # Chat de consulta
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globales
├── lib/
│   ├── auth.ts              # Sistema de autenticación
│   ├── consultations.ts     # Gestión de consultas
│   ├── medical-ai.ts        # Lógica del agente médico
│   └── pdf-generator.ts     # Generación de PDFs
└── package.json
```

## Notas Importantes

⚠️ **Aviso Médico**: Esta aplicación es una demostración y no debe usarse para diagnósticos médicos reales. Siempre consulta con un profesional de la salud.

## Licencia

MIT

