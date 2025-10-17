<?php

namespace App\Http\Controllers;

use App\Models\Headquarter;
use App\Models\Region;
use Illuminate\Http\Request;

class HeadquarterController extends Controller
{
    public function index(Request $request)
    {
        $query = Headquarter::with('region');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($request->has('region_id')) {
            $query->where('region_id', $request->region_id);
        }

        $headquarters = $query->paginate(20);

        return response()->json([
            'data' => $headquarters->items(),
            'total' => $headquarters->total(),
            'per_page' => $headquarters->perPage(),
            'current_page' => $headquarters->currentPage(),
            'last_page' => $headquarters->lastPage()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'address' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:headquarters,code',
            'region_id' => 'required|exists:regions,id'
        ]);

        $headquarter = Headquarter::create($validated);

        return response()->json([
            'message' => 'Sede creada exitosamente',
            'data' => $headquarter->load('region')
        ], 201);
    }

    public function show($id)
    {
        $headquarter = Headquarter::with(['region', 'departments', 'departments.employees'])->findOrFail($id);

        return response()->json([
            'data' => $headquarter
        ]);
    }

    public function update(Request $request, $id)
    {
        $headquarter = Headquarter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'address' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:10|unique:headquarters,code,' . $id,
            'region_id' => 'sometimes|required|exists:regions,id'
        ]);

        $headquarter->update($validated);

        return response()->json([
            'message' => 'Sede actualizada exitosamente',
            'data' => $headquarter->load('region')
        ]);
    }

    public function destroy($id)
    {
        $headquarter = Headquarter::findOrFail($id);
        
        if ($headquarter->departments()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar la sede porque tiene departamentos asociados'
            ], 422);
        }

        if ($headquarter->visits()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar la sede porque tiene visitas asociadas'
            ], 422);
        }

        $headquarter->delete();

        return response()->json([
            'message' => 'Sede eliminada exitosamente'
        ]);
    }
}
