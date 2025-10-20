# Guía de Desarrollo

## 📋 Índice

1. [Configuración del Entorno](#configuración-del-entorno)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Convenciones de Código](#convenciones-de-código)
4. [Flujo de Trabajo](#flujo-de-trabajo)
5. [Testing](#testing)
6. [Debugging](#debugging)
7. [Base de Datos](#base-de-datos)
8. [API Development](#api-development)
9. [Frontend Development](#frontend-development)
10. [Contribuir](#contribuir)

## 🛠️ Configuración del Entorno

### Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/sistema-visitas-nacional.git
cd sistema-visitas-nacional

# 2. Instalar dependencias
./scripts/install.sh

# 3. Iniciar servicios
./scripts/start.sh

# 4. Verificar instalación
./scripts/status.sh
```

### Herramientas Recomendadas

**Backend:**
- PHPStorm / VS Code
- PHP 8.3+
- Composer
- Xdebug (debugging)

**Frontend:**
- VS Code con extensiones Vue
- Vue DevTools (navegador)
- TypeScript 5.0+

**Base de Datos:**
- MySQL Workbench / DBeaver
- Redis Desktop Manager

**Utilidades:**
- Postman / Insomnia (API testing)
- GitKraken / Sourcetree (Git GUI)

### Variables de Entorno de Desarrollo

**Backend (.env)**
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

# Desarrollo
LOG_LEVEL=debug
TELESCOPE_ENABLED=true
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:8080

# Base de datos de desarrollo
DB_DATABASE=sistema_visitas_dev

# Redis sin contraseña (desarrollo)
REDIS_PASSWORD=null
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8080
VITE_APP_ENV=development
VITE_DEBUG=true
```

## 📁 Estructura del Proyecto

### Backend (Laravel)

```
backend/
├── app/
│   ├── Console/Commands/     # Comandos Artisan personalizados
│   ├── Http/
│   │   ├── Controllers/      # Controladores
│   │   ├── Middleware/       # Middleware personalizado
│   │   ├── Requests/         # Request validations
│   │   └── Resources/        # API Resources
│   ├── Models/               # Modelos Eloquent
│   ├── Services/             # Lógica de negocio
│   ├── Observers/            # Model observers
│   ├── Policies/             # Authorization policies
│   └── Logging/              # Log processors
├── config/                   # Archivos de configuración
├── database/
│   ├── migrations/           # Migraciones
│   ├── seeders/              # Seeders
│   └── factories/            # Model factories
├── routes/                   # Definición de rutas
├── storage/                  # Archivos y logs
└── tests/                    # Pruebas
```

### Frontend (Vue.js)

```
frontend/
├── src/
│   ├── components/           # Componentes Vue
│   │   ├── common/            # Componentes compartidos
│   │   ├── forms/             # Componentes de formularios
│   │   └── ui/                # Componentes de UI
│   ├── views/                # Vistas/páginas
│   ├── router/               # Configuración de rutas
│   ├── stores/               # Pinia stores
│   ├── services/             # Servicios API
│   ├── composables/          # Composition API functions
│   ├── utils/                # Utilidades
│   ├── types/                # Definiciones TypeScript
│   ├── assets/               # Assets estáticos
│   └── locales/              # Archivos de idioma
├── public/                   # Archivos públicos
└── tests/                    # Pruebas
```

## 📝 Convenciones de Código

### PHP (Laravel)

**Estilo de Código:**
```php
<?php

namespace App\Services;

use App\Models\Visit;
use Illuminate\Support\Facades\Cache;

class VisitService
{
    /**
     * Create a new visit with participants
     *
     * @param array $data
     * @return Visit
     */
    public function createVisit(array $data): Visit
    {
        return DB::transaction(function () use ($data) {
            $visit = Visit::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
            ]);

            // Create participants
            if (isset($data['participants'])) {
                foreach ($data['participants'] as $participant) {
                    $visit->participants()->create($participant);
                }
            }

            // Clear cache
            Cache::forget('visits.all');

            return $visit;
        });
    }
}
```

**Convenciones:**
- Usar PSR-12 para estilo de código
- Nombres de clases: PascalCase
- Nombres de métodos: camelCase
- Nombres de variables: camelCase
- Constantes: UPPER_SNAKE_CASE
- Comentarios PHPDoc para métodos públicos
- Type hints donde sea posible

### Vue.js / TypeScript

**Estilo de Código:**
```typescript
// composables/useVisit.ts
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import type { Visit, VisitForm } from '@/types/visit'

export function useVisit() {
  const notificationStore = useNotificationStore()
  const visits = ref<Visit[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasVisits = computed(() => visits.value.length > 0)

  const fetchVisits = async (filters: Record<string, any> = {}): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await visitService.getVisits(filters)
      visits.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      notificationStore.error('Error al cargar visitas')
    } finally {
      loading.value = false
    }
  }

  const createVisit = async (form: VisitForm): Promise<void> => {
    loading.value = true
    
    try {
      const newVisit = await visitService.createVisit(form)
      visits.value.unshift(newVisit)
      notificationStore.success('Visita creada exitosamente')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear visita'
      notificationStore.error('Error al crear visita')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    visits: readonly(visits),
    loading: readonly(loading),
    error: readonly(error),
    hasVisits,
    fetchVisits,
    createVisit
  }
}
```

**Convenciones:**
- Usar Composition API
- TypeScript para todo el código
- Nombres de componentes: PascalCase
- Nombres de composables: camelCase con prefijo 'use'
- Nombres de stores: camelCase con sufijo 'Store'
- Props tipadas con TypeScript
- Usar `readonly()` para prevenir mutaciones

## 🔄 Flujo de Trabajo

### Git Flow

```bash
# 1. Crear feature branch
git checkout -b feature/visit-approval

# 2. Desarrollar y commitear
git add .
git commit -m "feat: add visit approval workflow

- Add approval status to visits
- Create approval notification system
- Add approval history tracking"

# 3. Push y crear PR
git push origin feature/visit-approval
```

### Convenciones de Commits

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Estructura de PR

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Pruebas unitarias agregadas
- [ ] Pruebas de integración agregadas
- [ ] Pruebas manuales realizadas

## Screenshots
[Si aplica, agregar screenshots]

## Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Self-review completado
- [ ] Documentación actualizada
```

## 🧪 Testing

### Backend (PHPUnit)

```php
// tests/Feature/VisitTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Visit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VisitTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function user_can_create_visit()
    {
        $visitData = [
            'title' => 'Test Visit',
            'description' => 'Test Description',
            'start_date' => now()->addDays(7)->format('Y-m-d'),
            'end_date' => now()->addDays(10)->format('Y-m-d'),
            'institution_id' => 1,
            'participants' => [
                [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'role' => 'Minister'
                ]
            ]
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/visits', $visitData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'visit' => [
                        'id', 'title', 'description', 'participants'
                    ]
                ]
            ]);

        $this->assertDatabaseHas('visits', [
            'title' => 'Test Visit'
        ]);
    }
}
```

**Ejecutar pruebas:**
```bash
# Todas las pruebas
docker-compose exec backend php artisan test

# Pruebas específicas
docker-compose exec backend php artisan test --filter VisitTest

# Con coverage
docker-compose exec backend php artisan test --coverage
```

### Frontend (Vitest)

```typescript
// tests/components/VisitForm.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VisitForm from '@/components/forms/VisitForm.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('VisitForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(VisitForm)
    expect(wrapper.text()).toContain('Crear Nueva Visita')
  })

  it('validates required fields', async () => {
    const wrapper = mount(VisitForm)
    
    // Submit form without data
    await wrapper.find('form').trigger('submit.prevent')
    
    // Check for validation errors
    expect(wrapper.text()).toContain('El título es requerido')
    expect(wrapper.text()).toContain('La fecha de inicio es requerida')
  })

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn()
    const wrapper = mount(VisitForm, {
      props: {
        onSubmit: mockSubmit
      }
    })
    
    // Fill form
    await wrapper.find('input[name="title"]').setValue('Test Visit')
    await wrapper.find('textarea[name="description"]').setValue('Test Description')
    await wrapper.find('input[name="start_date"]').setValue('2024-02-15')
    await wrapper.find('input[name="end_date"]').setValue('2024-02-16')
    
    // Submit
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Visit',
      description: 'Test Description',
      start_date: '2024-02-15',
      end_date: '2024-02-16'
    })
  })
})
```

**Ejecutar pruebas:**
```bash
# Todas las pruebas
docker-compose exec frontend npm test

