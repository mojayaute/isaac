# Frontend - Sistema IPH-DELITOS

Frontend del sistema de cuestionarios IPH-DELITOS desarrollado con React + TypeScript + Vite.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── forms/        # Componentes de formularios
│   ├── layout/       # Componentes de layout
│   └── ui/           # Componentes UI básicos
├── pages/            # Páginas/rutas
│   ├── Login/        # Página de login
│   ├── Dashboard/    # Dashboard principal
│   ├── Form/         # Página de formularios
│   └── Admin/        # Panel de administración
├── services/         # Servicios API
│   └── api.ts        # Configuración de axios y endpoints
├── hooks/            # Custom hooks
├── types/            # TypeScript types
│   └── index.ts      # Tipos principales
└── utils/            # Utilidades
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 📦 Dependencias Principales

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navegación
- **React Hook Form** - Manejo de formularios
- **React Query** - Estado y cache de datos
- **Axios** - HTTP client

## 🎯 Funcionalidades

- ✅ Login/Autenticación
- ✅ Dashboard con lista de formularios
- ✅ Progreso de usuario
- ✅ Panel de administración
- ✅ Rutas protegidas
- ✅ Manejo de errores

## 🔄 Próximos Pasos

- [ ] Implementar formularios dinámicos
- [ ] Guardado automático (draft)
- [ ] Validación de formularios
- [ ] Visualización de respuestas en admin
