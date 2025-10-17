<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Headquarter;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::with('headquarter');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->has('headquarter_id')) {
            $query->where('headquarter_id', $request->headquarter_id);
        }

        $departments = $query->paginate(20);

        return response()->json([
            'data' => $departments->items(),
            'total' => $departments->total(),
            'per_page' => $departments->perPage(),
            'current_page' => $departments->currentPage(),
            'last_page' => $departments->lastPage()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:10|unique:departments,code',
            'headquarter_id' => 'required|exists:headquarters,id'
        ]);

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Departamento creado exitosamente',
            'data' => $department->load('headquarter')
        ], 201);
    }

    public function show($id)
    {
        $department = Department::with(['headquarter', 'employees'])->findOrFail($id);

        return response()->json([
            'data' => $department
        ]);
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'code' => 'sometimes|required|string|max:10|unique:departments,code,' . $id,
            'headquarter_id' => 'sometimes|required|exists:headquarters,id'
        ]);

        $department->update($validated);

        return response()->json([
            'message' => 'Departamento actualizado exitosamente',
            'data' => $department->load('headquarter')
        ]);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        
        if ($department->employees()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el departamento porque tiene empleados asociados'
            ], 422);
        }

        if ($department->visits()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el departamento porque tiene visitas asociadas'
            ], 422);
        }

        $department->delete();

        return response()->json([
            'message' => 'Departamento eliminado exitosamente'
        ]);
    }
}
