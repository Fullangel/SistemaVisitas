<?php

namespace App\Transformers;

class ApiResponseTransformer
{
    /**
     * Transformar respuesta exitosa estándar
     *
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @return array
     */
    public static function success($data = null, string $message = 'Operación exitosa', int $code = 200): array
    {
        return [
            'success' => true,
            'code' => $code,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toIso8601String()
        ];
    }

    /**
     * Transformar respuesta de error estándar
     *
     * @param string $message
     * @param int $code
     * @param mixed $errors
     * @return array
     */
    public static function error(string $message = 'Error en la operación', int $code = 400, $errors = null): array
    {
        return [
            'success' => false,
            'code' => $code,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => now()->toIso8601String()
        ];
    }

    /**
     * Transformar respuesta de validación
     *
     * @param array $errors
     * @param string $message
     * @return array
     */
    public static function validationError(array $errors, string $message = 'Error de validación'): array
    {
        return self::error($message, 422, $errors);
    }

    /**
     * Transformar respuesta de recurso no encontrado
     *
     * @param string $message
     * @return array
     */
    public static function notFound(string $message = 'Recurso no encontrado'): array
    {
        return self::error($message, 404);
    }

    /**
     * Transformar respuesta de acceso no autorizado
     *
     * @param string $message
     * @return array
     */
    public static function unauthorized(string $message = 'No autorizado'): array
    {
        return self::error($message, 401);
    }

    /**
     * Transformar respuesta de acceso prohibido
     *
     * @param string $message
     * @return array
     */
    public static function forbidden(string $message = 'Acceso prohibido'): array
    {
        return self::error($message, 403);
    }

    /**
     * Transformar respuesta de conflicto
     *
     * @param string $message
     * @param mixed $data
     * @return array
     */
    public static function conflict(string $message = 'Conflicto en la operación', $data = null): array
    {
        return self::error($message, 409, $data);
    }

    /**
     * Transformar respuesta de servidor interno
     *
     * @param string $message
     * @param mixed $data
     * @return array
     */
    public static function serverError(string $message = 'Error interno del servidor', $data = null): array
    {
        return self::error($message, 500, $data);
    }

    /**
     * Transformar respuesta paginada
     *
     * @param mixed $data
     * @param array $pagination
     * @param string $message
     * @return array
     */
    public static function paginated($data, array $pagination, string $message = 'Datos obtenidos exitosamente'): array
    {
        return [
            'success' => true,
            'code' => 200,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'current_page' => $pagination['current_page'],
                'per_page' => $pagination['per_page'],
                'total' => $pagination['total'],
                'last_page' => $pagination['last_page'],
                'from' => $pagination['from'] ?? null,
                'to' => $pagination['to'] ?? null
            ],
            'timestamp' => now()->toIso8601String()
        ];
    }

    /**
     * Transformar respuesta de creación exitosa
     *
     * @param mixed $data
     * @param string $message
     * @return array
     */
    public static function created($data, string $message = 'Recurso creado exitosamente'): array
    {
        return self::success($data, $message, 201);
    }

    /**
     * Transformar respuesta de actualización exitosa
     *
     * @param mixed $data
     * @param string $message
     * @return array
     */
    public static function updated($data, string $message = 'Recurso actualizado exitosamente'): array
    {
        return self::success($data, $message, 200);
    }

    /**
     * Transformar respuesta de eliminación exitosa
     *
     * @param string $message
     * @return array
     */
    public static function deleted(string $message = 'Recurso eliminado exitosamente'): array
    {
        return self::success(null, $message, 200);
    }
}