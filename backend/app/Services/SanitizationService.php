<?php

namespace App\Services;

use Illuminate\Support\Str;

class SanitizationService
{
    /**
     * Sanitize input data
     */
    public function sanitize(mixed $data, string $type = 'string'): mixed
    {
        return match($type) {
            'string' => $this->sanitizeString($data),
            'email' => $this->sanitizeEmail($data),
            'phone' => $this->sanitizePhone($data),
            'url' => $this->sanitizeUrl($data),
            'html' => $this->sanitizeHtml($data),
            'array' => $this->sanitizeArray($data),
            default => $this->sanitizeString($data)
        };
    }

    /**
     * Sanitize string input
     */
    public function sanitizeString(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Remove null bytes
        $value = str_replace(chr(0), '', $value);
        
        // Remove control characters except tabs, newlines, and carriage returns
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
        
        // Trim whitespace
        $value = trim($value);
        
        // Convert special characters to HTML entities
        $value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        // Remove multiple spaces
        $value = preg_replace('/\s+/', ' ', $value);
        
        return $value;
    }

    /**
     * Sanitize email input
     */
    public function sanitizeEmail(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        $value = $this->sanitizeString($value);
        
        // Convert to lowercase
        $value = strtolower($value);
        
        // Remove any whitespace
        $value = str_replace(' ', '', $value);
        
        // Validate email format
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return null;
        }
        
        return $value;
    }

    /**
     * Sanitize phone number
     */
    public function sanitizePhone(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Remove all non-numeric characters except +
        $value = preg_replace('/[^0-9+]/', '', $value);
        
        // Ensure + is only at the beginning
        $value = preg_replace('/^[^+]*\K\+/', '', $value);
        
        return $value;
    }

    /**
     * Sanitize URL
     */
    public function sanitizeUrl(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Basic URL validation
        if (!filter_var($value, FILTER_VALIDATE_URL)) {
            return null;
        }
        
        // Parse URL components
        $parsed = parse_url($value);
        if (!$parsed) {
            return null;
        }
        
        // Rebuild URL with safe components
        $safeUrl = '';
        if (isset($parsed['scheme'])) {
            $safeUrl .= $parsed['scheme'] . '://';
        }
        if (isset($parsed['host'])) {
            $safeUrl .= $parsed['host'];
        }
        if (isset($parsed['port'])) {
            $safeUrl .= ':' . $parsed['port'];
        }
        if (isset($parsed['path'])) {
            $safeUrl .= $parsed['path'];
        }
        if (isset($parsed['query'])) {
            $safeUrl .= '?' . $parsed['query'];
        }
        if (isset($parsed['fragment'])) {
            $safeUrl .= '#' . $parsed['fragment'];
        }
        
        return $safeUrl;
    }

    /**
     * Sanitize HTML content
     */
    public function sanitizeHtml(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        // Remove script tags and their content
        $value = preg_replace('/<script[^>]*>.*?<\/script>/is', '', $value);
        
        // Remove iframe tags
        $value = preg_replace('/<iframe[^>]*>.*?<\/iframe>/is', '', $value);
        
        // Remove object and embed tags
        $value = preg_replace('/<(object|embed)[^>]*>.*?<\/\1>/is', '', $value);
        
        // Remove javascript: and data: protocols
        $value = preg_replace('/(javascript|data|vbscript):/i', '', $value);
        
        // Remove event handlers
        $value = preg_replace('/\s+(on\w+)\s*=\s*(["\']?).*?\2/i', '', $value);
        
        // Remove style tags with dangerous content
        $value = preg_replace('/<style[^>]*>.*?<\/style>/is', '', $value);
        
        return $this->sanitizeString($value);
    }

    /**
     * Sanitize array input
     */
    public function sanitizeArray(array $data): array
    {
        $sanitized = [];
        
        foreach ($data as $key => $value) {
            $sanitizedKey = $this->sanitizeString($key);
            
            if (is_array($value)) {
                $sanitized[$sanitizedKey] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $sanitized[$sanitizedKey] = $this->sanitizeString($value);
            } else {
                $sanitized[$sanitizedKey] = $value;
            }
        }
        
        return $sanitized;
    }

    /**
     * Validate and sanitize file upload
     */
    public function validateFileUpload(array $file, array $allowedTypes = []): bool
    {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return false;
        }
        
        // Check file size (max 10MB)
        if ($file['size'] > 10 * 1024 * 1024) {
            return false;
        }
        
        // Validate MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!empty($allowedTypes) && !in_array($mimeType, $allowedTypes)) {
            return false;
        }
        
        // Check for PHP code in file
        $content = file_get_contents($file['tmp_name']);
        if (preg_match('/<\?php/i', $content)) {
            return false;
        }
        
        return true;
    }
}