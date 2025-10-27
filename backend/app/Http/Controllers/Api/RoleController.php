<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Listar todos los roles
     */
    public function index(Request $request)
    {
        try {
            $roles = Role::select('id', 'name', 'description', 'permissions')
                        ->withCount('users')
                        ->orderBy('name')
                        ->get();
            
            return response()->json([
                'success' => true,
                'data' => $roles
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mostrar rol específico
     */
    public function show($id)
    {
        try {
            $role = Role::with('permissions')
                       ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $role
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rol no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}