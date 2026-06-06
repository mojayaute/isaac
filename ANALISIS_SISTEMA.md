# Análisis del Sistema de Cuestionarios IPH-DELITOS

## 🎯 Enfoque: MVP (Minimum Viable Product)

> **Este es un proyecto de demostración (MVP)**, no una solución de producción completa. Se priorizan funcionalidades esenciales y se omiten características avanzadas que no son críticas para demostrar el concepto.

**Principios del MVP:**
- ✅ Funcionalidad básica que demuestre el concepto
- ✅ Login, formularios, guardado, panel admin básico
- ❌ Características avanzadas se omiten o simplifican
- ❌ Optimizaciones complejas se dejan para después
- ⏱️ Tiempo estimado: 3-4 semanas (vs 6-8 semanas versión completa)

---

## 📋 Resumen del Proyecto

El proyecto contiene **15 formularios HTML** (convertidos desde PDFs) que conforman un cuestionario completo del **Informe Policial Homologado (IPH)**. Cada usuario debe completar los 15 formularios secuencialmente.

---

## 🔍 Análisis de los Formularios HTML

### Estructura General
- **15 archivos HTML** (1.html a 15.html)
- Cada formulario tiene campos de entrada (text, date, time, textarea, radio, checkbox)
- Algunos formularios incluyen tablas dinámicas
- Campos de firma (signature boxes)
- Validaciones en JavaScript
- Auto-guardado en localStorage (en algunos formularios)

### Tipos de Campos Identificados

#### 1. **Campos de Texto**
- Nombres, apellidos
- Direcciones
- Referencias
- Descripciones

#### 2. **Campos Numéricos**
- Números de página
- Códigos postales
- Coordenadas

#### 3. **Fechas y Horas**
- Fechas de eventos
- Horas de detención
- Timestamps

#### 4. **Textareas (Narrativas)**
- Narrativa de hechos
- Continuación de narrativas
- Descripciones extensas

#### 5. **Radio Buttons**
- Sí/No
- Opciones múltiples

#### 6. **Checkboxes**
- Listas de anexos
- Múltiples selecciones

#### 7. **Tablas Dinámicas**
- Pertenencias (hasta 10 filas)
- Inventario de armas y objetos
- Listas de testigos

#### 8. **Campos de Firma**
- Signature boxes (requieren implementación digital)

### Formularios Identificados (por título/contenido)

1. **1.html** - Informe Policial Homologado (IPH2019) - Formulario principal
2. **2.html** - Sección 2: Primer Respondiente
3. **3.html** - Apartado 4.2: Inspección del lugar (con canvas para croquis)
4. **4.html** - Sección 5: Narrativa de los Hechos
5. **5.html** - (Por analizar)
6. **6.html** - Anexo A: Detención(es) - Continuación
7. **7.html** - Anexo A: Apartados 7 y 8
8. **8.html** - (Por analizar)
9. **9.html** - (Por analizar)
10. **10.html** - Anexo D: Inventario de Armas y Objetos
11. **11.html** - (Por analizar)
12. **12.html** - (Por analizar)
13. **13.html** - (Por analizar)
14. **14.html** - (Por analizar)
15. **15.html** - Anexo G: Continuación de la Narrativa

---

## 🏗️ Arquitectura Propuesta

### Stack Tecnológico

#### **Frontend**
- **Framework**: React.js
  - **Build Tool**: Vite o Create React App
  - **TypeScript**: Para type safety
  
- **UI Framework**: 
  - Material-UI (MUI) o Tailwind CSS
  - Componentes responsive (mobile-friendly pero no app nativa)
  
- **Navegación**:
  - React Router (para navegación SPA)

- **Estado Global**:
  - Zustand o Redux Toolkit (para formularios complejos)
  - React Query (para sincronización con backend)

- **Validación de Formularios**:
  - React Hook Form + Yup/Zod

- **Almacenamiento Local**:
  - LocalStorage/IndexedDB (para borradores y sincronización)

#### **Backend**
- **Framework**: NestJS (Node.js)
  - Arquitectura modular
  - TypeScript nativo
  - Decoradores y dependency injection
  
- **Base de Datos**:
  - **Principal**: SQLite (base de datos ligera, archivo local)
  - **ORM**: TypeORM o Prisma (recomendado Prisma)
  - **Ventajas**: No requiere servidor, fácil de desplegar, perfecta para aplicaciones medianas
  
- **Autenticación**:
  - JWT (JSON Web Tokens) con @nestjs/jwt
  - bcrypt para hash de passwords
  - Refresh tokens para seguridad
  - Guards de NestJS para protección de rutas

- **API**:
  - REST API
  - Documentación: Swagger/OpenAPI (integrado con NestJS)

- **Almacenamiento de Archivos**:
  - Local storage o cloud storage (según necesidades)
  - Para firmas digitales y documentos

#### **Infraestructura AWS (Free Tier)**

**Recomendación para AWS Free Tier:**

- **Frontend (React)**:
  - **S3 + CloudFront** (recomendado - más simple)
    - 5GB S3 almacenamiento gratis/mes
    - 50GB CloudFront transfer gratis/mes
    - HTTPS/SSL incluido con CloudFront
    - Build local y upload manual (o con script)
    - Más control y simplicidad
    - Alternativa: **AWS Amplify** (si necesitas CI/CD automático)

- **Backend (NestJS)**:
  - **EC2 t2.micro** (recomendado)
    - 750 horas/mes gratis por 12 meses
    - 1 vCPU, 1GB RAM (suficiente para NestJS)
    - Ubuntu Server 22.04 LTS
    - SQLite incluido en el servidor (archivo local)

- **Base de Datos**:
  - **SQLite** (archivo en EC2)
    - No requiere servicio adicional
    - Backup: copiar archivo `.sqlite` a S3 periódicamente

- **Almacenamiento y CDN**:
  - **S3** (opcional para backups)
    - 5GB almacenamiento gratis/mes
    - Para backups de SQLite y archivos estáticos
  - **CloudFront** (opcional para CDN)
    - 50GB transfer gratis/mes
    - Para servir frontend si usas S3

- **DNS** (opcional):
  - **Route 53**
    - Limitado en free tier, considerar alternativas gratuitas (Cloudflare)

**Arquitectura AWS Propuesta:**
```
Internet
   │
   ├─> CloudFront CDN
   │   └─> S3 Bucket (Frontend React estático)
   │       └─> Build local → Upload a S3
   │
   └─> EC2 t2.micro (Backend NestJS)
       ├─> NestJS API
       ├─> SQLite (database.sqlite)
       └─> PM2 para gestión de procesos
```

**Costos estimados (Free Tier):**
- EC2 t2.micro: **Gratis** (750 horas/mes x 12 meses)
- S3: **Gratis** (5GB/mes)
- CloudFront: **Gratis** (50GB transfer/mes)
- **Total: $0/mes** (dentro de los límites del free tier)

### ¿S3 + CloudFront vs Amplify?

**S3 + CloudFront (Recomendado para este proyecto):**
- ✅ **Más simple**: Solo hosting estático, sin complejidad extra
- ✅ **Más control**: Tú decides cuándo hacer build y deploy
- ✅ **Más económico**: No consume minutos de build
- ✅ **Suficiente**: Para un proyecto React estático es perfecto
- ✅ **Flexible**: Puedes usar scripts de deploy o hacerlo manual
- ⚠️ **Build manual**: Necesitas hacer `npm run build` localmente y subir

**AWS Amplify:**
- ✅ **CI/CD automático**: Build y deploy automático desde GitHub
- ✅ **Preview deployments**: Ver cambios en PRs antes de merge
- ✅ **Menos trabajo**: Push a GitHub y listo
- ⚠️ **Más complejo**: Configuración adicional, más "mágico"
- ⚠️ **Límite de build**: 1000 minutos/mes (suficiente pero limitado)
- ⚠️ **Menos control**: Menos visibilidad del proceso

**Recomendación:** Para este proyecto, **S3 + CloudFront es mejor** porque:
- Es más simple y directo
- No necesitas CI/CD complejo
- Tienes más control
- Es igual de gratis
- El build de React es rápido y puedes hacerlo localmente

### Configuración Detallada AWS

#### 1. **EC2 para Backend NestJS**

**Instancia recomendada:**
- Tipo: `t2.micro` (Free Tier elegible)
- OS: Ubuntu Server 22.04 LTS
- Storage: 8GB gp3 (incluido en free tier)
- Security Group: Abrir puertos 22 (SSH), 3000/8080 (NestJS)

