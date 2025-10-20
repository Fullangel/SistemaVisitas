<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index(Request $request)
    {
        $query = Region::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $regions = $query->paginate(20);

        return response()->json([
            'data' => $regions->items(),
            'total' => $regions->total(),
            'per_page' => $regions->perPage(),
            'current_page' => $regions->currentPage(),
            'last_page' => $regions->lastPage()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:10|unique:regions,code'
        ]);

        $region = Region::create($validated);

        return response()->json([
            'message' => 'Región creada exitosamente',
            'data' => $region
        ], 201);
    }

    public function show($id)
    {
        $region = Region::with('headquarters')->findOrFail($id);

        return response()->json([
            'data' => $region
        ]);
    }

    public function update(Request $request, $id)
    {
        $region = Region::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'code' => 'sometimes|required|string|max:10|unique:regions,code,' . $id
        ]);

        $region->update($validated);

        return response()->json([
            'message' => 'Región actualizada exitosamente',
            'data' => $region
        ]);
    }

    public function destroy($id)
    {
        $region = Region::findOrFail($id);
        
        if ($region->headquarters()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar la región porque tiene sedes asociadas'
            ], 422);
        }

        $region->delete();

        return response()->json([
            'message' => 'Región eliminada exitosamente'
        ]);
    }
}
