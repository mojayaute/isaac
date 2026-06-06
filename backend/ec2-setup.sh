#!/bin/bash
# Script de configuración inicial para EC2
# Ejecutar en la instancia EC2 después de conectarse vía SSH

echo "🚀 Configurando servidor EC2 para IPH Backend..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo yum update -y

# Instalar Node.js 18
echo "📦 Instalando Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalación
echo "✅ Node.js instalado:"
node --version
npm --version

# Instalar PM2
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Instalar SQLite
echo "📦 Instalando SQLite..."
sudo yum install -y sqlite

# Instalar Git
echo "📦 Instalando Git..."
sudo yum install -y git

# Instalar Nginx (opcional)
echo "📦 Instalando Nginx..."
sudo yum install -y nginx

echo "✅ Configuración básica completada!"
echo ""
echo "Próximos pasos:"
echo "1. Clonar tu repositorio: git clone https://github.com/tu-usuario/tu-repo.git"
echo "2. cd tu-repo/backend"
echo "3. npm install"
echo "4. Crear archivo .env con las variables de entorno"
echo "5. npm run build"
echo "6. pm2 start dist/main.js --name iph-backend"
echo "7. pm2 startup && pm2 save"