**Setup en EC2:**
```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2

# Clonar y configurar proyecto NestJS
# Configurar variables de entorno
# Iniciar con PM2: pm2 start dist/main.js --name iph-api
```

**Gestión con PM2:**
- Auto-restart si se cae
- Logs: `pm2 logs iph-api`
- Monitoreo: `pm2 monit`

#### 2. **S3 + CloudFront para Frontend React**

**Configuración S3:**
1. Crear bucket S3 (ej: `iph-frontend-bucket`)
2. Habilitar "Static website hosting"
3. Subir archivos del build de React (`npm run build`)
4. Configurar política pública de lectura

**Configuración CloudFront:**
1. Crear distribución CloudFront
2. Origin: Tu bucket S3
3. Habilitar HTTPS (SSL automático)
4. Configurar CORS si es necesario
5. Obtener URL de CloudFront (ej: `d123abc.cloudfront.net`)

**Script de Deploy Simple:**
```bash
#!/bin/bash
# deploy-frontend.sh

# Build React
npm run build

# Subir a S3
aws s3 sync build/ s3://iph-frontend-bucket --delete

# Invalidar caché de CloudFront (opcional)
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

echo "Deploy completado!"
```

**Variables de entorno:**
- Configurar `REACT_APP_API_URL` antes del build
- O usar archivo `.env.production`:
```
REACT_APP_API_URL=https://tu-ec2-ip:3000
```

**Alternativa: AWS Amplify (si prefieres CI/CD automático)**
- Conectar repositorio GitHub
- Build settings automáticos (detecta React)
- Deploy automático en cada push
- Menos control pero más automatizado

#### 3. **S3 para Backups (Opcional pero Recomendado)**

**Uso:**
- Backup diario del archivo SQLite
- Almacenar firmas digitales si las hay
- Script de backup automático

**Script de backup ejemplo:**
```bash
#!/bin/bash
# Backup SQLite a S3
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/database.sqlite /tmp/database_backup_$DATE.sqlite
aws s3 cp /tmp/database_backup_$DATE.sqlite s3://tu-bucket/backups/
```

#### 4. **Security Best Practices**

**EC2 Security:**
- Usar Key Pairs (no passwords SSH)
- Configurar Security Groups restrictivos
- Actualizar sistema regularmente: `sudo apt update && sudo apt upgrade`
- Usar firewall: `sudo ufw enable`
- Considerar Elastic IP (gratis si asociado a instancia)

**Amplify Security:**
- Variables de entorno para API keys
- No exponer secrets en código
- Usar HTTPS siempre (incluido por defecto)

**SQLite Backup:**
- Backup automático diario a S3
- Retener últimos 7-30 días de backups
- Probar restauración periódicamente

### Alternativa: Todo en EC2 (Más Simple)

Si prefieres simplicidad, puedes servir todo desde EC2:

**Opción Simple:**
- EC2 t2.micro
- Nginx como reverse proxy
- Frontend React build servido por Nginx
- Backend NestJS en puerto 3000
- SQLite en el servidor

**Configuración Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend React
    location / {
        root /var/www/iph-frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

**Ventajas:**
- Todo en un solo lugar
- Más fácil de gestionar
- Menos servicios AWS

**Desventajas:**
- Menos escalable
- Build manual del frontend

---

## 🏛️ Arquitectura NestJS + React

### Estructura Backend (NestJS)

```
backend/
├── src/
│   ├── auth/              # Módulo de autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/         # JWT guards
│   │   └── strategies/     # JWT strategy
│   ├── users/             # Módulo de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── entities/      # User entity
│   ├── forms/             # Módulo de formularios
│   │   ├── forms.controller.ts
│   │   ├── forms.service.ts
│   │   ├── forms.module.ts
│   │   └── entities/      # Form entity
│   ├── responses/         # Módulo de respuestas
│   │   ├── responses.controller.ts
│   │   ├── responses.service.ts
│   │   ├── responses.module.ts
│   │   └── entities/      # UserResponse entity
│   ├── admin/             # Módulo de administración
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── admin.module.ts
│   ├── common/            # Utilidades compartidas
│   │   ├── decorators/
│   │   ├── guards/
│   │   └── interceptors/
│   └── main.ts            # Entry point
├── prisma/                # Si usas Prisma
│   └── schema.prisma
└── package.json
```

### Estructura Frontend (React)

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── forms/         # Componentes de formulario
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── pages/             # Páginas/rutas
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Form/[id]/
│   │   └── Admin/
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   │   └── api.ts         # Axios/fetch config
│   ├── store/             # Estado global (Zustand/Redux)
│   ├── utils/             # Utilidades
│   ├── types/             # TypeScript types
│   └── App.tsx
├── public/
└── package.json
```

### Flujo de Datos

```
React Frontend          NestJS Backend          SQLite (archivo)
     │                        │                      │
     │  POST /auth/login      │                      │
     ├──────────────────────>│                      │
     │                        │  SELECT user         │
     │                        ├─────────────────────>│
     │                        │<─────────────────────┤
     │                        │  bcrypt.compare      │
     │                        │                      │
     │  JWT token             │                      │
     │<───────────────────────┤                      │
     │                        │                      │
     │  GET /forms            │                      │
     ├──────────────────────>│                      │
     │  (con JWT header)      │  Validate JWT        │
     │                        │  SELECT forms        │
     │                        ├─────────────────────>│
     │                        │<─────────────────────┤
     │  Forms data            │                      │
     │<───────────────────────┤                      │
     │                        │                      │
     │  POST /responses        │                      │
     ├──────────────────────>│                      │
     │  (form data)           │  INSERT/UPDATE       │
     │                        ├─────────────────────>│
     │                        │<─────────────────────┤
     │  Success response      │                      │
     │<───────────────────────┤                      │
```

### Módulos NestJS Clave

#### Auth Module
- Login endpoint
- JWT token generation
- Password hashing (bcrypt)
- Guards para proteger rutas

#### Forms Module
- CRUD de formularios (metadata)
- Endpoint para obtener estructura de formularios
- Validación de estructura

#### Responses Module
- Guardar respuestas (draft/submitted)
- Obtener respuestas por usuario
- Actualizar respuestas
- Validación de datos

#### Admin Module
- Listar todos los usuarios
- Ver respuestas de cualquier usuario
- Exportar datos
- Estadísticas

### Componentes React Clave

#### Form Components
- `FormField` - Campo genérico (text, date, textarea, etc.)
- `FormTable` - Tabla dinámica (pertenencias, inventarios)
- `SignaturePad` - Captura de firma (canvas)
- `FormNavigation` - Navegación entre formularios

#### Pages
- `LoginPage` - Autenticación
- `DashboardPage` - Lista de formularios y progreso
- `FormPage` - Renderiza formulario específico
- `AdminPage` - Panel de administración

---

## 📱 Funcionalidades Requeridas

### 1. **Sistema de Autenticación**
- Login con username y password
- Registro de nuevos usuarios (si aplica)
- Recuperación de contraseña
- Sesión persistente
- Logout

### 2. **Dashboard de Usuario**
- Lista de formularios (1-15)
- Indicador de progreso (cuántos completados)
- Estado de cada formulario (pendiente, en progreso, completado)
- Fecha de última modificación

### 3. **Sistema de Formularios**
- Navegación secuencial (1→2→3...→15)
- Guardado automático (draft)
- Validación antes de avanzar
- Posibilidad de volver atrás y editar
- Indicador de campos requeridos
- Preview antes de enviar

### 4. **Gestión de Respuestas**
- Guardar respuestas por usuario
- Versionado (si se edita después de enviar)
- Timestamp de creación/modificación
- Exportar a PDF (opcional)

### 5. **Panel de Administración**
- Lista de todos los usuarios
- Ver respuestas de cada usuario
- Filtros y búsqueda
- Exportar datos (CSV, Excel)
- Estadísticas (cuántos completaron, cuántos pendientes)

---

## 🗄️ Análisis Profundo de Base de Datos (SQLite)

### Estructura Completa de Tablas

#### 1. **Tabla: users** (Usuarios del sistema)

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- UUID v4 (ej: "550e8400-e29b-41d4-a716-446655440000")
  username TEXT UNIQUE NOT NULL,          -- Nombre de usuario (único, para login)
  password_hash TEXT NOT NULL,             -- Hash bcrypt de la contraseña
  email TEXT,                              -- Email (opcional)
  full_name TEXT,                          -- Nombre completo (opcional)
  role TEXT DEFAULT 'user',                -- 'user' o 'admin'
  is_active INTEGER DEFAULT 1,             -- 1 = activo, 0 = inactivo
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME                     -- Último inicio de sesión
);
```

**Campos clave:**
- `id`: UUID generado con librería `uuid` de Node.js
- `username`: Único, usado para login
- `password_hash`: Hash bcrypt con salt rounds 10
- `role`: Control de acceso (user/admin)

**Ejemplo de registro:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "jperez",
  "password_hash": "$2b$10$rOzJqK...",
  "email": "juan.perez@example.com",
  "full_name": "Juan Pérez",
  "role": "user",
  "is_active": 1,
  "created_at": "2024-01-15 10:30:00",
  "last_login": "2024-01-20 14:22:00"
}
```

---

#### 2. **Tabla: forms** (Metadata de los 15 formularios)

```sql
CREATE TABLE forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_number INTEGER UNIQUE NOT NULL,   -- 1 a 15 (número del formulario)
  title TEXT NOT NULL,                     -- Título del formulario
  description TEXT,                        -- Descripción opcional
  html_file_path TEXT,                     -- Ruta al archivo HTML original
  is_active INTEGER DEFAULT 1,             -- 1 = activo, 0 = desactivado
  order_index INTEGER,                     -- Orden de visualización (1-15)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Datos iniciales (Seed):**