# Pruebas específicas
docker-compose exec frontend npm test VisitForm

# Modo watch
docker-compose exec frontend npm test:watch

# Coverage
docker-compose exec frontend npm test:coverage
```

## 🐛 Debugging

### Backend Debugging

**Xdebug Configuration:**
```ini
# docker/php/xdebug.ini
xdebug.mode=debug,develop
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
xdebug.start_with_request=yes
xdebug.idekey=VISITAS
```

**Laravel Telescope (Desarrollo):**
```bash
# Instalar Telescope
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Acceder: http://localhost:8080/telescope
```

**Logs de Laravel:**
```bash
# Ver logs en tiempo real
./scripts/logs.sh backend

# Logs específicos
docker-compose exec backend tail -f storage/logs/laravel.log

# Logs con filtro
docker-compose exec backend grep "ERROR" storage/logs/laravel.log
```

### Frontend Debugging

**Vue DevTools:**
```bash
# Instalar extensión del navegador
# Chrome: Vue.js devtools
# Firefox: Vue DevTools
```

**Console Debugging:**
```typescript
// Debug con etiquetas
console.group('🔄 Visit Creation')
console.log('Form data:', formData)
console.log('Validation:', validation)
console.log('API Response:', response)
console.groupEnd()

// Debug condicional
const DEBUG = import.meta.env.VITE_DEBUG === 'true'
if (DEBUG) {
  console.table(visits.value)
}
```

**Network Debugging:**
```typescript
// Interceptor de axios
import axios from 'axios'

