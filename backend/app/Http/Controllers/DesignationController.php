<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    public function index(Request $request)
    {
        $query = Designation::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $designations = $query->paginate(20);

        return response()->json([
            'data' => $designations->items(),
            'total' => $designations->total(),
            'per_page' => $designations->perPage(),
            'current_page' => $designations->currentPage(),
            'last_page' => $designations->lastPage()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'status' => 'boolean'
        ]);

        $designation = Designation::create($validated);

        return response()->json([
            'message' => 'Cargo creado exitosamente',
            'data' => $designation
        ], 201);
    }

    public function show($id)
    {
        $designation = Designation::with('employees')->findOrFail($id);

        return response()->json([
            'data' => $designation
        ]);
    }

    public function update(Request $request, $id)
    {
        $designation = Designation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'status' => 'boolean'
        ]);

        $designation->update($validated);

        return response()->json([
            'message' => 'Cargo actualizado exitosamente',
            'data' => $designation
        ]);
    }

    public function destroy($id)
    {
        $designation = Designation::findOrFail($id);
        
        if ($designation->employees()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el cargo porque tiene empleados asociados'
            ], 422);
        }

        $designation->delete();

        return response()->json([
            'message' => 'Cargo eliminado exitosamente'
        ]);
    }
}
