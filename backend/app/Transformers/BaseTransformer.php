<?php

namespace App\Transformers;

abstract class BaseTransformer
{
    /**
     * Transformar un modelo individual
     *
     * @param mixed $model
     * @return array
     */
    abstract public function transform($model): array;

    /**
     * Transformar una colección de modelos
     *
     * @param mixed $models
     * @return array
     */
    public function transformCollection($models): array
    {
        return $models->map(function ($model) {
            return $this->transform($model);
        })->toArray();
    }

    /**
     * Transformar con paginación
     *
     * @param mixed $paginator
     * @return array
     */
    public function transformPaginated($paginator): array
    {
        return [
            'data' => $this->transformCollection($paginator->getCollection()),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
                'path' => $paginator->path(),
                'first_page_url' => $paginator->url(1),
                'last_page_url' => $paginator->url($paginator->lastPage()),
                'next_page_url' => $paginator->nextPageUrl(),
                'prev_page_url' => $paginator->previousPageUrl(),
            ]
        ];
    }

    /**
     * Incluir relaciones opcionales
     *
     * @param mixed $model
     * @param array $relations
     * @return array
     */
    protected function includeRelations($model, array $relations): array
    {
        $data = [];
        
        foreach ($relations as $relation) {
            if ($model->relationLoaded($relation)) {
                $data[$relation] = $model->$relation;
            }
        }
        
        return $data;
    }

    /**
     * Formatear fecha de forma segura
     *
     * @param mixed $date
     * @param string $format
     * @return string|null
     */
    protected function formatDate($date, $format = 'Y-m-d H:i:s'): ?string
    {
        if (!$date) {
            return null;
        }
        
        try {
            return \Carbon\Carbon::parse($date)->format($format);
        } catch (\Exception $e) {
            return null;
        }
    }
}