<?php

namespace App\Http\Middleware;

use App\Services\SanitizationService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    protected SanitizationService $sanitizationService;

    public function __construct(SanitizationService $sanitizationService)
    {
        $this->sanitizationService = $sanitizationService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Sanitize input data
        $this->sanitizeRequest($request);
        
        return $next($request);
    }

    /**
     * Sanitize request data
     */
    protected function sanitizeRequest(Request $request): void
    {
        // Sanitize query parameters
        $query = $this->sanitizeArray($request->query());
        $request->query->replace($query);
        
        // Sanitize POST data (except files and passwords)
        $input = $this->sanitizeArray($request->all());
        $request->replace($input);
        
        // Sanitize JSON data if present
        if ($request->isJson()) {
            $jsonData = $request->json()->all();
            $sanitizedJson = $this->sanitizeArray($jsonData);
            $request->json()->replace($sanitizedJson);
        }
    }

    /**
     * Sanitize array data
     */
    protected function sanitizeArray(array $data): array
    {
        $sanitized = [];
        
        foreach ($data as $key => $value) {
            // Skip file uploads and passwords
            if ($this->shouldSkipField($key)) {
                $sanitized[$key] = $value;
                continue;
            }
            
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $sanitized[$key] = $this->sanitizeValue($value, $key);
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }

    /**
     * Determine if field should be skipped
     */
    protected function shouldSkipField(string $key): bool
    {
        $skipFields = [
            'password',
            'password_confirmation',
            'current_password',
            'file',
            'files',
            'image',
            'images',
            'document',
            'documents',
            'attachment',
            'attachments'
        ];
        
        foreach ($skipFields as $field) {
            if (str_contains(strtolower($key), $field)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Sanitize value based on field name
     */
    protected function sanitizeValue(string $value, string $field): string
    {
        $type = $this->detectFieldType($field);
        
        return match($type) {
            'email' => $this->sanitizationService->sanitizeEmail($value) ?? $value,
            'phone' => $this->sanitizationService->sanitizePhone($value) ?? $value,
            'url' => $this->sanitizationService->sanitizeUrl($value) ?? $value,
            'html' => $this->sanitizationService->sanitizeHtml($value) ?? $value,
            default => $this->sanitizationService->sanitizeString($value) ?? $value
        };
    }

    /**
     * Detect field type from field name
     */
    protected function detectFieldType(string $field): string
    {
        $field = strtolower($field);
        
        if (str_contains($field, 'email') || str_contains($field, 'correo')) {
            return 'email';
        }
        
        if (str_contains($field, 'phone') || str_contains($field, 'telefono') || str_contains($field, 'celular')) {
            return 'phone';
        }
        
        if (str_contains($field, 'url') || str_contains($field, 'website') || str_contains($field, 'sitio')) {
            return 'url';
        }
        
        if (str_contains($field, 'description') || str_contains($field, 'content') || str_contains($field, 'contenido') || str_contains($field, 'mensaje')) {
            return 'html';
        }
        
        return 'string';
    }
}