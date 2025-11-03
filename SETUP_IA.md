# 🤖 Configurar IA Real (Groq - Gratis)

Tu sistema ahora tiene **2 modos**:

## 🎯 Modo Actual: Sistema Basado en Reglas
✅ Ya funciona sin configuración adicional
✅ Hace 4 preguntas predefinidas
✅ 100% gratis, sin límites
✅ Suficiente para demostraciones

## 🚀 Modo IA Real: Groq AI
✅ Conversaciones naturales con IA
✅ Preguntas inteligentes y adaptativas
✅ También 100% gratis
✅ Muy rápido (respuestas en 1 segundo)

---

## 📝 Cómo Activar la IA Real (5 minutos)

### Paso 1️⃣: Crear el archivo de configuración

En la raíz del proyecto, crea un archivo llamado `.env.local`:

```bash
# En Linux/Mac
touch .env.local

# O simplemente crea el archivo con tu editor de texto
```

### Paso 2️⃣: Obtener API Key GRATIS

1. Ve a: **https://console.groq.com**
2. Haz clic en "Sign Up" (usa Google/GitHub para rapidez)
3. Una vez dentro, ve a **"API Keys"** en el menú
4. Haz clic en **"Create API Key"**
5. Dale un nombre: "MediConsult AI"
6. **¡COPIA LA KEY!** (se muestra solo una vez)

### Paso 3️⃣: Agregar la Key al archivo

Abre `.env.local` y pega esto:

```bash
NEXT_PUBLIC_GROQ_API_KEY=gsk_TU_KEY_REAL_AQUI
```

Reemplaza `gsk_TU_KEY_REAL_AQUI` con la key que copiaste.

### Paso 4️⃣: Reiniciar el servidor

```bash
# Detén el servidor (Ctrl + C en la terminal)
# Inicia nuevamente:
npm run dev
```

### Paso 5️⃣: ¡Probar!

1. Abre http://localhost:3000
2. Crea una nueva consulta
3. Verás que la IA ahora responde de forma más natural y variada

---

## 🔄 Comparación

| Característica | Sistema Reglas | Groq IA |
|---|---|---|
| **Costo** | Gratis | Gratis |
| **Velocidad** | Instantáneo | ~1 seg |
| **Conversación** | 4 preguntas fijas | Natural y adaptativa |
| **Límites** | Ilimitado | Miles/día |
| **Configuración** | ✅ Ya funciona | 5 min setup |

---

## ⚙️ Modos Disponibles

### Sin configurar (Default)
```
Usuario: "I have a headache"
Bot: "How long have you been experiencing these symptoms?"
[Pregunta #2 de 4 predefinidas]
```

### Con Groq configurado
```
Usuario: "I have a headache"
Bot: "I'm sorry to hear that. Can you describe the type of headache? 
Is it throbbing, sharp, or dull? And where exactly do you feel it?"
[Respuesta inteligente y personalizada]
```

---

## 🆓 Otras IAs Gratuitas (Alternativas)

Si prefieres otra opción:

### Google Gemini
```bash
# .env.local
GOOGLE_API_KEY=tu_key_aqui

# Get key: https://makersuite.google.com/app/apikey
```

### HuggingFace
```bash
# .env.local
HUGGINGFACE_API_KEY=tu_key_aqui

# Get key: https://huggingface.co/settings/tokens
```

---

## ❓ FAQ

**¿Necesito tarjeta de crédito?**
No, Groq es 100% gratis sin necesidad de tarjeta.

**¿Qué pasa si no configuro nada?**
El sistema funciona perfecto con el modo basado en reglas.

**¿Puedo cambiar entre modos?**
Sí, solo comenta/descomenta la línea en `.env.local` y reinicia.

**¿Groq es seguro?**
Sí, es de GroqInc, empresa legítima de IA. No guardan tus datos médicos.

**¿Funcionará en Vercel?**
Sí, solo agrega la variable de entorno en Vercel Settings.

---

## 🎉 ¡Listo!

Elige el modo que prefieras. Ambos funcionan excelente para tu proyecto.