```sql
INSERT INTO forms (form_number, title, description, order_index) VALUES
(1, 'Informe Policial Homologado (IPH2019)', 'Formulario principal', 1),
(2, 'Sección 2: Primer Respondiente', 'Datos del primer respondiente', 2),
(3, 'Apartado 4.2: Inspección del lugar', 'Inspección con croquis', 3),
(4, 'Sección 5: Narrativa de los Hechos', 'Narrativa detallada', 4),
(5, 'Anexo A: Detención(es)', 'Datos de detención', 5),
(6, 'Anexo A: Detención(es) - Continuación', 'Continuación detención', 6),
(7, 'Anexo A: Apartados 7 y 8', 'Apartados adicionales', 7),
(8, 'Anexo B', 'Anexo B', 8),
(9, 'Anexo C', 'Anexo C', 9),
(10, 'Anexo D: Inventario de Armas y Objetos', 'Inventario', 10),
(11, 'Anexo E', 'Anexo E', 11),
(12, 'Anexo E: Entrevistas', 'Entrevistas', 12),
(13, 'Anexo F', 'Anexo F', 13),
(14, 'Anexo F: Preservación del Lugar', 'Preservación', 14),
(15, 'Anexo G: Continuación de la Narrativa', 'Continuación narrativa', 15);
```

---

#### 3. **Tabla: user_responses** (Respuestas de los formularios)

```sql
CREATE TABLE user_responses (
  id TEXT PRIMARY KEY,                    -- UUID de la respuesta
  user_id TEXT NOT NULL,                  -- FK a users
  form_id INTEGER NOT NULL,               -- FK a forms (1-15)
  form_data TEXT NOT NULL,                -- JSON con todos los campos del formulario
  status TEXT DEFAULT 'draft',             -- 'draft', 'submitted', 'completed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,                   -- Fecha de envío (NULL si es draft)
  version INTEGER DEFAULT 1,               -- Versión (si se edita después de enviar)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES forms(id),
  UNIQUE(user_id, form_id)                -- Un usuario solo puede tener una respuesta por formulario
);
```

**Estructura de `form_data` (JSON):**

Cada formulario tiene una estructura JSON diferente. Ejemplos:

**Ejemplo 1: Formulario 1 (IPH Principal)**
```json
{
  "fecha_disposicion": "2024-01-15",
  "hora_disposicion": "14:30",
  "num_expediente": "EXP-2024-001",
  "disp_primer_apellido": "García",
  "disp_segundo_apellido": "López",
  "disp_nombres": "María",
  "disp_adscripcion": "Policía Municipal",
  "disp_cargo": "Oficial",
  "fiscal_primer_apellido": "Rodríguez",
  "fiscal_nombres": "Carlos",
  "anexos": {
    "A": true,
    "B": false,
    "C": true,
    "D": false
  }
}
```

**Ejemplo 2: Formulario 6 (Detención - Continuación)**
```json
{
  "informo_derechos": "si",
  "objetos_encontrados": "si",
  "pertenencias_recolectadas": "si",
  "pertenencias": [
    {
      "numero": 1,
      "pertenencia": "Teléfono celular",
      "descripcion": "iPhone 12, color negro",
      "destino": "Bodega de evidencias"
    },
    {
      "numero": 2,
      "pertenencia": "Llaves",
      "descripcion": "Llavero con 3 llaves",
      "destino": "Bodega de evidencias"
    }
  ],
  "mismo_lugar": "no",
  "lugar_calle": "Av. Principal",
  "lugar_num_exterior": "123",
  "lugar_codigo_postal": "12345",
  "lugar_colonia": "Centro",
  "lugar_municipio": "Ciudad",
  "lugar_entidad_federativa": "Estado de México"
}
```

**Ejemplo 3: Formulario 15 (Continuación Narrativa)**
```json
{
  "numero_pagina": 1,
  "total_paginas": 3,
  "tipo_continuacion": "hechos",
  "continuacion_narrativa": "P: ¿Qué ocurrió después?\nR: El sujeto intentó huir...",
  "resp_primer_apellido": "Martínez",
  "resp_nombres": "Luis",
  "resp_adscripcion": "Policía Estatal",
  "resp_cargo": "Agente"
}
```

**Ejemplo 4: Formulario 10 (Inventario de Armas)**
```json
{
  "armas": [
    {
      "numero": 1,
      "tipo": "Arma de fuego",
      "marca": "Glock",
      "modelo": "G19",
      "calibre": "9mm",
      "numero_serie": "ABC123",
      "descripcion": "Pistola semiautomática",
      "estado": "Buen estado",
      "ubicacion": "Bodega A"
    }
  ],
  "objetos": [
    {
      "numero": 1,
      "tipo": "Droga",
      "cantidad": "500 gramos",
      "descripcion": "Sustancia blanca en polvo",
      "ubicacion": "Bodega B"
    }
  ]
}
```

**Ejemplo 5: Formulario 3 (Inspección con Croquis)**
```json
{
  "coordenadas_latitud": "19.4326",
  "coordenadas_longitud": "-99.1332",
  "descripcion_lugar": "Casa habitación de dos pisos...",
  "croquis": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "observaciones": "Lugar preservado correctamente"
}
```

---

#### 4. **Tabla: user_progress** (Progreso de cada usuario)

```sql
CREATE TABLE user_progress (
  user_id TEXT PRIMARY KEY,               -- FK a users
  total_forms INTEGER DEFAULT 15,         -- Total de formularios (15)
  completed_forms INTEGER DEFAULT 0,      -- Formularios completados
  current_form INTEGER,                   -- Último formulario en el que trabajó (1-15)
  last_activity DATETIME,                 -- Última actividad (cualquier acción)
  started_at DATETIME,                    -- Fecha de inicio del cuestionario
  completed_at DATETIME,                   -- Fecha de completación (NULL si no completó)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Ejemplo de registro:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_forms": 15,
  "completed_forms": 8,
  "current_form": 9,
  "last_activity": "2024-01-20 15:30:00",
  "started_at": "2024-01-15 10:00:00",
  "completed_at": null
}
```

---

### Índices para Optimización

```sql
-- Índices principales (críticos para performance)
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX idx_user_responses_form_id ON user_responses(form_id);
CREATE INDEX idx_user_responses_status ON user_responses(status);
CREATE INDEX idx_user_responses_user_form ON user_responses(user_id, form_id);  -- Índice compuesto
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_forms_form_number ON forms(form_number);
CREATE INDEX idx_user_progress_completed ON user_progress(completed_at) WHERE completed_at IS NOT NULL;

-- Índices adicionales (opcionales, para queries específicas)
CREATE INDEX idx_user_responses_submitted ON user_responses(submitted_at) WHERE submitted_at IS NOT NULL;
CREATE INDEX idx_user_responses_updated ON user_responses(updated_at);
CREATE INDEX idx_users_last_login ON users(last_login);
```

**Justificación de índices:**
- `idx_user_responses_user_id`: Búsqueda rápida de todas las respuestas de un usuario
- `idx_user_responses_user_form`: Búsqueda rápida de respuesta específica (user + form)
- `idx_user_responses_status`: Filtrado por estado (draft/submitted/completed)
- `idx_users_username`: Login rápido por username
- `idx_user_progress_completed`: Estadísticas de usuarios que completaron

---

