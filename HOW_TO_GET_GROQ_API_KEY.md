# 🔑 Cómo Obtener tu API Key de Groq (GRATIS)

## Paso 1: Ir a Groq Console
Abre tu navegador y ve a:
```
https://console.groq.com
```

## Paso 2: Registrarte
- Haz clic en "Sign Up" o "Sign In"
- Puedes registrarte con:
  - Google
  - GitHub
  - Email

## Paso 3: Acceder a API Keys
Una vez dentro:
1. Busca la sección **"API Keys"** en el menú lateral
2. O ve directamente a: `https://console.groq.com/keys`

## Paso 4: Crear una Nueva API Key
1. Haz clic en **"Create API Key"**
2. Dale un nombre (ejemplo: "MediConsult AI")
3. Haz clic en **"Submit"**
4. ⚠️ **IMPORTANTE**: Copia la key INMEDIATAMENTE (solo se muestra una vez)

## Paso 5: Agregar la Key a tu Proyecto

### Opción A: Archivo .env.local (Recomendado)
1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza `your_groq_api_key_here` con tu key:
```bash
NEXT_PUBLIC_GROQ_API_KEY=gsk_tu_key_real_aqui
```
3. Guarda el archivo

### Opción B: Variable de Entorno en Vercel
Si estás desplegando en Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - Name: `NEXT_PUBLIC_GROQ_API_KEY`
   - Value: tu API key
4. Redeploy el proyecto

## Paso 6: Reiniciar el Servidor
```bash
# Detén el servidor (Ctrl + C)
# Inicia nuevamente
npm run dev
```

## ✅ Verificar que Funciona

1. Abre http://localhost:3000
2. Inicia una consulta médica
3. Si ves respuestas naturales y variadas (no siempre las mismas 4 preguntas), ¡funciona! 🎉

## 🆓 Límites del Plan Gratuito

Groq es **MUY generoso**:
- ✅ Sin costo
- ✅ Miles de requests al día
- ✅ Velocidad ultra rápida
- ✅ Sin tarjeta de crédito requerida

Para un proyecto personal o demostración, es más que suficiente.

## ⚠️ Modo Fallback

Si NO configuras la API key, el sistema automáticamente usa el **sistema basado en reglas** (el que ya tienes funcionando). Ambos modos funcionan perfecto.

## 🤔 Problemas Comunes

### Error: "Invalid API key"
- Verifica que copiaste la key completa
- No debe tener espacios al inicio o final
- Reinicia el servidor después de configurarla

### La IA no responde diferente
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia completamente el servidor
- Verifica que la key empiece con `gsk_`

### "Rate limit exceeded"
- Espera unos minutos
- Groq es generoso, pero tiene límites por minuto

## 🎉 ¡Listo!

Ahora tu MediConsult AI tiene inteligencia artificial real y puede mantener conversaciones naturales.

