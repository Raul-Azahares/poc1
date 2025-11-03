# 🚀 Guía Completa: Desplegar en Vercel

## Paso 1: Preparar el Repositorio

```bash
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "MediConsult AI - Sistema completo con IA opcional"

# Crear repositorio en GitHub y conectar
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

**Nota**: El archivo `.env.local` NO se subirá (está en .gitignore por seguridad)

---

## Paso 2: Desplegar en Vercel

### Opción A: Desde la Web (Más Fácil)

1. Ve a **https://vercel.com**
2. Haz clic en **"Add New Project"**
3. Selecciona **"Import Git Repository"**
4. Elige tu repositorio de GitHub
5. Vercel detectará automáticamente que es Next.js
6. **¡NO HAGAS CLIC EN DEPLOY TODAVÍA!**

### Paso 2.1: Configurar Variables de Entorno (Importante)

Antes de hacer deploy:

1. En la pantalla de configuración, busca **"Environment Variables"**
2. Haz clic en **"Add"** o el botón **"+"**
3. Agrega:
   ```
   Name:  NEXT_PUBLIC_GROQ_API_KEY
   Value: gsk_tu_key_real_de_groq_aqui
   ```
4. **Marca las 3 opciones**:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. Haz clic en **"Add"**

### Paso 2.2: Deploy

6. Ahora sí, haz clic en **"Deploy"**
7. Espera 2-3 minutos mientras se construye
8. ¡Listo! Vercel te dará una URL como: `https://tu-app.vercel.app`

---

## Opción B: Con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Sigue las instrucciones en pantalla
```

Luego ve al dashboard para agregar las variables de entorno.

---

## 📋 Configurar Variables Después del Deploy

Si ya desplegaste sin configurar las variables:

1. Ve a **https://vercel.com/dashboard**
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️)
4. En el menú lateral: **Environment Variables**
5. Haz clic en **"Add New"**
6. Agrega:
   ```
   Key:   NEXT_PUBLIC_GROQ_API_KEY
   Value: gsk_tu_key_aqui
   ```
7. Selecciona: **Production**, **Preview**, **Development**
8. Haz clic en **"Save"**
9. **IMPORTANTE**: Ve a **Deployments**
10. Haz clic en los **"..."** del último deployment
11. Selecciona **"Redeploy"**

---

## 🎯 Modos de Funcionamiento

### Con Variable Configurada en Vercel:
```
✅ IA Real Activa (Groq)
Conversaciones naturales e inteligentes
```

### Sin Variable Configurada:
```
ℹ️ Modo Básico Activo
4 preguntas predefinidas (funciona perfecto)
```

**Ambos modos funcionan bien**. La diferencia es solo la naturalidad de la conversación.

---

## 🔐 Seguridad

### ✅ CORRECTO:
- Variables en Vercel Dashboard ✓
- `.env.local` en `.gitignore` ✓
- API Keys nunca en el código ✓

### ❌ NUNCA HAGAS:
- Subir `.env.local` a Git ✗
- Poner API Keys directamente en el código ✗
- Compartir tus API Keys públicamente ✗

---

## 🔄 Actualizar el Sitio Desplegado

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push

# Vercel automáticamente detecta el push y redespliega
```

---

## ✅ Verificar que Todo Funciona

1. **Abre tu URL de Vercel**: `https://tu-app.vercel.app`
2. **Crea una cuenta** y haz login
3. **Inicia una consulta médica**
4. **Abre la consola del navegador** (F12 → Console)
5. Verás uno de estos mensajes:
   - `✅ Using Groq AI` = IA real funcionando
   - `ℹ️ Using rule-based system` = Modo básico

---

## 🆘 Problemas Comunes

### "La IA no funciona en producción"
→ Verifica que agregaste la variable en Vercel Settings
→ Asegúrate de haber redeployado después de agregar la variable

### "Invalid API Key"
→ Verifica que la key en Vercel empiece con `gsk_`
→ Genera una nueva key en Groq si es necesario

### "No puedo encontrar Environment Variables"
→ Ve a Settings (⚙️) → Environment Variables en el menú lateral

### "Los cambios no se reflejan"
→ Espera 2-3 minutos después del push
→ O haz un redeploy manual desde el dashboard

---

## 📸 Resumen Visual

```
Desarrollo Local:
  .env.local (tu máquina) → npm run dev → localhost:3000
                                              ↓
                                         Funciona ✓

Producción (Vercel):
  Vercel Dashboard → Environment Variables → Deploy
                                              ↓
                                      tu-app.vercel.app
                                              ↓
                                         Funciona ✓
```

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en internet con:
- ✅ Autenticación funcionando
- ✅ Chat médico (modo básico o IA según configuración)
- ✅ Generación de PDF
- ✅ Dashboard con historial
- ✅ Todo optimizado para Vercel

**URL de ejemplo**: https://mediconsult-ai.vercel.app

---

## 💡 Pro Tips

1. **Dominios custom**: En Vercel Settings puedes agregar tu propio dominio
2. **Analytics**: Vercel tiene analytics gratis integrados
3. **Preview Deployments**: Cada PR genera una preview automática
4. **Rollback**: Puedes volver a versiones anteriores fácilmente

---

## 📞 Soporte

Si tienes problemas:
- Revisa los **logs** en Vercel Dashboard → Deployments → Build Logs
- Verifica las **variables de entorno** estén bien escritas
- Asegúrate de que el proyecto compile localmente: `npm run build`

