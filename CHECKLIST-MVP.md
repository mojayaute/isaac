# 📋 Checklist MVP - Lo que Falta

## ✅ **Completado**

- [x] Backend NestJS configurado y funcionando
- [x] Base de datos SQLite creada
- [x] Autenticación JWT funcionando
- [x] 15 formularios en base de datos
- [x] Usuarios creados (admin + nuevo_usuario)
- [x] Frontend React básico creado
- [x] Login page implementada
- [x] Dashboard básico con lista de formularios
- [x] Panel Admin básico
- [x] Estructura de carpetas completa
- [x] API services configurados
- [x] DB Browser instalado

---

## ❌ **Falta Implementar (Prioridad Alta)**

### 1. **Formularios Dinámicos** 🔴 CRÍTICO

**Estado actual:** `FormPage` solo muestra un placeholder

**Falta:**
- [ ] Convertir los 15 HTMLs a componentes React
- [ ] Crear componentes reutilizables de campos:
  - [ ] `FormField` (text, date, time, number)
  - [ ] `FormTextarea` (para narrativas)
  - [ ] `FormRadio` (Sí/No, opciones)
  - [ ] `FormCheckbox` (múltiples selecciones)
  - [ ] `FormTable` (tablas dinámicas como pertenencias)
  - [ ] `SignaturePad` (para firmas digitales)
- [ ] Cargar formulario según `form_number`
- [ ] Renderizar campos dinámicamente desde estructura JSON

**Archivos a crear:**
- `frontend/src/components/forms/FormField.tsx`
- `frontend/src/components/forms/FormTextarea.tsx`
- `frontend/src/components/forms/FormTable.tsx`
- `frontend/src/components/forms/SignaturePad.tsx`
- `frontend/src/data/forms-config.ts` (configuración de cada formulario)

---

### 2. **Guardado de Respuestas** 🔴 CRÍTICO

**Estado actual:** API lista, pero no se usa en frontend

**Falta:**
- [ ] Conectar formularios con `responsesApi.save()`
- [ ] Guardado automático (draft cada 30 segundos)
- [ ] Botón "Guardar" y "Enviar"
- [ ] Cargar respuesta guardada al abrir formulario
- [ ] Manejo de estados: draft/submitted/completed
- [ ] Feedback visual al guardar

**Archivos a modificar:**
- `frontend/src/pages/Form/FormPage.tsx` - Agregar lógica de guardado

---

### 3. **Navegación entre Formularios** 🟡 IMPORTANTE

**Estado actual:** Solo navegación básica

**Falta:**
- [ ] Botones "Anterior" / "Siguiente" en FormPage
- [ ] Validar antes de avanzar (opcional)
- [ ] Indicador "Formulario X de 15"
- [ ] Navegación secuencial (1→2→3...→15)

---

### 4. **Progreso Real** 🟡 IMPORTANTE

**Estado actual:** Dashboard muestra progreso, pero no se actualiza

**Falta:**
- [ ] Actualizar progreso cuando se completa un formulario
- [ ] Marcar formulario como "completado" al enviar
- [ ] Actualizar contador en tiempo real
- [ ] Mostrar estado correcto (pendiente/en progreso/completado)

**Archivos a modificar:**
- `frontend/src/pages/Dashboard/DashboardPage.tsx` - Mejorar lógica de progreso

---

### 5. **Panel Admin - Ver Respuestas** 🟡 IMPORTANTE

**Estado actual:** Solo lista usuarios

**Falta:**
- [ ] Click en "Ver Respuestas" muestra respuestas del usuario
- [ ] Modal o página para ver respuestas completas
- [ ] Visualizar JSON de `form_data` de forma legible
- [ ] Filtros por formulario
- [ ] Exportar respuestas (JSON/CSV) - opcional para MVP

**Archivos a modificar:**
- `frontend/src/pages/Admin/AdminPage.tsx` - Agregar funcionalidad

---

## ⚠️ **Mejoras Opcionales (Prioridad Media)**

### 6. **Validación de Formularios**
- [ ] Validar campos requeridos
- [ ] Mensajes de error claros
- [ ] Validación en tiempo real
- [ ] Prevenir envío si hay errores

### 7. **UX Mejorada**
- [ ] Loading states más claros
- [ ] Toast notifications (éxito/error)
- [ ] Confirmación antes de salir sin guardar
- [ ] Auto-guardado con indicador visual

### 8. **Manejo de Errores**
- [ ] Error boundaries en React
- [ ] Mensajes de error user-friendly
- [ ] Retry automático en caso de fallo

### 9. **Responsive Design**
- [ ] Ajustar formularios para móvil
- [ ] Navegación móvil mejorada
- [ ] Campos apilados en pantallas pequeñas

---

## 📝 **Tareas Técnicas Pendientes**

### Backend
- [ ] Validar que `formsApi.getById()` use `form_number` correctamente
- [ ] Agregar endpoint para obtener respuesta por `form_number` (no solo ID)
- [ ] Manejo de errores más robusto
- [ ] Validación de DTOs con class-validator

### Frontend
- [ ] Corregir `formsApi.getById()` - debería buscar por `form_number`
- [ ] Agregar manejo de errores en todas las queries
- [ ] Mejorar tipos TypeScript
- [ ] Agregar loading states consistentes

---

## 🎯 **Prioridades para MVP Funcional**

### Fase 1: Formularios Básicos (2-3 días)
1. ✅ Crear componente genérico de formulario
2. ✅ Implementar al menos 1 formulario completo (ej: Formulario 1)
3. ✅ Guardado básico funcionando
4. ✅ Cargar respuesta guardada

### Fase 2: Todos los Formularios (3-5 días)
1. ✅ Convertir los 15 HTMLs a componentes
2. ✅ Implementar todos los tipos de campos
3. ✅ Navegación entre formularios

### Fase 3: Completar Flujo (1-2 días)
1. ✅ Progreso actualizado correctamente
2. ✅ Panel admin funcional
3. ✅ Testing básico

---

## 🔧 **Problemas Conocidos**

1. **FormPage usa `getById()` pero debería usar `form_number`**
   - Actual: `formsApi.getById(formNumber)` 
   - Debería: `formsApi.getByFormNumber(formNumber)` o ajustar endpoint

2. **Dashboard no verifica correctamente formularios completados**
   - Lógica actual compara `completed_forms >= form_number` (incorrecto)
   - Debería verificar si existe respuesta con `status='completed'` para ese formulario

3. **No hay persistencia de userId en frontend**
   - Se obtiene en cada componente
   - Debería guardarse en contexto o estado global

---

## 📊 **Estimación de Tiempo**

- **Formularios básicos funcionando:** 2-3 días
- **Todos los formularios:** 3-5 días adicionales
- **Pulir y completar:** 1-2 días
- **Total MVP completo:** 6-10 días de desarrollo

---

## 🚀 **Siguiente Paso Recomendado**

**Implementar formulario básico funcional:**
1. Crear componente `FormField` genérico
2. Implementar Formulario 1 (IPH Principal) como ejemplo
3. Conectar guardado básico
4. Probar flujo completo: Login → Dashboard → Form → Guardar → Ver en BD

¿Empezamos con esto?