### Relaciones entre Tablas

```
users (1) ────< (N) user_responses
  │
  └─── (1) ────< (1) user_progress

forms (1) ────< (N) user_responses
```

**Cardinalidad:**
- Un usuario puede tener múltiples respuestas (una por formulario)
- Un formulario puede tener múltiples respuestas (una por usuario)
- Un usuario tiene un solo registro de progreso

---

### Queries Comunes

#### 1. Obtener todas las respuestas de un usuario
```sql
SELECT 
  ur.id,
  ur.form_id,
  f.title,
  ur.status,
  ur.updated_at,
  ur.submitted_at
FROM user_responses ur
JOIN forms f ON ur.form_id = f.id
WHERE ur.user_id = ?
ORDER BY f.order_index;
```

#### 2. Obtener respuesta específica de un usuario
```sql
SELECT form_data, status, updated_at
FROM user_responses
WHERE user_id = ? AND form_id = ?;
```

#### 3. Obtener progreso de un usuario
```sql
SELECT 
  up.completed_forms,
  up.total_forms,
  up.current_form,
  f.title as current_form_title
FROM user_progress up
LEFT JOIN forms f ON up.current_form = f.form_number
WHERE up.user_id = ?;
```

#### 4. Listar usuarios con su progreso (Admin)
```sql
SELECT 
  u.id,
  u.username,
  u.full_name,
  u.email,
  u.role,
  up.completed_forms,
  up.total_forms,
  up.last_activity,
  up.completed_at
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.is_active = 1
ORDER BY up.completed_forms DESC, u.created_at DESC;
```

#### 5. Estadísticas generales (Admin)
```sql
-- Total de usuarios
SELECT COUNT(*) as total_users FROM users WHERE is_active = 1;

-- Usuarios que completaron todos los formularios
SELECT COUNT(*) as completed_users 
FROM user_progress 
WHERE completed_forms = total_forms;

-- Formularios más completados
SELECT 
  f.form_number,
  f.title,
  COUNT(ur.id) as completados
FROM forms f
LEFT JOIN user_responses ur ON f.id = ur.form_id AND ur.status = 'completed'
GROUP BY f.id
ORDER BY completados DESC;
```

#### 6. Respuestas pendientes de un usuario
```sql
SELECT f.form_number, f.title
FROM forms f
WHERE f.is_active = 1
AND NOT EXISTS (
  SELECT 1 FROM user_responses ur
  WHERE ur.form_id = f.id 
  AND ur.user_id = ?
  AND ur.status = 'completed'
)
ORDER BY f.order_index;
```

---

### Consideraciones de Performance

**Tamaño estimado de datos:**
- `form_data` JSON promedio: ~5-50 KB por respuesta
- 100 usuarios × 15 formularios = 1,500 respuestas
- Tamaño estimado: ~75 MB - 750 MB (dependiendo del contenido)

**Optimizaciones:**
1. **Índices**: Ya creados arriba
2. **JSON parsing**: Parsear solo cuando sea necesario
3. **Lazy loading**: Cargar `form_data` solo cuando se visualiza
4. **Compresión**: Considerar comprimir JSON grandes (opcional)

**Límites SQLite:**
- Máximo tamaño de base de datos: 281 TB (suficiente)
- Máximo tamaño de fila: 1 GB (suficiente para JSON)
- Concurrencia: Hasta ~100 escritores simultáneos (suficiente para MVP)

---

### Migraciones y Versionado

**Estructura de migraciones (si usas Prisma/TypeORM):**

```sql
-- Migration 001: Crear tablas iniciales
-- (Ya definidas arriba)

-- Migration 002: Agregar campo si es necesario
ALTER TABLE users ADD COLUMN phone TEXT;

-- Migration 003: Agregar índices adicionales
CREATE INDEX idx_user_responses_updated ON user_responses(updated_at);
```

---

### Backup y Restauración

**Backup simple:**
```bash
# Copiar archivo
cp database.sqlite database_backup_$(date +%Y%m%d).sqlite

# O con SQLite
sqlite3 database.sqlite ".backup 'backup.sqlite'"
```

**Restauración:**
```bash
# Restaurar desde backup
cp database_backup_20240120.sqlite database.sqlite
```

---

### Validaciones a Nivel de BD

**Constraints importantes:**
- `UNIQUE(user_id, form_id)` en `user_responses`: Un usuario solo puede tener una respuesta por formulario
- `FOREIGN KEY` con `ON DELETE CASCADE`: Si se elimina un usuario, se eliminan sus respuestas y progreso
- `CHECK` constraints (opcional en SQLite):
  ```sql
  CHECK (form_number BETWEEN 1 AND 15),
  CHECK (status IN ('draft', 'submitted', 'completed')),
  CHECK (role IN ('user', 'admin'))
  ```

---

### Estructuras JSON Detalladas por Formulario

#### Formulario 1: IPH Principal
```json
{
  "seccion_1": {
    "fecha_disposicion": "2024-01-15",
    "hora_disposicion": "14:30",
    "num_expediente": "EXP-2024-001",
    "quien_realiza": {
      "primer_apellido": "García",
      "segundo_apellido": "López",
      "nombres": "María",
      "adscripcion": "Policía Municipal",
      "cargo": "Oficial"
    },
    "fiscal_recibe": {
      "primer_apellido": "Rodríguez",
      "segundo_apellido": "Pérez",
      "nombres": "Carlos"
    }
  },
  "anexos": {
    "A": true,
    "B": false,
    "C": true,
    "D": false,
    "E": false,
    "F": false,
    "G": false
  }
}
```

#### Formulario 2: Primer Respondiente
```json
{
  "primer_apellido": "Martínez",
  "segundo_apellido": "González",
  "nombres": "Luis",
  "cargo": "Agente",
  "institucion": "Policía Estatal",
  "entidad_federativa": "Estado de México",
  "municipio": "Toluca"
}
```

#### Formulario 3: Inspección del Lugar (con Croquis)
```json
{
  "coordenadas": {
    "latitud": "19.4326",
    "longitud": "-99.1332"
  },
  "descripcion_lugar": "Casa habitación de dos pisos, color blanco...",
  "croquis": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "observaciones": "Lugar preservado correctamente",
  "fecha_inspeccion": "2024-01-15",
  "hora_inspeccion": "15:00"
}
```

#### Formulario 4: Narrativa de los Hechos
```json
{
  "narrativa": "El día 15 de enero de 2024, aproximadamente a las 14:30 horas...",
  "caracteres": 1250,
  "fecha_narrativa": "2024-01-15"
}
```

#### Formulario 6: Detención - Continuación
```json
{
  "constancia_derechos": {
    "informo_derechos": "si",
    "firma_detenido": "data:image/png;base64,..."  // Si hay firma
  },
  "inspeccion": {
    "objetos_encontrados": "si",
    "pertenencias_recolectadas": "si",
    "pertenencias": [
      {
        "numero": 1,
        "pertenencia": "Teléfono celular",
        "descripcion": "iPhone 12, color negro",
        "destino": "Bodega de evidencias"
      },
      {
        "numero": 2,
        "pertenencia": "Llaves",
        "descripcion": "Llavero con 3 llaves",
        "destino": "Bodega de evidencias"
      }
    ]
  },
  "lugar_detencion": {
    "mismo_lugar": "no",
    "calle": "Av. Principal",
    "num_exterior": "123",
    "num_interior": "",
    "codigo_postal": "12345",
    "colonia": "Centro",
    "municipio": "Ciudad",
    "entidad_federativa": "Estado de México",
    "referencias": "Frente a la plaza principal"
  }
}
```

#### Formulario 10: Inventario de Armas y Objetos
```json
{
  "armas": [
    {
      "numero": 1,
      "tipo": "Arma de fuego",
      "marca": "Glock",
      "modelo": "G19",
      "calibre": "9mm",
      "numero_serie": "ABC123",
      "descripcion": "Pistola semiautomática",
      "estado": "Buen estado",
      "ubicacion": "Bodega A",
      "foto": "data:image/jpeg;base64,..."  // Opcional
    }
  ],
  "objetos": [
    {
      "numero": 1,
      "tipo": "Droga",
      "cantidad": "500 gramos",
      "descripcion": "Sustancia blanca en polvo",
      "ubicacion": "Bodega B"
    }
  ]
}
```

