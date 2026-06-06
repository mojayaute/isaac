# Guía de Navegadores de Base de Datos para SQLite

## ✅ DB Browser for SQLite (Recomendado - Instalado)

**Características:**
- ✅ Gratis y open source
- ✅ Interfaz gráfica intuitiva
- ✅ Editar datos directamente
- ✅ Ejecutar queries SQL
- ✅ Ver estructura de tablas
- ✅ Exportar datos

**Cómo usar:**
1. Abre "DB Browser for SQLite" desde Aplicaciones
2. File → Open Database
3. Navega a: `backend/database.sqlite`
4. Click en pestaña "Browse Data" para ver datos
5. Click en pestaña "Execute SQL" para ejecutar queries

**Comandos útiles:**
- Ver tablas: Click en "Browse Data" → Selecciona tabla
- Ejecutar SQL: Pestaña "Execute SQL"
- Editar datos: Click derecho en fila → "Edit Record"

---

## Otras Opciones Disponibles

### 1. **TablePlus** (Premium, con versión gratuita)
- Interfaz moderna y elegante
- Soporta múltiples bases de datos
- Versión gratuita limitada

**Instalación:**
```bash
brew install --cask tableplus
```

### 2. **DBeaver** (Gratis)
- Muy completo y potente
- Soporta muchas bases de datos
- Interfaz más compleja

**Instalación:**
```bash
brew install --cask dbeaver-community
```

### 3. **SQLiteStudio** (Gratis)
- Específico para SQLite
- Multiplataforma
- Interfaz simple

**Instalación:**
```bash
brew install --cask sqlitestudio
```

### 4. **Base** (Gratis, macOS)
- Diseñado para macOS
- Interfaz nativa
- Simple y rápido

**Instalación:**
```bash
brew install --cask base
```

---

## Comparación Rápida

| Herramienta | Gratis | Interfaz | Complejidad | Recomendado |
|------------|--------|----------|-------------|-------------|
| **DB Browser** | ✅ | Buena | Simple | ⭐⭐⭐⭐⭐ |
| TablePlus | ⚠️ (limitado) | Excelente | Media | ⭐⭐⭐⭐ |
| DBeaver | ✅ | Buena | Compleja | ⭐⭐⭐ |
| SQLiteStudio | ✅ | Simple | Simple | ⭐⭐⭐ |
| Base | ✅ | Excelente | Simple | ⭐⭐⭐⭐ |

---

## Recomendación

**Para este proyecto: DB Browser for SQLite** es perfecto porque:
- ✅ Es gratis y completo
- ✅ Fácil de usar
- ✅ Específico para SQLite
- ✅ No requiere configuración

---

## Uso Rápido de DB Browser

1. **Abrir base de datos:**
   - File → Open Database
   - Selecciona: `backend/database.sqlite`

2. **Ver datos:**
   - Pestaña "Browse Data"
   - Selecciona tabla (users, forms, etc.)

3. **Ejecutar SQL:**
   - Pestaña "Execute SQL"
   - Escribe: `SELECT * FROM users;`
   - Click "Execute SQL"

4. **Editar datos:**
   - Browse Data → Click derecho en fila
   - "Edit Record" → Modifica → Save
