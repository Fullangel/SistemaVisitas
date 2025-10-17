<?php

namespace App\Logging;

use Monolog\Processor\ProcessorInterface;
use Monolog\LogRecord;

class SensitiveDataProcessor implements ProcessorInterface
{
    /**
     * Fields that should be masked in logs
     */
    protected array $sensitiveFields = [
        'password',
        'password_confirmation',
        'current_password',
        'token',
        'api_token',
        'access_token',
        'refresh_token',
        'secret',
        'api_secret',
        'private_key',
        'credit_card',
        'card_number',
        'cvv',
        'pin',
        'ssn',
        'social_security',
        'dni',
        'passport',
        'bank_account',
        'routing_number',
        'iban',
        'bic',
        'swift',
        'authorization',
        'cookie',
        'session',
        'remember_token',
    ];

    /**
     * @param LogRecord $record
     */
    public function __invoke(LogRecord $record): LogRecord
    {
        $context = $record->context;
        if (!empty($context)) {
            $record = $record->with(context: $this->sanitizeArray($context));
        }

        $extra = $record->extra;
        if (!empty($extra)) {
            $record = $record->with(extra: $this->sanitizeArray($extra));
        }

        // Sanitize message if it contains sensitive data
        $message = $record->message;
        if (!empty($message) && is_string($message)) {
            $record = $record->with(message: $this->sanitizeString($message));
        }

        return $record;
    }

    /**
     * Sanitize array data
     */
    protected function sanitizeArray(array $data): array
    {
        foreach ($data as $key => $value) {
            if ($this->isSensitiveField($key)) {
                $data[$key] = $this->maskValue($value);
            } elseif (is_array($value)) {
                $data[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $data[$key] = $this->sanitizeString($value);
            }
        }

        return $data;
    }

    /**
     * Check if field is sensitive
     */
    protected function isSensitiveField(string $key): bool
    {
        $key = strtolower($key);
        
        foreach ($this->sensitiveFields as $field) {
            if (str_contains($key, $field)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Mask sensitive value
     */
    protected function maskValue($value): string
    {
        if (is_string($value)) {
            $length = strlen($value);
            if ($length <= 4) {
                return '****';
            }
            
            // Show first 2 and last 2 characters
            return substr($value, 0, 2) . str_repeat('*', $length - 4) . substr($value, -2);
        }

        if (is_numeric($value)) {
            return '****';
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_null($value)) {
            return 'null';
        }

        return '[MASKED]';
    }

    /**
     * Sanitize string data
     */
    protected function sanitizeString(string $string): string
    {
        // Remove potential SQL injection patterns
        $string = preg_replace('/\b(union|select|insert|update|delete|drop|create|alter|exec|script)\b/i', '[REDACTED]', $string);
        
        // Remove potential XSS patterns
        $string = preg_replace('/<script[^>]*>.*?<\/script>/is', '[REDACTED]', $string);
        $string = preg_replace('/javascript:/i', '[REDACTED]', $string);
        
        return $string;
    }
}