if (import.meta.env.VITE_DEBUG === 'true') {
  axios.interceptors.request.use(config => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
    console.log('📤 Request Data:', config.data)
    return config
  })

  axios.interceptors.response.use(
    response => {
      console.log('✅ API Response:', response.status, response.config.url)
      console.log('📥 Response Data:', response.data)
      return response
    },
    error => {
      console.error('❌ API Error:', error.response?.status, error.config.url)
      console.error('📄 Error Details:', error.response?.data)
      return Promise.reject(error)
    }
  )
}
```

## 🗄️ Base de Datos

### Migraciones

```bash
# Crear nueva migración
docker-compose exec backend php artisan make:migration add_approval_fields_to_visits

# Ejecutar migraciones
docker-compose exec backend php artisan migrate

# Rollback
docker-compose exec backend php artisan migrate:rollback

# Ver estado
docker-compose exec backend php artisan migrate:status
```

**Ejemplo de Migración:**
```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->string('approval_status')->default('pending')->after('status');
            $table->timestamp('approved_at')->nullable()->after('approval_status');
            $table->foreignId('approved_by')->nullable()->constrained('users')->after('approved_at');
            $table->text('approval_notes')->nullable()->after('approved_by');
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['approval_status', 'approved_at', 'approved_by', 'approval_notes']);
        });
    }
};
```

### Seeders

```bash
# Crear seeder
docker-compose exec backend php artisan make:seeder VisitSeeder

# Ejecutar seeders
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan db:seed --class=VisitSeeder
```

### Factories

```php
use Illuminate\Database\Eloquent\Factories\Factory;

class VisitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'start_date' => fake()->dateTimeBetween('+1 week', '+2 weeks'),
            'end_date' => fake()->dateTimeBetween('+2 weeks', '+3 weeks'),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'institution_id' => Institution::factory(),
        ];
    }

    public function approved(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => User::factory(),
            ];
        });
    }
}
```

## 🔌 API Development

### Crear Endpoint

```bash
# 1. Crear controlador
docker-compose exec backend php artisan make:controller Api/VisitApprovalController --api

# 2. Crear request
docker-compose exec backend php artisan make:request ApproveVisitRequest

# 3. Crear resource
docker-compose exec backend php artisan make:resource VisitResource
```

**Ejemplo Completo:**
```php
// app/Http/Controllers/Api/VisitApprovalController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApproveVisitRequest;
use App\Http\Resources\VisitResource;
use App\Models\Visit;
use App\Services\VisitService;
use Illuminate\Http\JsonResponse;

class VisitApprovalController extends Controller
{
    public function __construct(
        private readonly VisitService $visitService
    ) {}

