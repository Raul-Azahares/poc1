# 💬 Chat Flotante - Guía Completa

## ✨ Nuevas Funcionalidades

Ahora tienes **3 formas** de usar el chat médico:

### 1️⃣ **Pantalla Completa** (Original)
- Click en "+" en el Dashboard
- Vista completa dedicada a la conversación
- Ideal para consultas detalladas

### 2️⃣ **Chat Flotante desde Dashboard**
- Botón flotante azul abajo a la derecha
- Chat en ventana pequeña mientras navegas
- Puedes minimizar/expandir

### 3️⃣ **Minimizar Chat Actual**
- Botón "Minimize" en cualquier consulta
- Convierte vista completa → flotante
- Botón "Expand" para volver a pantalla completa

---

## 🎯 Cómo Usar Cada Modo

### Pantalla Completa
```
Dashboard → Click "+" grande
     ↓
Vista completa del chat
     ↓
Conversación médica
     ↓
Generar reporte
```

**Ventajas:**
- ✅ Más espacio para leer
- ✅ Menos distracciones
- ✅ Mejor para consultas largas

### Chat Flotante (Dashboard)
```
Dashboard → Click botón flotante (abajo derecha)
     ↓
Ventana pequeña aparece
     ↓
Chateas mientras ves el dashboard
     ↓
Click X para cerrar o minimizar
```

**Ventajas:**
- ✅ No pierdes contexto del dashboard
- ✅ Consultas rápidas
- ✅ Puedes ver tu historial mientras chateas

### Minimizar/Maximizar
```
Chat en pantalla completa → Click "Minimize"
     ↓
Se convierte en ventana flotante
     ↓
Click "Expand" para volver a pantalla completa
```

**Ventajas:**
- ✅ Flexibilidad total
- ✅ Cambias según necesites
- ✅ No pierdes el progreso

---

## 🎨 Características del Chat Flotante

### Tamaño y Posición
- **Tamaño**: 450px × 650px
- **Posición**: Abajo derecha (siempre visible)
- **z-index**: 50 (encima de todo)

### Funcionalidades
- ✅ Scroll automático a nuevos mensajes
- ✅ Botón para generar reporte (aparece después de 3 mensajes)
- ✅ Minimizar a botón circular
- ✅ Expandir a pantalla completa
- ✅ Cerrar y guardar progreso
- ✅ Indicador de mensajes cuando está minimizado

### Estados Visuales

#### Minimizado (Botón Circular):
```
[💬 Medical Chat  3]
     ↑            ↑
   Icono    Contador mensajes
```

#### Expandido (Ventana):
```
┌─────────────────────────────┐
│ 🩺 Dr. MediConsult AI   [⬇][×]│
├─────────────────────────────┤
│                             │
│  Mensajes del chat         │
│                             │
├─────────────────────────────┤
│ [Escribe mensaje...] [📤]   │
└─────────────────────────────┘
```

---

## 📱 Diseño Responsive

### Desktop (> 768px):
- Chat flotante: 450px × 650px
- Botón "Minimize" muestra texto
- Todas las funcionalidades disponibles

### Mobile (< 768px):
- Se recomienda usar vista de pantalla completa
- Chat flotante se adapta automáticamente
- Botón "Minimize" solo muestra icono

---

## 🎯 Casos de Uso

### Caso 1: Consulta Rápida
```
1. Estás en el Dashboard
2. Click en botón flotante
3. Preguntas algo rápido
4. Cierras el chat
5. Continúas navegando
```

### Caso 2: Consulta Detallada
```
1. Dashboard → Click "+"
2. Vista completa
3. Conversación larga
4. Necesitas ver algo en dashboard
5. Click "Minimize"
6. Ves dashboard mientras chateas
7. Click "Expand" para volver
```

### Caso 3: Múltiples Tareas
```
1. Abres chat desde dashboard
2. Chateas mientras revisas historial
3. Minimizas cuando necesitas
4. Expandes para escribir respuestas largas
5. Generas reporte cuando estés listo
```

---

## 🔧 Detalles Técnicos

### Componentes Creados:

1. **`FloatingChat.tsx`**
   - Componente independiente del chat
   - Puede instanciarse desde cualquier lugar
   - Maneja su propio estado
   - Props: `onClose`, `consultationId` (opcional)

2. **Dashboard actualizado**
   - Botón flotante con estado
   - Control de visibilidad del chat
   - Integración con consultas existentes

3. **Página de consulta actualizada**
   - Toggle entre modo completo/flotante
   - Preserva estado al cambiar modos
   - Mismo componente, diferentes vistas

### Persistencia de Datos
- ✅ Al minimizar: Se guarda automáticamente
- ✅ Al cerrar: Conversación permanece en historial
- ✅ Al expandir: Carga estado actual
- ✅ Al cambiar modo: No se pierde nada

---

## 💡 Tips de UX

### Para Usuario:
1. **Consulta rápida** → Usa chat flotante desde dashboard
2. **Consulta seria** → Usa vista completa
3. **Multitarea** → Minimiza cuando necesites
4. **Reporte** → Genera cuando tengas toda la info

### Para Desarrollador:
1. El chat flotante es reutilizable
2. Puedes agregar más instancias en otras páginas
3. El estado se sincroniza con localStorage
4. El componente es independiente del routing

---

## 🚀 Extensiones Futuras (Ideas)

### Posibles Mejoras:
1. **Arrastrar y soltar** el chat flotante
2. **Redimensionar** la ventana del chat
3. **Múltiples chats** abiertos simultáneamente
4. **Notificaciones** de nuevos mensajes
5. **Atajos de teclado** (Esc para minimizar, etc.)
6. **Tema oscuro** para el chat flotante
7. **Sonidos** de notificación
8. **Autocompletado** de síntomas comunes

---

## 📋 Shortcuts de Teclado

### Actuales:
- `Enter` → Enviar mensaje
- `Shift + Enter` → Nueva línea

### Sugeridos para futuro:
- `Esc` → Minimizar/cerrar
- `Ctrl/Cmd + M` → Toggle minimize/maximize
- `Ctrl/Cmd + Enter` → Generar reporte

---

## ✅ Testing Checklist

Para probar todas las funcionalidades:

- [ ] Abrir chat flotante desde dashboard
- [ ] Escribir varios mensajes
- [ ] Minimizar a botón circular
- [ ] Ver contador de mensajes
- [ ] Expandir de nuevo
- [ ] Cerrar y reabrir (debe mantener historial)
- [ ] Ir a consulta en pantalla completa
- [ ] Click en "Minimize"
- [ ] Click en "Expand"
- [ ] Generar reporte desde modo flotante
- [ ] Generar reporte desde modo completo
- [ ] Probar en móvil (responsive)

---

## 🎉 ¡Disfruta tu Chat Flotante!

Ahora tienes la flexibilidad de usar el chat como prefieras:
- 🖥️ Pantalla completa para foco total
- 💬 Flotante para multitarea
- 🔄 Cambio fluido entre modos

**Todo sin perder tu conversación ni progreso.**

