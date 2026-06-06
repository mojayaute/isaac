# Guía de Despliegue en AWS - IPH Sistema

Esta guía te ayudará a desplegar el proyecto usando **AWS Free Tier**:
- **Frontend**: S3 + CloudFront (CDN)
- **Backend**: EC2 t2.micro (Free Tier)
- **Base de datos**: SQLite en EBS (volumen persistente)

## 📋 Requisitos Previos

- Cuenta en AWS (gratis)
- AWS CLI instalado y configurado (opcional pero recomendado)
- Acceso SSH a tu computadora
- Conocimiento básico de AWS

---

## 🚀 Paso 1: Preparar el Backend para EC2

### 1.1 Crear script de inicio para producción

El backend ya está configurado, pero necesitamos asegurar que funcione bien en EC2.

### 1.2 Crear usuario de sistema para Node.js (en EC2)

```bash
# Esto lo haremos después de crear la instancia EC2
```

---

## 🖥️ Paso 2: Crear Instancia EC2

### 2.1 Crear instancia EC2

1. **Ir a AWS Console** → **EC2** → **Launch Instance**

2. **Configurar instancia**:
   - **Name**: `iph-backend`
   - **AMI**: Amazon Linux 2023 (Free Tier eligible)
   - **Instance type**: `t2.micro` (Free Tier)
   - **Key pair**: Crear nueva o usar existente (necesario para SSH)
   - **Network settings**: 
     - Permitir tráfico HTTP (puerto 80)
     - Permitir tráfico HTTPS (puerto 443)
     - Permitir tráfico SSH (puerto 22)
     - Permitir tráfico personalizado TCP (puerto 3000)

3. **Storage**: 
   - 8 GB gp3 (Free Tier incluye 30 GB)
   - Esto es para el sistema operativo

4. **Launch Instance**

### 2.2 Crear volumen EBS para SQLite (persistencia)

1. **EC2** → **Volumes** → **Create Volume**
   - **Size**: 5 GB (suficiente para SQLite)
   - **Volume type**: gp3
   - **Availability Zone**: Misma que tu instancia EC2
   - **Create Volume**

2. **Adjuntar volumen a la instancia**:
   - Selecciona el volumen → **Actions** → **Attach Volume**
   - Selecciona tu instancia EC2
   - **Device name**: `/dev/sdf` (o similar)
   - **Attach**

### 2.3 Configurar Security Group

1. **EC2** → **Security Groups** → Selecciona el grupo de tu instancia
2. **Inbound rules** → **Edit inbound rules** → **Add rule**:
   - **Type**: Custom TCP
   - **Port**: 3000
   - **Source**: 0.0.0.0/0 (o restringir a tu IP)
   - **Description**: Backend API
   - **Save rules**

---

## 🔧 Paso 3: Configurar EC2 para el Backend

### 3.1 Conectarse a EC2 vía SSH

```bash
# Reemplaza con tu clave y IP
ssh -i tu-clave.pem ec2-user@tu-ip-publica-ec2
```

### 3.2 Instalar Node.js y dependencias

```bash
# Actualizar sistema
sudo yum update -y

# Instalar Node.js 18 (usando NodeSource)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2

# Instalar SQLite
sudo yum install -y sqlite
```

### 3.3 Montar volumen EBS para SQLite

```bash
# Verificar que el volumen está disponible
lsblk

# Formatear el volumen (solo la primera vez)
sudo mkfs -t ext4 /dev/xvdf

# Crear directorio para montar
sudo mkdir -p /mnt/database

# Montar volumen
sudo mount /dev/xvdf /mnt/database

# Verificar montaje
df -h

# Hacer el montaje permanente (agregar a /etc/fstab)
echo '/dev/xvdf /mnt/database ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab
```

### 3.4 Clonar y configurar el proyecto

```bash
# Instalar Git
sudo yum install -y git

# Clonar repositorio (o subir archivos vía SCP)
cd /home/ec2-user
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo/backend

# O subir archivos manualmente vía SCP desde tu máquina local:
# scp -i tu-clave.pem -r backend/ ec2-user@tu-ip:/home/ec2-user/

# Instalar dependencias
npm install

# Crear archivo .env
nano .env
```

**Contenido del `.env`**:
```env
PORT=3000
NODE_ENV=production
DATABASE_PATH=/mnt/database/database.sqlite
JWT_SECRET=tu-secret-super-seguro-generar-aleatorio
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://tu-dominio-cloudfront.cloudfront.net
```