#### Formulario 12: Entrevistas
```json
{
  "numero_entrevista": "001",
  "reserva_datos": "no",
  "fecha_entrevista": "2024-01-16",
  "hora_entrevista": "10:00",
  "entrevistado": {
    "primer_apellido": "Sánchez",
    "segundo_apellido": "Ruiz",
    "nombres": "Ana",
    "calidad": "victima",  // victima, denunciante, testigo
    "nacionalidad": "mexicana",
    "sexo": "mujer",
    "fecha_nacimiento": "1990-05-15",
    "edad": "33",
    "documentos": ["credencial", "licencia"],
    "numero_identificacion": "ABC123456",
    "telefono": "5551234567",
    "correo": "ana@example.com",
    "direccion": {
      "calle": "Calle Principal",
      "num_exterior": "456",
      "codigo_postal": "12345",
      "colonia": "Centro",
      "municipio": "Ciudad",
      "entidad_federativa": "Estado de México"
    }
  },
  "transcripcion": "P: ¿Qué ocurrió?\nR: Estaba caminando cuando..."
}
```

#### Formulario 14: Preservación del Lugar
```json
{
  "acciones_preservacion": "Se colocó cinta de seguridad perimetral...",
  "solicito_apoyo": {
    "solicito": "si",
    "cual": "Servicio de peritos"
  },
  "ingreso_persona": {
    "ingreso": "si",
    "motivo": "Recolección de evidencias"
  },
  "personal_ingreso": [
    {
      "primer_apellido": "Torres",
      "nombres": "Roberto",
      "institucion": "Peritos",
      "cargo": "Perito"
    }
  ],
  "observaciones": "Lugar preservado correctamente",
  "entrega": {
    "quien_entrega": {
      "primer_apellido": "García",
      "nombres": "María",
      "institucion": "Policía",
      "cargo": "Oficial"
    },
    "quien_recibe": {
      "primer_apellido": "López",
      "nombres": "Juan",
      "institucion": "Fiscalía",
      "cargo": "Fiscal"
    },
    "fecha_entrega": "2024-01-16",
    "hora_entrega": "16:00"
  }
}
```

#### Formulario 15: Continuación de Narrativa
```json
{
  "pagina": {
    "numero_pagina": 1,
    "total_paginas": 3
  },
  "tipo_continuacion": "hechos",  // "hechos" o "entrevista"
  "continuacion_narrativa": "P: ¿Qué ocurrió después?\nR: El sujeto intentó huir...",
  "caracteres": 850,
  "respondiente": {
    "primer_apellido": "Martínez",
    "segundo_apellido": "",
    "nombres": "Luis",
    "adscripcion": "Policía Estatal",
    "cargo": "Agente"
  }
}
```

---

### Consideraciones de Almacenamiento JSON

**Tamaños estimados:**
- Formulario simple (texto): 1-5 KB
- Formulario con tablas: 5-15 KB
- Formulario con imágenes (croquis/firmas): 50-500 KB
- Promedio general: ~10-20 KB por respuesta

**Optimizaciones:**
1. **Comprimir imágenes**: Reducir calidad de croquis/firmas antes de guardar
2. **Lazy loading**: No cargar `form_data` completo en listados
3. **Índices JSON**: SQLite 3.38+ soporta índices JSON (opcional)

**Ejemplo de query con JSON (SQLite 3.38+):**
```sql
-- Buscar usuarios que mencionaron "arma" en cualquier formulario
SELECT DISTINCT user_id
FROM user_responses
WHERE json_extract(form_data, '$.armas') IS NOT NULL;
```

---

### Script de Inicialización Completo

```sql
-- 1. Crear tablas
-- (Ver definiciones arriba)

-- 2. Crear índices
-- (Ver índices arriba)

-- 3. Insertar formularios
INSERT INTO forms (form_number, title, description, order_index) VALUES
(1, 'Informe Policial Homologado (IPH2019)', 'Formulario principal', 1),
(2, 'Sección 2: Primer Respondiente', 'Datos del primer respondiente', 2),
(3, 'Apartado 4.2: Inspección del lugar', 'Inspección con croquis', 3),
(4, 'Sección 5: Narrativa de los Hechos', 'Narrativa detallada', 4),
(5, 'Anexo A: Detención(es)', 'Datos de detención', 5),
(6, 'Anexo A: Detención(es) - Continuación', 'Continuación detención', 6),
(7, 'Anexo A: Apartados 7 y 8', 'Apartados adicionales', 7),
(8, 'Anexo B', 'Anexo B', 8),
(9, 'Anexo C', 'Anexo C', 9),
(10, 'Anexo D: Inventario de Armas y Objetos', 'Inventario', 10),
(11, 'Anexo E', 'Anexo E', 11),
(12, 'Anexo E: Entrevistas', 'Entrevistas', 12),
(13, 'Anexo F', 'Anexo F', 13),
(14, 'Anexo F: Preservación del Lugar', 'Preservación', 14),
(15, 'Anexo G: Continuación de la Narrativa', 'Continuación narrativa', 15);

-- 4. Crear usuario admin de ejemplo (password: admin123)
INSERT INTO users (id, username, password_hash, full_name, role) VALUES
('admin-uuid-here', 'admin', '$2b$10$hashedpassword', 'Administrador', 'admin');

-- 5. Inicializar progreso para admin
INSERT INTO user_progress (user_id, total_forms, completed_forms) VALUES
('admin-uuid-here', 15, 0);
```

---

### Resumen de Estructura

**4 tablas principales:**
1. `users` - Usuarios del sistema
2. `forms` - Metadata de los 15 formularios
3. `user_responses` - Respuestas (JSON flexible)
4. `user_progress` - Progreso de cada usuario

**Características clave:**
- ✅ Estructura flexible con JSON para `form_data`
- ✅ Índices optimizados para queries comunes
- ✅ Relaciones con foreign keys y cascadas
- ✅ Constraints para integridad de datos
- ✅ Escalable hasta miles de usuarios
- ✅ Backup simple (copiar archivo)

---

## 🤔 ¿SQLite Relacional vs Base de Datos JSON (NoSQL)?

### Análisis Comparativo

#### **SQLite (Relacional) - Actual**

**Ventajas:**
- ✅ **Ligera y simple**: No requiere servidor, archivo único
- ✅ **Perfecta para MVP**: Cero configuración, fácil de desplegar
- ✅ **ACID completo**: Transacciones, integridad referencial
- ✅ **Queries relacionales**: JOINs, agregaciones, estadísticas fáciles
- ✅ **Validación**: Foreign keys, constraints, tipos de datos
- ✅ **JSON nativo**: SQLite 3.38+ soporta funciones JSON
- ✅ **Gratis**: Sin costo, sin límites de free tier
- ✅ **Backup simple**: Copiar un archivo

**Desventajas:**
- ⚠️ **JSON como TEXT**: Necesitas parsear manualmente
- ⚠️ **Queries JSON limitadas**: Aunque SQLite 3.38+ tiene soporte JSON básico
- ⚠️ **Escalabilidad**: Limitada a un servidor (suficiente para MVP)

**Ejemplo de query JSON en SQLite 3.38+:**
```sql
-- Buscar respuestas que contengan "arma" en el JSON
SELECT user_id, form_id
FROM user_responses
WHERE json_extract(form_data, '$.armas') IS NOT NULL;
```

---

#### **MongoDB / DocumentDB (NoSQL JSON)**

**Ventajas:**
- ✅ **JSON nativo**: Almacenamiento y queries JSON nativas
- ✅ **Flexibilidad total**: Cada documento puede tener estructura diferente
- ✅ **Queries JSON potentes**: Búsquedas complejas en documentos anidados
- ✅ **Escalabilidad horizontal**: Sharding, réplicas
- ✅ **Sin esquema**: Fácil agregar nuevos campos

**Desventajas:**
- ❌ **Más complejo**: Requiere servidor, configuración
- ❌ **No ACID completo**: Transacciones limitadas (aunque mejoró en versiones recientes)
- ❌ **Sin integridad referencial**: No hay foreign keys automáticas
- ❌ **Costo**: AWS DocumentDB tiene costo (no free tier generoso)
- ❌ **Overkill para MVP**: Demasiada complejidad para demostración

**Ejemplo en MongoDB:**
```javascript
// Buscar respuestas con armas
db.user_responses.find({
  "form_data.armas": { $exists: true, $ne: [] }
})

// Búsqueda anidada
db.user_responses.find({
  "form_data.pertenencias.pertenencia": "Teléfono"
})
```

---

### Recomendación para este MVP

#### **Mantener SQLite (Relacional) porque:**

1. **Es un MVP de demostración**
   - No necesitas escalabilidad masiva
   - Simplicidad > características avanzadas
   - SQLite maneja perfectamente cientos/miles de usuarios

