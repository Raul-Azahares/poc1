# ⚡ Guía Rápida: Deploy en Vercel con Groq IA

## 🎯 Respuesta Rápida a tu Pregunta

**¿Funcionará `NEXT_PUBLIC_GROQ_API_KEY` en Vercel?**

✅ **SÍ**, pero debes configurarla en el dashboard de Vercel.

❌ El archivo `.env.local` **NO se sube** a Git (por seguridad).

---

## 📋 Checklist Rápido

### Paso 1: Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

### Paso 2: Importar en Vercel
1. Ve a https://vercel.com
2. "Add New Project" → Importa tu repo
3. **¡NO HAGAS DEPLOY TODAVÍA!**

### Paso 3: Agregar Variable de Entorno
Antes de hacer deploy, en la pantalla de configuración:

```
Environment Variables:
┌─────────────────────────────────────┐
│ Name:  NEXT_PUBLIC_GROQ_API_KEY    │
│ Value: gsk_tu_key_aqui             │
│                                     │
│ ✅ Production                       │
│ ✅ Preview                          │
│ ✅ Development                      │
└─────────────────────────────────────┘
```

### Paso 4: Deploy
Haz clic en "Deploy" y espera 2-3 minutos.

---

## 🔄 Si Ya Desplegaste Sin la Variable

1. **Settings** → **Environment Variables**
2. **Add New** → Agrega `NEXT_PUBLIC_GROQ_API_KEY`
3. **Deployments** → **"..."** → **Redeploy**

---

## 🎯 Resultado

### Con Variable Configurada:
```
Tu App en Vercel → Lee NEXT_PUBLIC_GROQ_API_KEY → Usa Groq IA ✅
```

### Sin Variable Configurada:
```
Tu App en Vercel → No encuentra la variable → Usa Modo Básico ℹ️
```

**Ambos funcionan bien**, solo cambia la naturalidad del chat.

---

## 🔐 Por Qué NO se Sube `.env.local`

```bash
# En .gitignore está:
.env*.local  ← Esto previene que se suba

# Por seguridad:
✅ Variables sensibles no van al código
✅ Cada ambiente tiene sus propias variables
✅ Proteges tus API keys
```

---

## 📱 Screenshot de Dónde Agregar la Variable

```
Vercel Dashboard
├── Tu Proyecto
│   ├── Settings ⚙️
│   │   ├── Environment Variables  👈 AQUÍ
│   │   │   ├── Add New
│   │   │   │   ├── Key: NEXT_PUBLIC_GROQ_API_KEY
│   │   │   │   └── Value: gsk_...
│   │   │   └── [Save]
```

---

## ✅ Verificar que Funciona

Después del deploy:

1. Abre `https://tu-app.vercel.app`
2. F12 → Console
3. Inicia una consulta
4. Verás:
   - `✅ Using Groq AI` = Variable configurada correctamente
   - `ℹ️ Using rule-based system` = Sin variable (modo básico)

---

## 🚀 Comandos Completos

```bash
# 1. Preparar repo
git init
git add .
git commit -m "MediConsult AI con Groq"

# 2. Subir a GitHub
# (Crea repo en GitHub primero)
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main

# 3. En Vercel
# - Importa el repo
# - Agrega la variable NEXT_PUBLIC_GROQ_API_KEY
# - Deploy

# 4. Actualizar después
git add .
git commit -m "Cambios"
git push
# Vercel redespliega automáticamente
```

---

## 🎉 ¡Eso es Todo!

Tu app funcionará en Vercel con o sin la variable de Groq. 

**Con la variable** = IA conversacional natural  
**Sin la variable** = Sistema de preguntas básico (también excelente)

La decisión es tuya 😊

