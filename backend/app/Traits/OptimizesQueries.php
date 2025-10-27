<?php

namespace App\Traits;

trait OptimizesQueries
{
    /**
     * Aplicar eager loading selectivo basado en la solicitud
     */
    public function scopeWithIfRequested($query, $relation, $callback = null)
    {
        $request = request();
        $relationKey = str_replace('.', '_', $relation);
        
        if ($request->has('with_' . $relationKey) || $request->has('with_all')) {
            return $callback ? $query->with([$relation => $callback]) : $query->with($relation);
        }
        
        return $query;
    }
    
    /**
     * Aplicar filtros comunes de búsqueda
     */
    public function scopeApplySearchFilters($query, array $filters)
    {
        foreach ($filters as $field => $value) {
            if (request()->has($field)) {
                $query->where($field, $value);
            }
        }
        
        return $query;
    }
    
    /**
     * Optimizar carga de relaciones con select específico
     */
    public function scopeWithOptimized($query, $relation, array $columns = ['*'])
    {
        return $query->with([$relation => function($q) use ($columns) {
            $q->select(array_merge(['id'], $columns));
        }]);
    }
    
    /**
     * Cargar relaciones solo si se necesitan
     */
    public function scopeLoadIfNeeded($query, $relation, $condition)
    {
        if ($condition) {
            return $query->with($relation);
        }
        
        return $query;
    }
    
    /**
     * Paginación con relaciones condicionales
     */
    public function scopePaginateWithRelations($query, $perPage = 15, array $relations = [])
    {
        $request = request();
        $perPage = $request->get('per_page', $perPage);
        
        // Aplicar relaciones basadas en parámetros
        foreach ($relations as $relation => $condition) {
            if (is_numeric($relation)) {
                // Relación simple
                $query->with($condition);
            } else {
                // Relación con condición
                if ($request->has($condition) || $request->has('with_all')) {
                    $query->with($relation);
                }
            }
        }
        
        return $query->paginate($perPage);
    }
}