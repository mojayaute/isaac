# Cómo Visualizar la Base de Datos SQLite

## Opción 1: Script Node.js (Recomendado - Ya creado)

```bash
cd backend
node view-db.js
```

Muestra todas las tablas y sus datos en formato JSON.

---

## Opción 2: SQLite CLI (Línea de comandos)

Si tienes `sqlite3` instalado (ya lo tienes en macOS):

```bash
cd backend
sqlite3 database.sqlite
```

Dentro de SQLite CLI:

```sql
-- Ver todas las tablas
.tables

-- Ver estructura de una tabla
.schema users

-- Ver datos de una tabla
SELECT * FROM users;

-- Ver formularios
SELECT * FROM forms;

-- Ver respuestas
SELECT * FROM user_responses;

-- Salir
.quit
```

---

## Opción 3: DB Browser for SQLite (Herramienta Gráfica)

### Instalación en macOS:

```bash
# Con Homebrew
brew install --cask db-browser-for-sqlite

# O descargar desde:
# https://sqlitebrowser.org/
```

### Uso:
1. Abre DB Browser for SQLite
2. File → Open Database
3. Selecciona `backend/database.sqlite`
4. Navega por las tablas en la pestaña "Browse Data"

---

## Opción 4: Extensión VS Code

### SQLite Viewer (Recomendado)

1. Abre VS Code
2. Ve a Extensiones (Cmd+Shift+X)
3. Busca "SQLite Viewer" o "SQLite"
4. Instala la extensión
5. Click derecho en `database.sqlite` → "Open Database"

### Otras extensiones populares:
- **SQLite Viewer** (por qwtel)
- **SQLite** (por alexcvzz)

---

## Opción 5: Herramientas Online (No recomendado para producción)

- **sqliteviewer.com** - Sube el archivo y visualiza
- **inloop.github.io/sqlite-viewer** - Visualizador web

⚠️ **Nota**: No subas bases de datos con datos sensibles a servicios online.

---

## Comandos Útiles SQLite CLI

```bash
# Ver todas las tablas
sqlite3 database.sqlite ".tables"

# Ver estructura de tabla
sqlite3 database.sqlite ".schema users"

# Ver datos formateados
sqlite3 database.sqlite -header -column "SELECT * FROM users;"

# Contar registros
sqlite3 database.sqlite "SELECT COUNT(*) FROM forms;"

# Ver solo algunos campos
sqlite3 database.sqlite "SELECT id, username, role FROM users;"
```

---

## Resumen Rápido

**Más fácil**: `node view-db.js` (ya creado)  
**Más visual**: DB Browser for SQLite (instalar)  
**Más rápido**: SQLite CLI (ya tienes)  
**En VS Code**: Extensión SQLite Viewer