### 3.5 Compilar y ejecutar con PM2

```bash
# Compilar proyecto
npm run build

# Iniciar con PM2
pm2 start dist/main.js --name iph-backend

# Configurar PM2 para iniciar automáticamente
pm2 startup
pm2 save

# Ver logs
pm2 logs iph-backend

# Verificar que está corriendo
pm2 status
```

### 3.6 Configurar Nginx como reverse proxy (opcional pero recomendado)

```bash
# Instalar Nginx
sudo yum install -y nginx

# Configurar Nginx
sudo nano /etc/nginx/conf.d/iph-backend.conf
```

**Contenido del archivo**:
```nginx
server {
    listen 80;
    server_name tu-ip-publica-ec2;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🌐 Paso 4: Desplegar Frontend en S3 + CloudFront

### 4.1 Crear bucket S3

1. **S3** → **Create bucket**
2. **Bucket name**: `iph-frontend-tu-nombre-unico` (debe ser único globalmente)
3. **Region**: Misma que EC2 (para reducir latencia)
4. **Block Public Access**: Desactivar (necesario para hosting estático)
5. **Bucket Versioning**: Opcional
6. **Create bucket**

### 4.2 Configurar bucket para hosting estático

1. **Seleccionar bucket** → **Properties** → **Static website hosting**
2. **Enable**:
   - **Index document**: `index.html`
   - **Error document**: `index.html` (para React Router)
3. **Save changes**

### 4.3 Configurar política del bucket

1. **Permissions** → **Bucket policy**
2. Agregar política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::iph-frontend-tu-nombre-unico/*"
    }
  ]
}
```

3. **Save changes**

### 4.4 Construir y subir frontend

**En tu máquina local**:

```bash
cd frontend

# Crear archivo .env.production
echo "VITE_API_URL=https://tu-ip-ec2:3000" > .env.production
# O mejor, usar la URL de CloudFront que crearemos después

# Construir proyecto
npm run build

# Instalar AWS CLI si no lo tienes
# macOS: brew install awscli
# Linux: sudo apt-get install awscli

# Configurar AWS CLI (solo primera vez)
aws configure
# Ingresa tus credenciales AWS

# Subir a S3
aws s3 sync dist/ s3://iph-frontend-tu-nombre-unico/ --delete
```

### 4.5 Crear CloudFront Distribution

1. **CloudFront** → **Create Distribution**

2. **Origin settings**:
   - **Origin Domain**: Selecciona tu bucket S3 (o usa el endpoint de website)
   - **Origin Path**: Dejar vacío
   - **Name**: Auto-generado

3. **Default Cache Behavior**:
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS
   - **Cache Policy**: CachingOptimized

4. **Settings**:
   - **Price Class**: Use Only North America and Europe (más barato)
   - **Alternate Domain Names (CNAMEs)**: Opcional (si tienes dominio)
   - **SSL Certificate**: Default CloudFront Certificate

5. **Create Distribution**

6. **Esperar** a que el estado sea "Deployed" (puede tardar 15-30 minutos)

7. **Copiar la URL de CloudFront** (ej: `https://d1234567890.cloudfront.net`)

### 4.6 Actualizar variables de entorno

**En EC2**:
```bash
# Actualizar CORS_ORIGIN en .env
nano .env
# Cambiar CORS_ORIGIN a la URL de CloudFront

# Reiniciar aplicación
pm2 restart iph-backend
```

**En tu máquina local (frontend)**:
```bash
# Actualizar .env.production con URL de CloudFront para el backend
# Si usas Nginx en EC2, usar la IP pública
# Si no, usar directamente la IP:3000
echo "VITE_API_URL=https://tu-ip-ec2" > frontend/.env.production

# Reconstruir y subir
cd frontend
npm run build
aws s3 sync dist/ s3://iph-frontend-tu-nombre-unico/ --delete
```

---

## 🔐 Paso 5: Configurar Dominio (Opcional)

### 5.1 Si tienes un dominio

1. **Route 53** → **Hosted Zones** → Crear zona
2. **CloudFront** → Agregar CNAME en la distribución
3. **Route 53** → Crear registro A (alias) apuntando a CloudFront

---

## 🔄 Paso 6: Automatizar Despliegues

### 6.1 Script de despliegue para frontend

Crear `deploy-frontend.sh`:

