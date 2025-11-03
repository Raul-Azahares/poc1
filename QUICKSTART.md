# 🚀 Guía de Inicio Rápido

## Instalación Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Primer Uso

### 1️⃣ Crear Cuenta
- Ingresa tu nombre, email y contraseña
- Haz clic en "Sign Up"
- **Nota**: No se requiere verificación de email

### 2️⃣ Iniciar Consulta
- En el Dashboard, haz clic en el botón "+" grande
- Comienza a chatear con el asistente médico

### 3️⃣ Responder Preguntas
El asistente te hará 4 preguntas:
1. ¿Qué síntomas experimentas?
2. ¿Cuánto tiempo los has tenido?
3. ¿Cuál es la severidad? (escala 1-10)
4. ¿Información adicional? (medicamentos, alergias, etc.)

### 4️⃣ Descargar Reporte
- Una vez completadas las preguntas, aparecerá el botón "Download Report"
- Haz clic para obtener tu PDF con recomendaciones

## 🚀 Desplegar en Vercel

### Método 1: Desde GitHub
```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin tu-repositorio.git
git push -u origin main

# 2. En Vercel
# - Ve a vercel.com
# - Haz clic en "Add New Project"
# - Importa tu repositorio de GitHub
# - Haz clic en "Deploy"
```

### Método 2: Con Vercel CLI
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desplegar
vercel

# 3. Seguir las instrucciones en pantalla
```

## 🎨 Personalización

### Cambiar Colores
Edita `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#TU_COLOR_AQUI',
  }
}
```

### Modificar Preguntas del Agente
Edita `lib/medical-ai.ts`:
```typescript
const conversationFlow: MedicalQuestion[] = [
  {
    question: "Tu pregunta personalizada",
    type: 'text'
  },
  // Agrega más preguntas...
]
```

## 🔧 Próximas Mejoras (Opcional)

### Integrar IA Real (Groq - Gratis)
```bash
# 1. Obtener API Key en groq.com
# 2. Crear archivo .env.local
echo "GROQ_API_KEY=tu_key" > .env.local

# 3. Instalar SDK
npm install groq-sdk

# 4. Actualizar lib/medical-ai.ts para usar Groq
```

### Base de Datos Real
- Considera usar Vercel Postgres o Supabase
- Migra de localStorage a una BD real

## ⚠️ Importante

**DISCLAIMER**: Esta aplicación es una demostración educativa. NO debe usarse para diagnósticos médicos reales. Siempre consulta con profesionales de la salud certificados.

## 📞 Soporte

Si encuentras problemas:
1. Verifica que Node.js esté instalado (`node --version`)
2. Asegúrate de que todas las dependencias estén instaladas
3. Revisa la consola del navegador para errores
4. Intenta `npm cache clean --force` y reinstalar

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando. Disfruta de MediConsult AI.

