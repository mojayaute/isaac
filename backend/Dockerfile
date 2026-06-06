# Dockerfile para el backend NestJS con SQLite
FROM node:18-alpine

# Instalar dependencias del sistema para SQLite
RUN apk add --no-cache python3 make g++ sqlite

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/database.sqlite

# Comando para iniciar
CMD ["npm", "run", "start:prod"]
