#!/bin/bash
# Script para desplegar frontend a S3 y CloudFront
# Configurar antes de usar:
# - BUCKET_NAME: Nombre de tu bucket S3
# - DISTRIBUTION_ID: ID de tu distribución CloudFront
# - API_URL: URL de tu backend (IP de EC2 o dominio)

BUCKET_NAME="iph-frontend-tu-nombre-unico"
DISTRIBUTION_ID="TU-DISTRIBUTION-ID"
API_URL="https://tu-ip-ec2:3000"

echo "🚀 Desplegando frontend a AWS..."

# Ir al directorio del frontend
cd frontend

# Crear archivo .env.production
echo "VITE_API_URL=$API_URL" > .env.production

# Construir proyecto
echo "📦 Construyendo proyecto..."
npm run build

# Subir a S3
echo "☁️ Subiendo a S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Invalidar caché de CloudFront
if [ "$DISTRIBUTION_ID" != "TU-DISTRIBUTION-ID" ]; then
  echo "🔄 Invalidando caché de CloudFront..."
  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

echo "✅ Frontend desplegado exitosamente!"
echo "🌐 URL: https://$DISTRIBUTION_ID.cloudfront.net"
