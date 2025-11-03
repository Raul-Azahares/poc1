#!/bin/bash

echo "🤖 MediConsult AI - Configuración de Groq (IA Gratis)"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  El archivo .env.local ya existe."
    read -p "¿Quieres sobrescribirlo? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "❌ Operación cancelada."
        exit 0
    fi
fi

echo ""
echo "📝 Instrucciones:"
echo "1. Ve a: https://console.groq.com"
echo "2. Crea una cuenta (usa Google/GitHub)"
echo "3. Ve a 'API Keys' y crea una nueva key"
echo "4. Copia la key que empieza con 'gsk_...'"
echo ""
read -p "Pega tu API Key de Groq aquí: " api_key

if [ -z "$api_key" ]; then
    echo "❌ No ingresaste ninguna key. Operación cancelada."
    exit 1
fi

# Create .env.local file
cat > .env.local << EOF
# Groq API Key - Configurado automáticamente
NEXT_PUBLIC_GROQ_API_KEY=$api_key
EOF

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reinicia el servidor: Ctrl+C y luego 'npm run dev'"
echo "2. Abre http://localhost:3000"
echo "3. Inicia una consulta y verás la IA en acción"
echo ""
echo "🎉 ¡Disfruta de tu asistente médico con IA real!"