2. **Los datos son principalmente relacionales**
   - `users`, `forms`, `user_progress` son tablas relacionales claras
   - Solo `form_data` es JSON flexible
   - Las queries más comunes son relacionales (progreso, listados, estadísticas)

3. **SQLite 3.38+ soporta JSON nativo**
   - Puedes hacer queries JSON si las necesitas
   - Mejor de ambos mundos: relacional + JSON cuando se necesita

4. **Costo y complejidad**
   - SQLite: $0, cero configuración
   - MongoDB/DocumentDB: Costo, servidor, configuración, mantenimiento

5. **Para MVP, las queries JSON complejas no son críticas**
   - La mayoría de queries son: "obtener respuesta de usuario X, formulario Y"
   - No necesitas búsquedas complejas en JSON para demostración

---

### Cuándo considerar cambiar a NoSQL

**Considera MongoDB/DocumentDB si:**
- ✅ Necesitas búsquedas complejas frecuentes dentro del JSON
- ✅ Tienes millones de documentos
- ✅ Necesitas escalabilidad horizontal
- ✅ El proyecto crece y necesitas más flexibilidad
- ✅ Tienes presupuesto para servidor de BD

**Para este MVP: NO es necesario**

---

### Híbrido: SQLite con JSON nativo (Mejor opción)

SQLite 3.38+ (2022) tiene soporte JSON completo:

```sql
-- Crear índice en campo JSON
CREATE INDEX idx_armas ON user_responses(
  json_extract(form_data, '$.armas')
);

-- Buscar en arrays JSON
SELECT * FROM user_responses
WHERE json_array_length(json_extract(form_data, '$.armas')) > 0;

-- Actualizar campo JSON
UPDATE user_responses
SET form_data = json_set(form_data, '$.status', 'completed')
WHERE id = 'xxx';

-- Agregaciones en JSON
SELECT 
  json_extract(form_data, '$.tipo_continuacion') as tipo,
  COUNT(*) as total
FROM user_responses
WHERE form_id = 15
GROUP BY tipo;
```

**Ventajas del híbrido:**
- ✅ Relacional para datos estructurados (users, forms, progress)
- ✅ JSON nativo para datos flexibles (form_data)
- ✅ Queries JSON cuando las necesites
- ✅ Sin costo adicional
- ✅ Sin servidor adicional

---

### Comparación Práctica

| Característica | SQLite | MongoDB | Recomendación MVP |
|---------------|--------|---------|-------------------|
| **Configuración** | Cero | Compleja | ✅ SQLite |
| **Costo** | $0 | $ (servidor) | ✅ SQLite |
| **Queries relacionales** | Excelente | Limitadas | ✅ SQLite |
| **Queries JSON** | Básicas (3.38+) | Avanzadas | ⚠️ SQLite suficiente |
| **Escalabilidad** | Un servidor | Horizontal | ✅ SQLite (MVP) |
| **ACID** | Completo | Limitado | ✅ SQLite |
| **Integridad referencial** | Sí | No | ✅ SQLite |
| **Backup** | Copiar archivo | Complejo | ✅ SQLite |
| **Deploy** | Incluir archivo | Servidor separado | ✅ SQLite |

---

### Conclusión

**Para este MVP: Mantén SQLite**

Razones:
1. Es suficiente para las necesidades del proyecto
2. Más simple de configurar y mantener
3. Sin costo adicional
4. Soporta JSON cuando lo necesites (SQLite 3.38+)
5. Las queries más comunes son relacionales
6. Perfecto para demostración

**Considera MongoDB/DocumentDB solo si:**
- El proyecto crece significativamente
- Necesitas búsquedas JSON muy complejas frecuentemente
- Tienes millones de documentos
- Tienes presupuesto y necesidad de escalabilidad horizontal

**Para MVP: SQLite es la mejor opción** ✅

### Notas sobre SQLite
- **Archivo único**: La base de datos es un solo archivo (ej: `database.sqlite`)
- **Sin servidor**: No requiere proceso de servidor separado
- **JSON**: Almacenar JSON como TEXT y parsear en la aplicación
- **UUID**: Usar TEXT para UUIDs (generar con librerías de Node.js)
- **Backup**: Simplemente copiar el archivo `.sqlite`
- **Límites**: Perfecta para hasta ~100K usuarios, suficiente para este proyecto

### ¿Por qué SQLite para este proyecto?

**Ventajas:**
- ✅ **Ligera**: No requiere servidor de base de datos separado
- ✅ **Fácil despliegue**: Solo incluir el archivo `.sqlite` con el backend
- ✅ **Rápida**: Muy rápida para lecturas/escrituras en aplicaciones pequeñas/medianas
- ✅ **Cero configuración**: No necesita instalación ni configuración de servidor
- ✅ **Portable**: El archivo se puede mover fácilmente
- ✅ **Suficiente**: Para cuestionarios con cientos/miles de usuarios es más que suficiente
- ✅ **Compatible**: Funciona perfectamente con TypeORM y Prisma

**Consideraciones:**
- ⚠️ **Concurrencia limitada**: Si tienes muchos usuarios escribiendo simultáneamente, PostgreSQL sería mejor
- ⚠️ **Tamaño**: Para proyectos muy grandes (>100GB), PostgreSQL es mejor opción
- ⚠️ **Backup**: Asegurar backups regulares del archivo `.sqlite`

**Para este proyecto específico:**
SQLite es perfecta porque:
- Los cuestionarios se completan de forma individual (no hay alta concurrencia)
- El volumen de datos es manejable (respuestas de formularios)
- Facilita el despliegue (un solo archivo)
- Reduce la complejidad de infraestructura

---

## 🔄 Flujo de Usuario Propuesto

### 1. **Login**
```
Usuario → Ingresa username/password → Backend valida → 
JWT token → Almacenado en dispositivo → Redirige a Dashboard
```

### 2. **Completar Formularios**
```
Dashboard → Selecciona formulario → Carga formulario HTML → 
Usuario completa campos → Auto-guardado cada X segundos → 
Validación → Enviar → Marca como completado → 
Siguiente formulario o Dashboard
```

### 3. **Ver Progreso**
```
Dashboard → Muestra lista de 15 formularios → 
Indicadores visuales (✓ completado, ⏳ en progreso, ⭕ pendiente) → 
Click en cualquier formulario → Carga estado guardado
```

### 4. **Panel Admin**
```
Admin login → Dashboard admin → Lista de usuarios → 
Click en usuario → Ver todos sus formularios → 
Ver respuestas específicas → Exportar datos
```

---

## 📐 Consideraciones de Diseño Responsive

### Responsive Design (Web)
- **Mobile-friendly**: Diseño responsive que funcione bien en dispositivos móviles (navegador)
- **Touch-friendly**: Botones grandes (mínimo 44x44px) para uso táctil
- **Formularios adaptativos**: 
  - Campos apilados verticalmente en móvil
  - Side-by-side en tablet/desktop
- **Navegación**: Menú hamburguesa en móvil, sidebar en desktop
- **Textareas**: Expandibles, con contador de caracteres visible

### Optimizaciones
- **Lazy loading**: Cargar formularios bajo demanda
- **Guardado local**: LocalStorage para borradores
- **Compresión**: Si hay firmas o imágenes
- **Caché**: Guardar formularios completados localmente

---

## 🔐 Seguridad

### Autenticación
- Passwords hasheados con bcrypt (salt rounds: 10-12)
- JWT con expiración corta (15-30 min)
- Refresh tokens con expiración larga (7-30 días)
- Rate limiting en endpoints de login

### Datos
- HTTPS obligatorio
- Validación de inputs (sanitización)
- SQL injection prevention (usar ORM/query builders)
- CORS configurado correctamente
- Headers de seguridad (Helmet.js)

### Permisos
- Roles: Admin, Usuario regular
- Middleware de autorización
- Validar que usuario solo vea sus propios datos (excepto admin)

---

## 🚀 Plan de Implementación MVP (Simplificado)

### Fase 1: Setup Base (3-5 días)
1. Configurar proyecto NestJS (backend)
2. Configurar proyecto React (frontend)
3. Setup base de datos SQLite
4. Configurar TypeORM/Prisma con SQLite
5. Sistema de autenticación básico (JWT simple, sin refresh)
6. Variables de entorno básicas
7. CORS configurado

### Fase 2: Formularios Core (1-2 semanas)
1. Parser básico de HTMLs (extraer campos principales)
2. Componentes básicos de formularios en React
3. Endpoints básicos: guardar/obtener respuestas
4. Guardado automático (draft) - cada 30 segundos
5. Validaciones básicas (solo campos requeridos)
6. Navegación secuencial entre formularios

