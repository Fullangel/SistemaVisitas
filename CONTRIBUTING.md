# 🤝 Contribuir al Sistema Nacional de Visitas

¡Gracias por tu interés en contribuir al Sistema Nacional de Visitas! Este documento proporciona pautas y convenciones para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Estándares de Código](#estándares-de-código)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Reportar Problemas](#reportar-problemas)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Al contribuir a este proyecto, aceptas seguir nuestro Código de Conducta:

- Sé respetuoso y considerado con todos los colaboradores
- Acepta críticas constructivas con gracia
- Prioriza el bienestar de la comunidad
- Respeta diferentes puntos de vista y experiencias

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/sistema-visitas-nacional.git
cd sistema-visitas-nacional

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/usuario-original/sistema-visitas-nacional.git
```

### 2. Configura tu Entorno

Sigue las instrucciones en el [README.md](README.md) para configurar tu entorno de desarrollo.

### 3. Crea una Branch

```bash
git checkout -b feature/nombre-de-tu-caracteristica
# o
git checkout -b fix/descripcion-del-arreglo
```

### 4. Desarrolla tu Contribución

- Escribe código limpio y bien documentado
- Asegúrate de que pase todas las pruebas
- Sigue los estándares del proyecto

### 5. Commit tus Cambios

```bash
git add .
git commit -m "feat: agrega nueva funcionalidad de notificaciones

- Implementa sistema de notificaciones en tiempo real
- Agrega tests unitarios
- Actualiza documentación"
```

### 6. Push y Pull Request

```bash
git push origin feature/nombre-de-tu-caracteristica
```

Luego crea un Pull Request en GitHub.

## 📝 Estándares de Código

### Convenciones de Nomenclatura

#### Backend (Laravel/PHP)

```php
// Clases: PascalCase
class VisitController extends Controller

// Métodos: camelCase
public function createVisit(Request $request)

// Variables: camelCase
$visitStatus = 'pending';

// Constantes: UPPER_SNAKE_CASE
const MAX_VISITS_PER_DAY = 10;

// Base de datos: snake_case
Schema::create('visit_logs', function (Blueprint $table) {
    $table->id();
    $table->string('action_type');
    $table->timestamps();
});
```

#### Frontend (Vue.js/TypeScript)

```typescript
// Componentes: PascalCase
export default defineComponent({
  name: 'VisitForm'
})

// Composables: camelCase prefijado con 'use'
export function useVisitValidation() {
  // ...
}

// Variables y funciones: camelCase
const visitStatus = ref('pending')
const getVisitData = () => { /* ... */ }

// Constantes: UPPER_SNAKE_CASE
const API_ENDPOINTS = {
  VISITS: '/api/visits',
  USERS: '/api/users'
}

// Interfaces/types: PascalCase
interface VisitData {
  id: number;
  purpose: string;
  status: VisitStatus;
}
```

### Estructura de Archivos

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── VisitController.php
│   │   ├── Requests/
│   │   │   └── CreateVisitRequest.php
│   │   └── Resources/
│   │       └── VisitResource.php
│   ├── Models/
│   │   └── Visit.php
│   └── Services/
│       └── VisitService.php

frontend/
├── src/
│   ├── components/
│   │   └── visits/
│   │       ├── VisitForm.vue
│   │       └── VisitList.vue
│   ├── composables/
│   │   └── useVisit.ts
│   └── types/
│       └── visit.ts
```

### Documentación

- Documenta todas las funciones públicas
- Usa JSDoc para JavaScript/TypeScript
- Usa PHPDoc para PHP
- Mantén actualizado el README.md

```php
/**
 * Create a new visit
 *
 * @param CreateVisitRequest $request
 * @return JsonResponse
 * @throws ValidationException
 */
public function store(CreateVisitRequest $request): JsonResponse
{
    // ...
}
```

```typescript
/**
 * Validates visit form data
 * @param visitData - The visit data to validate
 * @returns Validation result with errors if any
 */
export function validateVisit(visitData: VisitFormData): ValidationResult {
  // ...
}
```

## 🔄 Flujo de Trabajo

### Antes de Comenzar

1. Actualiza tu repositorio local:
```bash
git fetch upstream
git checkout master
git merge upstream/master
```

2. Crea tu branch de feature:
```bash
git checkout -b feature/mi-nueva-funcionalidad
```

### Durante el Desarrollo

1. **Commits Atómicos**: Cada commit debe representar una unidad lógica de trabajo
2. **Mensajes Claros**: Usa mensajes de commit descriptivos
3. **Tests**: Asegúrate de que todas las pruebas pasen
4. **Documentación**: Actualiza la documentación según sea necesario

### Tipos de Commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, formato, etc)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Actualización de herramientas, configuraciones, etc

Ejemplos:
```
feat: agrega sistema de notificaciones push
fix: corrige error en validación de formularios
docs: actualiza README con nuevas instrucciones
test: agrega tests para VisitController
```

## 🐛 Reportar Problemas

Al reportar problemas, por favor incluye:

1. **Descripción clara del problema**
2. **Pasos para reproducir**
3. **Comportamiento esperado vs actual**
4. **Screenshots si aplica**
5. **Información del entorno**:
   - Sistema operativo
   - Versión de PHP/Node.js
   - Versión del proyecto
   - Configuración relevante

### Plantilla de Issue

```markdown
**Descripción del Bug**
Una descripción clara y concisa del problema.

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ir a '...'
2. Click en '....'
3. Scroll hasta '....'
4. Ver error

**Comportamiento Esperado**
Una descripción clara de lo que debería pasar.

**Screenshots**
Si aplica, agrega screenshots para explicar el problema.

**Entorno (por favor completa la información):**
- OS: [ej. Ubuntu 20.04]
- Navegador [ej. Chrome 96]
- Versión del Proyecto: [ej. 1.0.0]
- PHP: [ej. 8.1]
- Node.js: [ej. 18.0]

**Contexto Adicional**
Agrega cualquier otro contexto sobre el problema aquí.
```

## 💡 Sugerir Mejoras

Para sugerir mejoras:

1. **Verifica issues existentes** para evitar duplicados
2. **Describe claramente** la mejora propuesta
3. **Explica el beneficio** para los usuarios
4. **Considera la implementación** y posibles impactos

## 🧪 Testing

### Backend (Laravel)

```bash
cd backend

# Ejecutar todas las pruebas
php artisan test

# Ejecutar pruebas específicas
php artisan test --filter VisitTest

# Con coverage
php artisan test --coverage
```

### Frontend (Vue.js)

```bash
cd frontend

# Ejecutar pruebas unitarias
npm run test:unit

# Ejecutar pruebas E2E
npm run test:e2e

# Con coverage
npm run test:unit -- --coverage
```

## 📋 Checklist de Pull Request

Antes de enviar tu PR, asegúrate de:

- [ ] Tu código sigue los estándares del proyecto
- [ ] Has agregado tests para tu código
- [ ] Todos los tests existentes pasan
- [ ] Has actualizado la documentación
- [ ] Tu código está bien documentado
- [ ] Has probado manualmente tu código
- [ ] Tu branch está actualizada con master
- [ ] Tu PR tiene una descripción clara

## 🆘 Obtener Ayuda

Si necesitas ayuda:

1. **Revisa la documentación** en la carpeta `/docs`
2. **Busca en issues existentes**
3. **Crea un nuevo issue** con tu pregunta
4. **Únete a nuestra comunidad** (si aplica)

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones estarán bajo la misma licencia MIT que el proyecto.

---

**¡Gracias por contribuir al Sistema Nacional de Visitas! 🎉**