<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['department', 'designation']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('identification', 'like', "%{$search}%");
            });
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $employees = $query->paginate(20);

        return response()->json([
            'data' => $employees->items(),
            'total' => $employees->total(),
            'per_page' => $employees->perPage(),
            'current_page' => $employees->currentPage(),
            'last_page' => $employees->lastPage()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:20',
            'identification' => 'required|string|max:50|unique:employees,identification',
            'employee_code' => 'required|string|max:20|unique:employees,employee_code',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'status' => 'boolean'
        ]);

        $employee = Employee::create($validated);

        return response()->json([
            'message' => 'Empleado creado exitosamente',
            'data' => $employee->load(['department', 'designation'])
        ], 201);
    }

    public function show($id)
    {
        $employee = Employee::with(['department', 'designation'])->findOrFail($id);

        return response()->json([
            'data' => $employee
        ]);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|unique:employees,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'identification' => 'sometimes|required|string|max:50|unique:employees,identification,' . $id,
            'employee_code' => 'sometimes|required|string|max:20|unique:employees,employee_code,' . $id,
            'department_id' => 'sometimes|required|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'status' => 'boolean'
        ]);

        $employee->update($validated);

        return response()->json([
            'message' => 'Empleado actualizado exitosamente',
            'data' => $employee->load(['department', 'designation'])
        ]);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        
        if ($employee->user()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el empleado porque tiene un usuario asociado'
            ], 422);
        }

        if ($employee->visits()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el empleado porque tiene visitas asociadas'
            ], 422);
        }

        $employee->delete();

        return response()->json([
            'message' => 'Empleado eliminado exitosamente'
        ]);
    }
}