### Fase 3: Dashboard y Progreso (2-3 días)
1. Dashboard simple con lista de 15 formularios
2. Indicador básico de progreso (X/15 completados)
3. Estados visuales (pendiente/completado)
4. Endpoint simple de progreso

### Fase 4: Panel Admin Básico (2-3 días)
1. Lista simple de usuarios
2. Ver respuestas de usuarios
3. **Omitir**: Filtros complejos, búsqueda avanzada, exportación (agregar después)

### Fase 5: Deploy y Ajustes (2-3 días)
1. Responsive básico (funciona en móvil)
2. Deploy a EC2 y S3
3. Corrección de bugs críticos
4. **Omitir**: Optimizaciones avanzadas, documentación extensa

**Total estimado MVP: 3-4 semanas** (vs 6-8 semanas versión completa)

---

## 🛠️ Herramientas Adicionales Recomendadas

### Desarrollo
- **TypeScript**: Para type safety (NestJS y React)
- **ESLint + Prettier**: Code quality y formato
- **Prisma Studio**: Para gestión visual de base de datos SQLite (si usas Prisma)
- **DB Browser for SQLite**: Herramienta visual alternativa para ver/editar SQLite

### Monitoreo
- **Sentry**: Error tracking (opcional)
- **Analytics**: Google Analytics o similar (opcional)
- **Logging**: Logger integrado de NestJS

### Documentación
- **API Docs**: Swagger/OpenAPI (integrado en NestJS)
- **README**: Instrucciones de setup
- **User Guide**: Manual de usuario

---

## 📊 Métricas a Considerar

- Tasa de completación (cuántos usuarios completan los 15 formularios)
- Tiempo promedio de completación
- Formularios más abandonados
- Errores más comunes
- Tiempo de carga de formularios
- Uso mobile vs desktop (navegador)

---

## ⚠️ Desafíos Identificados

1. **Parsing de HTMLs**: Extraer campos dinámicamente de los 15 HTMLs
2. **Firmas digitales**: Implementar captura de firma (canvas o librería)
3. **Tablas dinámicas**: Manejar tablas con filas variables
4. **Textareas grandes**: Narrativas extensas, optimizar guardado
5. **Sincronización offline**: Manejar conflictos cuando hay cambios offline
6. **Versionado**: Si un usuario edita después de enviar

---

## 💡 Recomendaciones Finales

1. **Empezar simple**: MVP con funcionalidad básica, luego iterar
2. **Responsive design**: Priorizar que funcione bien en móvil (navegador) desde el inicio
3. **Guardado local**: Guardar borradores en LocalStorage para no perder datos
4. **Validación temprana**: Validar campos mientras el usuario escribe (frontend y backend)
5. **Feedback constante**: Mostrar progreso y confirmaciones
6. **Backup automático**: Guardar borradores frecuentemente (cada X segundos)
7. **Exportación**: Permitir exportar respuestas (PDF/Excel) para respaldo
8. **NestJS modules**: Organizar código en módulos (auth, forms, users, admin)
9. **React components**: Crear componentes reutilizables para campos de formulario

---

## 📝 Notas Adicionales

- Los HTMLs actuales tienen JavaScript embebido que maneja localStorage
- Algunos formularios tienen funcionalidades especiales (canvas para croquis, toolbars)
- Migrar estos HTMLs a componentes React reutilizables
- Mantener la estructura visual similar para familiaridad del usuario
- NestJS permite estructura modular: crear módulos separados para auth, forms, users, admin
- Usar Guards de NestJS para proteger rutas según roles (usuario/admin)
- React Query útil para cache y sincronización de datos con el backend

---

## 🔧 Elementos Adicionales Necesarios (MVP - Priorización)

> **Nota MVP**: Este es un proyecto de demostración. Se priorizan funcionalidades esenciales y se omiten características avanzadas que no son críticas para el MVP.

### ✅ **ESENCIALES para MVP** (Implementar)

### 1. **Configuración Básica y Variables de Entorno** ⭐ CRÍTICO
**Simplificado para MVP:**
- Archivo `.env` básico con:
  - `JWT_SECRET`
  - `DATABASE_PATH`
  - `PORT`
  - `CORS_ORIGIN`
- Sin validación compleja, solo lo necesario

### 2. **Manejo Básico de Errores** ⭐ CRÍTICO
**Simplificado:**
- Try/catch básico en endpoints
- Mensajes de error simples
- Logging básico a consola (suficiente para MVP)
- **Omitir**: Logging estructurado, rotación de logs

### 3. **CORS Básico** ⭐ CRÍTICO
**Simplificado:**
```typescript
// Solo permitir origen del frontend
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
});
```
- **Omitir**: Headers de seguridad complejos (Helmet) por ahora

### 4. **Validación de Datos Básica** ⭐ CRÍTICO
**Simplificado:**
- Validación mínima en DTOs (solo campos requeridos)
- Validación básica en frontend con React Hook Form
- **Omitir**: Validación condicional compleja inicialmente

### 5. **Manejo de Archivos (Firmas)** ⭐ IMPORTANTE
**Simplificado:**
- Usar `react-signature-canvas` básico
- Guardar como base64 string en JSON
- **Omitir**: Subida a S3, compresión avanzada

### 6. **JWT Básico** ⭐ CRÍTICO
**Simplificado:**
- Solo access token (sin refresh token para MVP)
- Expiración: 24 horas (más simple)
- **Omitir**: Refresh tokens, invalidación avanzada

---

### ⚠️ **OPCIONALES para MVP** (Pueden omitirse)

### 7. **Recuperación de Contraseña** ❌ OMITIR en MVP
- No es crítico para demostración
- Se puede hacer manualmente si es necesario

### 8. **Rate Limiting** ❌ OMITIR en MVP
- No necesario para demostración
- Agregar solo si hay problemas de abuso

### 9. **Exportación de Datos** ⚠️ SIMPLIFICAR
**MVP simplificado:**
- Solo exportar a JSON (más simple)
- **Omitir**: CSV, Excel, PDF (agregar después si se necesita)

### 10. **Paginación** ⚠️ SIMPLIFICAR
**MVP:**
- Si hay pocos usuarios (<50), mostrar todos
- Agregar paginación solo si la lista es muy larga

### 11. **Backup Automático** ❌ OMITIR en MVP
- Backup manual es suficiente para demostración
- Agregar automático solo en producción real

### 12. **Health Checks** ❌ OMITIR en MVP
- No necesario para demostración

### 13. **Swagger/OpenAPI** ⚠️ OPCIONAL
- Útil pero no crítico
- Agregar solo si hay tiempo

### 14. **Compresión** ❌ OMITIR en MVP
- No crítico para pocos usuarios
- Agregar solo si hay problemas de performance

### 15. **Roles Avanzados** ⚠️ SIMPLIFICAR
**MVP:**
- Solo dos roles: `admin` y `user`
- Guards básicos
- **Omitir**: Permisos granulares

---

### 📋 **Checklist MVP Simplificado**

#### Backend (NestJS) - Mínimo Viable:
- [x] Autenticación básica (login/logout)
- [x] CRUD de usuarios
- [x] CRUD de formularios (metadata)
- [x] Guardar/obtener respuestas
- [x] Progreso de usuario
- [x] Panel admin básico (listar usuarios y respuestas)
- [x] Variables de entorno básicas
- [x] CORS configurado
- [x] Validación básica de datos
- [x] Manejo básico de errores

#### Frontend (React) - Mínimo Viable:
- [x] Login page
- [x] Dashboard con lista de formularios
- [x] Formularios funcionales (1-15)
- [x] Guardado automático (draft)
- [x] Indicador de progreso
- [x] Panel admin básico
- [x] Manejo básico de errores
- [x] Loading states básicos

#### Base de Datos:
- [x] SQLite con tablas básicas
- [x] Migraciones simples

#### Deploy:
- [x] EC2 con NestJS
- [x] S3 + CloudFront para frontend
- [x] Configuración básica

---

## 🔧 Elementos Adicionales Detallados (Referencia Futura)

### 1. **Configuración y Variables de Entorno** (Para referencia futura)

**Backend (NestJS):**
```env
# .env
NODE_ENV=development
PORT=3000
JWT_SECRET=tu-secret-super-seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=http://localhost:3000,https://tu-dominio.com
```