    public function approve(ApproveVisitRequest $request, Visit $visit): JsonResponse
    {
        $this->authorize('approve', $visit);

        $visit = $this->visitService->approveVisit(
            $visit,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => [
                'visit' => new VisitResource($visit)
            ],
            'message' => __('Visit approved successfully')
        ]);
    }
}
```

## 🎨 Frontend Development

### Crear Componente

```bash
# Componente básico
echo '<template>
  <div class="visit-card">
    <h3>{{ visit.title }}</h3>
    <p>{{ visit.description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Visit } from \'@/types/visit\'

interface Props {
  visit: Visit
}

defineProps<Props>()
</script>

<style scoped>
.visit-card {
  @apply p-4 bg-white rounded-lg shadow;
}
</style>' > frontend/src/components/VisitCard.vue
```

### Crear Store

```typescript
// stores/visitStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Visit } from '@/types/visit'
import { visitService } from '@/services/visitService'

export const useVisitStore = defineStore('visit', () => {
  const visits = ref<Visit[]>([])
  const currentVisit = ref<Visit | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const pendingVisits = computed(() => 
    visits.value.filter(v => v.status === 'pending')
  )

  const approvedVisits = computed(() => 
    visits.value.filter(v => v.status === 'approved')
  )

  // Actions
  async function fetchVisits(filters = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await visitService.getVisits(filters)
      visits.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveVisit(visitId: number, notes: string) {
    const visit = visits.value.find(v => v.id === visitId)
    if (!visit) throw new Error('Visit not found')

    const updatedVisit = await visitService.approveVisit(visitId, { notes })
    
    // Update local state
    const index = visits.value.findIndex(v => v.id === visitId)
    if (index !== -1) {
      visits.value[index] = updatedVisit
    }
  }

  return {
    // State
    visits: readonly(visits),
    currentVisit: readonly(currentVisit),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    pendingVisits,
    approvedVisits,
    
    // Actions
    fetchVisits,
    approveVisit
  }
})
```

### Estilos con Tailwind

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Gestión de Visitas
          </h2>
          <p class="mt-1 text-sm text-gray-600">
            Administra y supervisa las visitas institucionales
          </p>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <VisitList 
            :visits="visits"
            :loading="loading"
            @approve="handleApprove"
            @reject="handleReject"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVisitStore } from '@/stores/visitStore'
import VisitList from '@/components/VisitList.vue'

const visitStore = useVisitStore()
const { visits, loading } = storeToRefs(visitStore)

const handleApprove = async (visitId: number) => {
  try {
    await visitStore.approveVisit(visitId, 'Approved by admin')
  } catch (error) {
    console.error('Error approving visit:', error)
  }
}
</script>
```

## 🤝 Contribuir

### Proceso de Contribución

1. **Fork y Clone**
   ```bash
   git clone https://github.com/tu-usuario/sistema-visitas-nacional.git
   cd sistema-visitas-nacional
   ```

2. **Crear Feature Branch**
   ```bash
   git checkout -b feature/tu-nueva-funcionalidad
   ```

3. **Desarrollar**
   - Seguir convenciones de código
   - Agregar tests
   - Actualizar documentación

4. **Testing**
   ```bash
   # Backend
   docker-compose exec backend php artisan test
   
   # Frontend
   docker-compose exec frontend npm test
   ```

5. **Commit y Push**
   ```bash
   git add .
   git commit -m "feat: add nueva funcionalidad"
   git push origin feature/tu-nueva-funcionalidad
   ```

6. **Crear Pull Request**
   - Usar plantilla de PR
   - Describir cambios
   - Agregar screenshots si aplica

### Checklist de Contribución

- [ ] Código sigue convenciones del proyecto
- [ ] Tests agregados y pasando
- [ ] Documentación actualizada
- [ ] No hay código comentado
- [ ] No hay console.logs
- [ ] Variables de entorno documentadas
- [ ] Migrations creadas si hay cambios DB
- [ ] Seeders actualizados si aplica

### Reportar Bugs

**Template de Bug Report:**
```markdown
**Descripción del Bug**
Descripción clara y concisa del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Click en '....'
3. Scroll hasta '....'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que debería pasar.

**Screenshots**
Si aplica, agregar screenshots.

**Entorno:**
 - OS: [ej. Ubuntu 20.04]
 - Navegador: [ej. Chrome 96]
 - Versión: [ej. 1.0.0]

**Contexto Adicional**
Agregar cualquier otro contexto.
```

---

**📞 Soporte de Desarrollo:**
- **Email:** dev@visitas-nacional.gob
- **Slack:** #sistema-visitas-dev
- **Daily Standup:** 9:00 AM (GMT-5)