# Dockerfile para el backend NestJS con SQLite
# Stage 1: Build
FROM node:20-alpine AS builder

# Instalar dependencias del sistema para compilación nativa (SQLite)
RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para nest build)
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

RUN apk add --no-cache sqlite

WORKDIR /app

COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar la salida compilada del stage anterior
COPY --from=builder /app/dist ./dist

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
