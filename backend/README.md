# Backend - Sistema IPH-DELITOS

Backend del sistema de cuestionarios IPH-DELITOS desarrollado con NestJS + TypeScript + SQLite.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run start:prod
```

## 📁 Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación
│   ├── guards/        # Guards JWT
│   └── strategies/    # Estrategia JWT
├── users/             # Módulo de usuarios
├── forms/             # Módulo de formularios
├── responses/          # Módulo de respuestas
├── progress/          # Módulo de progreso
├── admin/             # Módulo de administración
├── entities/          # Entidades TypeORM
│   ├── user.entity.ts
│   ├── form.entity.ts
│   ├── user-response.entity.ts
│   └── user-progress.entity.ts
└── main.ts            # Entry point
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=http://localhost:5173
```

## 📦 Dependencias Principales

- **NestJS** - Framework Node.js
- **TypeScript** - Type safety
- **TypeORM** - ORM para SQLite
- **Passport + JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs

## 🗄️ Base de Datos

- **SQLite** - Base de datos ligera
- Se crea automáticamente en `./database.sqlite`
- `synchronize: true` en desarrollo (crea tablas automáticamente)

## 📡 Endpoints API

### Autenticación
- `POST /auth/login` - Login
- `GET /auth/me` - Usuario actual

### Formularios
- `GET /forms` - Listar todos
- `GET /forms/:id` - Obtener por ID
- `GET /forms/number/:formNumber` - Obtener por número

### Respuestas
- `GET /responses/user/:userId` - Respuestas de usuario
- `GET /responses/user/:userId/form/:formId` - Respuesta específica
- `POST /responses` - Crear/actualizar respuesta
- `PUT /responses/:id` - Actualizar respuesta

### Progreso
- `GET /progress/:userId` - Progreso de usuario

### Admin
- `GET /admin/users` - Listar usuarios
- `GET /admin/users/:userId/responses` - Respuestas de usuario

## 🔄 Próximos Pasos

- [ ] Seed de datos iniciales (formularios, usuario admin)
- [ ] Validación de DTOs
- [ ] Manejo de errores mejorado
- [ ] Documentación Swagger
