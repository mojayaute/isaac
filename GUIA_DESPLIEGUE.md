# Guía de Despliegue - IPH Sistema

Esta guía te ayudará a desplegar el proyecto usando **Vercel** (frontend) y **Railway/Render** (backend con SQLite).

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [Railway](https://railway.app) o [Render](https://render.com) (gratis)
- Proyecto en GitHub (recomendado)

---

## 🚀 Paso 1: Desplegar Backend en Railway

### Opción A: Railway (Recomendado)

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Inicia sesión con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Elige tu repositorio y la carpeta `backend`

3. **Configurar variables de entorno**
   - En el dashboard de Railway, ve a "Variables"
   - Agrega las siguientes variables:
     ```
     PORT=3000
     NODE_ENV=production
     DATABASE_PATH=/app/data/database.sqlite
     JWT_SECRET=tu-secret-super-seguro-generar-aleatorio
     JWT_EXPIRES_IN=24h
     CORS_ORIGIN=https://tu-frontend.vercel.app
     ```

4. **Configurar volumen persistente para SQLite**
   - En Railway, ve a "Settings" → "Volumes"
   - Crea un volumen en `/app/data`
   - Esto asegura que la base de datos persista

5. **Desplegar**
   - Railway detectará automáticamente el proyecto Node.js
   - Usará el `railway.json` o `nixpacks.toml` para construir
   - Espera a que el despliegue termine
   - Copia la URL del servicio (ej: `https://tu-backend.railway.app`)

### Opción B: Render

1. **Crear cuenta en Render**
   - Ve a https://render.com
   - Inicia sesión con GitHub

2. **Crear nuevo Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona la carpeta `backend`

3. **Configurar servicio**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: `Node`

4. **Configurar variables de entorno**
   - En "Environment Variables", agrega:
     ```
     NODE_ENV=production
     PORT=3000
     DATABASE_PATH=/opt/render/project/src/data/database.sqlite
     JWT_SECRET=tu-secret-super-seguro-generar-aleatorio
     JWT_EXPIRES_IN=24h
     CORS_ORIGIN=https://tu-frontend.vercel.app
     ```

5. **Configurar disco persistente**
   - En "Settings" → "Persistent Disk"
   - Crea un disco en `/opt/render/project/src/data`
   - Tamaño mínimo: 1GB

6. **Desplegar**
   - Click en "Create Web Service"
   - Espera a que termine el despliegue
   - Copia la URL del servicio

---

## 🎨 Paso 2: Desplegar Frontend en Vercel

1. **Crear cuenta en Vercel**
   - Ve a https://vercel.com
   - Inicia sesión con GitHub

2. **Importar proyecto**
   - Click en "Add New..." → "Project"
   - Conecta tu repositorio de GitHub
   - Selecciona la carpeta `frontend`

3. **Configurar proyecto**
   - **Framework Preset**: Vite (se detecta automáticamente)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `dist` (automático)

4. **Configurar variables de entorno**
   - En "Environment Variables", agrega:
     ```
     VITE_API_URL=https://tu-backend.railway.app
     ```
     (Reemplaza con la URL real de tu backend)

5. **Desplegar**
   - Click en "Deploy"
   - Espera a que termine el despliegue
   - Vercel te dará una URL (ej: `https://tu-proyecto.vercel.app`)

6. **Actualizar CORS en el backend**
   - Vuelve a Railway/Render
   - Actualiza la variable `CORS_ORIGIN` con la URL de Vercel
   - Reinicia el servicio

---

## 🔧 Paso 3: Configuración Adicional

### Inicializar Base de Datos

La base de datos se inicializará automáticamente en desarrollo. Para producción:

1. **Opción 1: Ejecutar seed manualmente**
   - Conecta a tu servicio Railway/Render
   - Ejecuta: `npm run start:prod` (el seed se ejecuta automáticamente si la BD está vacía)

2. **Opción 2: Usar migraciones**
   - Puedes crear un script de inicialización
   - Ejecutarlo una vez después del primer despliegue

### Verificar Despliegue

1. **Backend**
   - Visita: `https://tu-backend.railway.app` (debería mostrar un mensaje o error 404, lo cual es normal)
   - Prueba: `https://tu-backend.railway.app/forms` (debe requerir autenticación)

2. **Frontend**
   - Visita: `https://tu-proyecto.vercel.app`
   - Deberías ver la página de login
   - Prueba iniciar sesión con `admin` / `admin123`

---

## 🔐 Generar JWT_SECRET Seguro

Para generar un JWT_SECRET seguro, ejecuta:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

O usa un generador online: https://generate-secret.vercel.app/32

---

## 📝 Checklist de Despliegue

- [ ] Backend desplegado en Railway/Render
- [ ] Variables de entorno configuradas en backend
- [ ] Volumen/disco persistente configurado para SQLite
- [ ] Frontend desplegado en Vercel
- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] `CORS_ORIGIN` actualizado con URL de Vercel
- [ ] Base de datos inicializada
- [ ] Login funcionando
- [ ] Formularios accesibles

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm ci` se ejecute correctamente

### Error: "Database locked"
- SQLite puede tener problemas con múltiples conexiones
- Asegúrate de que solo hay una instancia del backend corriendo

### Error CORS
- Verifica que `CORS_ORIGIN` tenga la URL correcta de Vercel
- Asegúrate de incluir `https://` en la URL
- Reinicia el servicio después de cambiar CORS_ORIGIN

### Base de datos no persiste
- Verifica que el volumen/disco persistente esté configurado
- Asegúrate de que `DATABASE_PATH` apunte a la ruta del volumen

### Frontend no se conecta al backend
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que la URL del backend sea accesible
- Revisa la consola del navegador para errores

---

## 🔄 Actualizaciones Futuras

Para actualizar el proyecto:

1. **Hacer cambios en el código**
2. **Hacer commit y push a GitHub**
3. **Railway/Render y Vercel desplegarán automáticamente**

---

## 📞 Soporte

Si tienes problemas:
- Revisa los logs en Railway/Render
- Revisa los logs en Vercel
- Verifica las variables de entorno
- Consulta la documentación de cada plataforma

---

## 💰 Costos

- **Vercel**: Gratis (hasta cierto límite de tráfico)
- **Railway**: $5 de crédito gratis/mes (suficiente para MVP)
- **Render**: Gratis (con limitaciones de inactividad)

**Total estimado: $0-5/mes** para un MVP
