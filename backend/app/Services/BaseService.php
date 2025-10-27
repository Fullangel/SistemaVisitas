<?php

namespace App\Services;

abstract class BaseService
{
    /**
     * Formatear respuesta exitosa
     *
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @return array
     */
    protected function successResponse($data = null, $message = 'Operación exitosa', $code = 200)
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'code' => $code
        ];
    }

    /**
     * Formatear respuesta de error
     *
     * @param string $message
     * @param mixed $errors
     * @param int $code
     * @return array
     */
    protected function errorResponse($message = 'Error en la operación', $errors = null, $code = 400)
    {
        return [
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'code' => $code
        ];
    }

    /**
     * Validar datos de entrada
     *
     * @param array $data
     * @param array $rules
     * @return \Illuminate\Validation\Validator
     */
    protected function validate($data, $rules)
    {
        return validator($data, $rules);
    }

    /**
     * Formatear excepción para respuesta
     *
     * @param \Exception $e
     * @return array
     */
    protected function handleException(\Exception $e)
    {
        return $this->errorResponse(
            'Error interno del servidor',
            [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ],
            500
        );
    }
}