**Frontend (React):**
```env
# .env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

**Gestión:**
- Usar `@nestjs/config` para NestJS
- Validar variables de entorno al iniciar
- Diferentes archivos `.env` para dev/prod

### 2. **Manejo de Errores y Logging** (Para referencia futura)

**Backend:**
- **Exception Filters** de NestJS para manejo global de errores
- **Logger** integrado de NestJS con niveles (error, warn, log, debug)
- Logs estructurados (JSON) para producción
- Rotación de logs (usar `winston` o `pino` si necesitas más control)

**Frontend:**
- Error boundaries en React
- Manejo de errores de API (try/catch en servicios)
- Mensajes de error user-friendly
- Logging de errores a consola (y opcionalmente a servicio externo)

**Ejemplo de manejo:**
```typescript
// Backend: Exception Filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Log error
    // Return formatted error response
  }
}
```

### 3. **CORS y Seguridad HTTP**

**Configuración NestJS:**
```typescript
// main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
```

**Headers de seguridad:**
- Helmet.js para headers de seguridad
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

### 4. **Rate Limiting**

**Protección contra abuso:**
- `@nestjs/throttler` para rate limiting
- Límites por IP y por usuario
- Diferentes límites para login vs API general

**Configuración:**
```typescript
// 100 requests por minuto por IP
// 5 intentos de login por minuto
```

### 5. **Validación de Datos**

**Backend:**
- **class-validator** y **class-transformer** (incluidos en NestJS)
- DTOs (Data Transfer Objects) para validar requests
- Validación automática con ValidationPipe

**Frontend:**
- React Hook Form + Yup/Zod
- Validación en tiempo real
- Mensajes de error claros

### 6. **Manejo de Archivos (Firmas, Imágenes)**

**Firmas digitales:**
- Librería: `react-signature-canvas` o `signature_pad`
- Convertir canvas a base64 o blob
- Guardar como string en base de datos o archivo en S3

**Canvas de croquis (formulario 3.html):**
- Guardar canvas como imagen (PNG/JPEG)
- Almacenar en base64 en JSON o subir a S3
- Compresión antes de guardar

**Estructura:**
```typescript
// En form_data JSON
{
  "signature": "data:image/png;base64,iVBORw0KG...",
  "croquis": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### 7. **Sistema de Recuperación de Contraseña**

**Implementación:**
- Token de recuperación (UUID, expira en 1 hora)
- Tabla `password_reset_tokens` en SQLite
- Endpoint: `POST /auth/forgot-password`
- Endpoint: `POST /auth/reset-password`
- Email opcional (o mostrar token al admin)

**Flujo:**
1. Usuario solicita recuperación
2. Generar token y guardar en BD
3. Enviar token (email o mostrar en admin)
4. Usuario ingresa token + nueva contraseña
5. Validar y actualizar contraseña

### 8. **Exportación de Datos**

**Panel Admin:**
- **CSV**: Exportar todas las respuestas
- **Excel**: Usar librería como `exceljs`
- **PDF**: Generar reportes con `pdfkit` o `puppeteer`

**Endpoints:**
- `GET /admin/export/csv`
- `GET /admin/export/excel`
- `GET /admin/export/pdf/:userId`

**Filtros:**
- Por usuario
- Por rango de fechas
- Por estado (completado/pendiente)

### 9. **Gestión de Sesiones y Tokens**

**JWT Strategy:**
- Access token (corto, 15-30 min)
- Refresh token (largo, 7-30 días)
- Endpoint para refrescar token
- Invalidar tokens al logout

**Almacenamiento Frontend:**
- Access token: memoria o sessionStorage
- Refresh token: httpOnly cookie (más seguro) o localStorage

**Middleware:**
- Verificar token en cada request
- Renovar automáticamente si está por expirar

### 10. **Paginación y Filtros**

**Listas grandes:**
- Paginación en endpoints (limit/offset o cursor)
- Frontend: Componente de paginación
- Filtros en queries SQL

**Ejemplo:**
```typescript
// GET /admin/users?page=1&limit=10&search=nombre
// GET /responses?userId=xxx&status=completed&page=1
```

### 11. **Loading States y UX**

**Frontend:**
- Loading spinners durante requests
- Skeleton screens mientras carga
- Optimistic updates (actualizar UI antes de confirmar)
- Toast notifications para acciones (éxito/error)

**Librerías:**
- `react-hot-toast` o `react-toastify` para notificaciones
- Loading states con React Query

### 12. **Compresión y Optimización**

**Backend:**
- `compression` middleware en NestJS
- Comprimir respuestas JSON grandes
- Gzip/Brotli para responses

**Frontend:**
- Code splitting (React.lazy)
- Lazy loading de rutas
- Optimizar imágenes (si hay)
- Minificar en build

### 13. **Backup Automático de SQLite**

**Script de backup:**
- Cron job en EC2 (diario o cada X horas)
- Copiar `database.sqlite` a S3
- Retener últimos N backups
- Notificar si falla

**Implementación:**
```bash
# Cron: 0 2 * * * /path/to/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /app/database.sqlite /tmp/backup_$DATE.sqlite
aws s3 cp /tmp/backup_$DATE.sqlite s3://bucket/backups/
# Limpiar backups antiguos (mantener últimos 30 días)
```

### 14. **Health Checks y Monitoreo**

**Endpoints de salud:**
- `GET /health` - Estado del servidor
- `GET /health/db` - Estado de la base de datos
- Usar en load balancers o monitoreo

**Monitoreo básico:**
- Logs de errores
- Métricas básicas (requests/min, errores)
- Alertas si el servidor cae (opcional)

### 15. **Documentación de API**

**Swagger/OpenAPI:**
- Automático con `@nestjs/swagger`
- Documentar todos los endpoints
- Ejemplos de requests/responses
- Accesible en `/api/docs`

### 16. **Scripts de Utilidad**

**Desarrollo:**
- Script para seed de datos iniciales (usuarios, formularios)
- Script para migraciones de BD
- Script para reset de BD en desarrollo

**Producción:**
- Script de deploy
- Script de backup
- Script de restore

### 17. **Manejo de Timeouts**

**Backend:**
- Timeout para requests largos
- Timeout para queries de BD
- Manejar timeouts gracefully

**Frontend:**
- Timeout para requests API
- Retry automático en caso de fallo
- Mostrar mensaje si timeout

### 18. **Cache Headers**

**Frontend estático (S3/CloudFront):**
- Cache headers apropiados
- Invalidación de caché en nuevos deploys
- Versionado de assets

**API:**
- Cache headers para respuestas estáticas
- No cache para datos dinámicos

### 19. **Roles y Permisos**

**Sistema de roles:**
- Admin: Ver todo, exportar, gestionar usuarios
- Usuario: Solo ver/editar sus propios formularios
- Guards de NestJS para proteger rutas

**Implementación:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/users')
```

### 20. **Validación de Formularios Complejos**

**Campos condicionales:**
- Mostrar/ocultar campos según respuestas
- Validación condicional
- Dependencias entre campos

**Ejemplo:**
- Si "objetos_encontrados" = "Sí", mostrar tabla de objetos
- Validar que tabla tenga al menos una fila si se seleccionó "Sí"

---

## 📦 Dependencias MVP (Mínimas)

### Backend (NestJS) - Solo lo esencial
```json
{
  "@nestjs/config": "^3.0.0",        // Variables de entorno
  "class-validator": "^0.14.0",       // Validación básica
  "class-transformer": "^0.5.1",      // Transformación de datos
  "bcrypt": "^5.1.0",                 // Hash de passwords
  "@nestjs/jwt": "^10.0.0",           // JWT
  "passport": "^0.6.0",               // Autenticación
  "passport-jwt": "^4.0.1",           // JWT strategy
  "uuid": "^9.0.0"                    // Generar IDs
}
```

**Omitir en MVP:**
- `@nestjs/throttler` (rate limiting)
- `@nestjs/swagger` (documentación)
- `helmet` (headers de seguridad avanzados)
- `compression` (compresión)

### Frontend (React) - Solo lo esencial
```json
{
  "react-router-dom": "^6.0.0",       // Navegación
  "react-hook-form": "^7.45.0",       // Formularios
  "yup": "^1.3.0",                    // Validación
  "@tanstack/react-query": "^5.0.0",  // Estado y cache
  "axios": "^1.5.0",                  // HTTP client
  "react-signature-canvas": "^1.0.6"  // Firmas (si se necesita)
}
```

**Omitir en MVP:**
- `react-hot-toast` (usar alert básico)
- `zustand` (usar React Query + useState es suficiente)

---

**Fecha de Análisis**: 2024
**Versión**: 1.1