```bash
#!/bin/bash
cd frontend
npm run build
aws s3 sync dist/ s3://iph-frontend-tu-nombre-unico/ --delete
aws cloudfront create-invalidation --distribution-id TU-DISTRIBUTION-ID --paths "/*"
echo "✅ Frontend desplegado"
```

### 6.2 Script de despliegue para backend

Crear `deploy-backend.sh` (ejecutar en EC2):

```bash
#!/bin/bash
cd /home/ec2-user/tu-repo/backend
git pull
npm install
npm run build
pm2 restart iph-backend
echo "✅ Backend desplegado"
```

---

## 📊 Paso 7: Monitoreo y Logs

### 7.1 Ver logs del backend

```bash
# En EC2
pm2 logs iph-backend

# O ver logs en tiempo real
pm2 logs iph-backend --lines 100
```

### 7.2 CloudWatch (opcional)

- EC2 → **Monitoring** → Ver métricas
- CloudWatch → Crear alarmas si es necesario

---

## 💰 Costos Estimados (AWS Free Tier)

### Free Tier (12 meses)
- **EC2 t2.micro**: 750 horas/mes gratis
- **S3**: 5 GB almacenamiento gratis
- **CloudFront**: 50 GB transferencia gratis
- **EBS**: 30 GB almacenamiento gratis

### Después del Free Tier (estimado)
- **EC2 t2.micro**: ~$8-10/mes
- **S3**: ~$0.023/GB/mes (5 GB = ~$0.12/mes)
- **CloudFront**: ~$0.085/GB transferencia (primeros 10 TB)
- **EBS**: ~$0.10/GB/mes (5 GB = ~$0.50/mes)

**Total estimado**: ~$10-15/mes después del Free Tier

---

## 🐛 Solución de Problemas

### Backend no responde
```bash
# Verificar que PM2 está corriendo
pm2 status

# Ver logs
pm2 logs iph-backend

# Verificar puerto
sudo netstat -tlnp | grep 3000

# Reiniciar
pm2 restart iph-backend
```

### Base de datos no persiste
```bash
# Verificar que el volumen está montado
df -h

# Verificar permisos
ls -la /mnt/database/

# Si no está montado, montar de nuevo
sudo mount /dev/xvdf /mnt/database
```

### Frontend no carga
- Verificar que los archivos están en S3
- Verificar política del bucket
- Verificar que CloudFront está desplegado
- Limpiar caché de CloudFront (crear invalidación)

### CORS errors
- Verificar que `CORS_ORIGIN` en `.env` tiene la URL correcta de CloudFront
- Verificar que el backend está accesible desde el frontend

---

## 🔒 Seguridad Adicional

### 1. Restringir acceso SSH
- Usar Security Group para permitir solo tu IP
- Usar claves SSH en lugar de contraseñas

### 2. Firewall en EC2
```bash
# Configurar firewall (si es necesario)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### 3. Actualizar sistema regularmente
```bash
sudo yum update -y
```

---

## 📝 Checklist de Despliegue AWS

- [ ] Instancia EC2 creada (t2.micro)
- [ ] Volumen EBS creado y montado
- [ ] Node.js y PM2 instalados en EC2
- [ ] Backend clonado/configurado en EC2
- [ ] Variables de entorno configuradas
- [ ] Backend corriendo con PM2
- [ ] Security Group configurado (puerto 3000)
- [ ] Bucket S3 creado y configurado
- [ ] Frontend construido y subido a S3
- [ ] CloudFront distribution creada
- [ ] CORS_ORIGIN actualizado con URL de CloudFront
- [ ] Frontend accesible vía CloudFront
- [ ] Login funcionando

---

## 🚀 Comandos Rápidos de Referencia

```bash
# Conectarse a EC2
ssh -i tu-clave.pem ec2-user@tu-ip

# Ver estado PM2
pm2 status

# Reiniciar backend
pm2 restart iph-backend

# Ver logs
pm2 logs iph-backend

# Desplegar frontend (desde local)
cd frontend && npm run build && aws s3 sync dist/ s3://tu-bucket/ --delete

# Invalidar caché CloudFront
aws cloudfront create-invalidation --distribution-id TU-ID --paths "/*"
```

---

## 📞 Recursos Adicionales

- [AWS Free Tier](https://aws.amazon.com/free/)
- [EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

---

¡Listo! Tu aplicación debería estar funcionando en AWS. 🎉
