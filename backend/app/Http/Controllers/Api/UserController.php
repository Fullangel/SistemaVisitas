<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Headquarter;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Listar todos los usuarios
     */
    public function index(Request $request)
    {
        try {
            $query = User::with(['role', 'employee.department', 'employee.designation']);
            
            // Filtros de búsqueda
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%");
                });
            }
            
            if ($request->has('role_id')) {
                $query->where('role_id', $request->role_id);
            }
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            $users = $query->paginate($request->per_page ?? 15);
            
            return response()->json([
                'success' => true,
                'data' => $users
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Crear nuevo usuario
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {
            // Validación de datos
            $validated = $request->validate([
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'second_name' => 'nullable|string|max:100',
                'second_last_name' => 'nullable|string|max:100',
                'email' => 'required|string|email|max:191|unique:users',
                'username' => 'required|string|max:191|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:512',
                'identification' => 'required|string|max:50|unique:employees,identification',
                'birth_date' => 'required|date|before:today',
                'department_id' => 'required|exists:departments,id',
                'headquarters_id' => 'required|exists:headquarters,id',
                'role_id' => 'required|exists:roles,id',
                'status' => 'required|in:active,inactive'
            ]);
            
            // Crear el empleado primero
            $employee = Employee::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'identification' => $validated['identification'],
                'employee_code' => $this->generateEmployeeCode(),
                'department_id' => $validated['department_id'],
                'designation_id' => 1, // Default designation
                'status' => $validated['status'] === 'active'
            ]);
            
            // Crear el usuario
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'second_name' => $validated['second_name'] ?? null,
                'second_last_name' => $validated['second_last_name'] ?? null,
                'email' => $validated['email'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'birth_date' => $validated['birth_date'],
                'role_id' => $validated['role_id'],
                'status' => $validated['status'],
                'employee_id' => $employee->id
            ]);
            
            DB::commit();
            
            // Cargar relaciones
            $user->load(['role', 'employee.department', 'employee.designation']);
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => $user
            ], 201);
            
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mostrar usuario específico
     */
    public function show($id)
    {
        try {
            $user = User::with(['role', 'employee.department', 'employee.designation'])
                       ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $user
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * Actualizar usuario
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $user = User::with('employee')->findOrFail($id);
            
            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'second_name' => 'nullable|string|max:100',
                'second_last_name' => 'nullable|string|max:100',
                'email' => 'sometimes|string|email|max:191|unique:users,email,' . $id,
                'username' => 'sometimes|string|max:191|unique:users,username,' . $id,
                'phone' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:512',
                'identification' => 'sometimes|string|max:50|unique:employees,identification,' . $user->employee_id,
                'birth_date' => 'sometimes|date|before:today',
                'department_id' => 'sometimes|exists:departments,id',
                'headquarters_id' => 'sometimes|exists:headquarters,id',
                'role_id' => 'sometimes|exists:roles,id',
                'status' => 'sometimes|in:active,inactive'
            ]);
            
            // Actualizar empleado si existe
            if ($user->employee) {
                $employeeData = [];
                if (isset($validated['first_name'])) $employeeData['first_name'] = $validated['first_name'];
                if (isset($validated['last_name'])) $employeeData['last_name'] = $validated['last_name'];
                if (isset($validated['email'])) $employeeData['email'] = $validated['email'];
                if (isset($validated['phone'])) $employeeData['phone'] = $validated['phone'];
                if (isset($validated['identification'])) $employeeData['identification'] = $validated['identification'];
                if (isset($validated['department_id'])) $employeeData['department_id'] = $validated['department_id'];
                if (isset($validated['status'])) $employeeData['status'] = $validated['status'] === 'active';
                
                $user->employee->update($employeeData);
            }
            
            // Actualizar usuario
            $user->update($validated);
            
            DB::commit();
            
            $user->load(['role', 'employee.department', 'employee.designation']);
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $user
            ]);
            
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Eliminar usuario
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        
        try {
            $user = User::with('employee')->findOrFail($id);
            
            // No permitir eliminar el último administrador
            if ($user->role_id === 1) {
                $adminCount = User::where('role_id', 1)->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se puede eliminar el único administrador'
                    ], 400);
                }
            }
            
            // Eliminar empleado asociado
            if ($user->employee) {
                $user->employee->delete();
            }
            
            $user->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generar código de empleado único
     */
    private function generateEmployeeCode()
    {
        $lastEmployee = Employee::orderBy('id', 'desc')->first();
        $lastId = $lastEmployee ? $lastEmployee->id : 0;
        return 'EMP' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
    }
}