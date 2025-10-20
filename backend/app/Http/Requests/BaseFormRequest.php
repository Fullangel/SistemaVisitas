<?php

namespace App\Http\Requests;

use App\Services\SanitizationService;
use Illuminate\Foundation\Http\FormRequest;

abstract class BaseFormRequest extends FormRequest
{
    protected SanitizationService $sanitizationService;

    public function __construct(array $query = [], array $request = [], array $attributes = [], array $cookies = [], array $files = [], array $server = [], $content = null)
    {
        parent::__construct($query, $request, $attributes, $cookies, $files, $server, $content);
        $this->sanitizationService = app(SanitizationService::class);
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->sanitizeInput();
    }

    /**
     * Sanitize input data
     */
    protected function sanitizeInput(): void
    {
        $sanitized = [];
        
        foreach ($this->all() as $key => $value) {
            if ($this->shouldSanitizeField($key)) {
                $sanitized[$key] = $this->sanitizeValue($value, $this->getFieldType($key));
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        $this->replace($sanitized);
    }

    /**
     * Determine if field should be sanitized
     */
    protected function shouldSanitizeField(string $field): bool
    {
        // Don't sanitize passwords or files
        if (in_array($field, ['password', 'password_confirmation', 'current_password'])) {
            return false;
        }
        
        if (str_contains($field, 'file') || str_contains($field, 'image')) {
            return false;
        }
        
        return true;
    }

    /**
     * Get field type for sanitization
     */
    protected function getFieldType(string $field): string
    {
        if (str_contains($field, 'email')) {
            return 'email';
        }
        
        if (str_contains($field, 'phone') || str_contains($field, 'telefono')) {
            return 'phone';
        }
        
        if (str_contains($field, 'url') || str_contains($field, 'website')) {
            return 'url';
        }
        
        if (str_contains($field, 'description') || str_contains($field, 'content')) {
            return 'html';
        }
        
        return 'string';
    }

    /**
     * Sanitize value based on type
     */
    protected function sanitizeValue(mixed $value, string $type): mixed
    {
        return $this->sanitizationService->sanitize($value, $type);
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser texto.',
            'email' => 'El campo :attribute debe ser un email válido.',
            'unique' => 'El :attribute ya está registrado.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'max' => 'El campo :attribute no puede tener más de :max caracteres.',
            'confirmed' => 'La confirmación de :attribute no coincide.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
            'numeric' => 'El campo :attribute debe ser un número.',
            'integer' => 'El campo :attribute debe ser un número entero.',
            'boolean' => 'El campo :attribute debe ser verdadero o falso.',
            'array' => 'El campo :attribute debe ser un arreglo.',
            'file' => 'El campo :attribute debe ser un archivo.',
            'image' => 'El campo :attribute debe ser una imagen.',
            'mimes' => 'El campo :attribute debe ser un archivo de tipo: :values.',
            'size' => 'El campo :attribute debe tener :size kilobytes.',
            'between' => 'El campo :attribute debe estar entre :min y :max.',
            'in' => 'El campo :attribute debe ser uno de los valores: :values.',
            'not_in' => 'El campo :attribute no debe ser uno de los valores: :values.',
            'regex' => 'El formato del campo :attribute es inválido.',
            'url' => 'El campo :attribute debe ser una URL válida.',
            'ip' => 'El campo :attribute debe ser una dirección IP válida.',
            'json' => 'El campo :attribute debe ser un JSON válido.',
            'uuid' => 'El campo :attribute debe ser un UUID válido.',
            'exists' => 'El :attribute seleccionado es inválido.',
            'required_if' => 'El campo :attribute es obligatorio cuando :other es :value.',
            'required_with' => 'El campo :attribute es obligatorio cuando :values está presente.',
            'required_without' => 'El campo :attribute es obligatorio cuando :values no está presente.',
            'required_with_all' => 'El campo :attribute es obligatorio cuando :values están presentes.',
            'required_without_all' => 'El campo :attribute es obligatorio cuando ninguno de :values están presentes.',
            'same' => 'El campo :attribute y :other deben coincidir.',
            'different' => 'El campo :attribute y :other deben ser diferentes.',
            'digits' => 'El campo :attribute debe tener :digits dígitos.',
            'digits_between' => 'El campo :attribute debe tener entre :min y :max dígitos.',
            'alpha' => 'El campo :attribute solo puede contener letras.',
            'alpha_num' => 'El campo :attribute solo puede contener letras y números.',
            'alpha_dash' => 'El campo :attribute solo puede contener letras, números, guiones y guiones bajos.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
            'password_confirmation' => 'confirmación de contraseña',
            'current_password' => 'contraseña actual',
            'phone' => 'teléfono',
            'address' => 'dirección',
            'city' => 'ciudad',
            'country' => 'país',
            'postal_code' => 'código postal',
            'birth_date' => 'fecha de nacimiento',
            'gender' => 'género',
            'role' => 'rol',
            'status' => 'estado',
            'description' => 'descripción',
            'title' => 'título',
            'content' => 'contenido',
            'image' => 'imagen',
            'file' => 'archivo',
            'url' => 'URL',
            'website' => 'sitio web',
            'company' => 'empresa',
            'department' => 'departamento',
            'position' => 'cargo',
            'salary' => 'salario',
            'start_date' => 'fecha de inicio',
            'end_date' => 'fecha de fin',
            'notes' => 'notas',
            'comments' => 'comentarios',
            'priority' => 'prioridad',
            'category' => 'categoría',
            'tags' => 'etiquetas',
            'price' => 'precio',
            'quantity' => 'cantidad',
            'discount' => 'descuento',
            'tax' => 'impuesto',
            'total' => 'total',
            'payment_method' => 'método de pago',
            'shipping_method' => 'método de envío',
            'tracking_number' => 'número de seguimiento',
            'order_status' => 'estado del pedido',
            'payment_status' => 'estado del pago',
            'shipping_status' => 'estado del envío',
            'delivery_date' => 'fecha de entrega',
            'return_policy' => 'política de devolución',
            'warranty' => 'garantía',
            'manufacturer' => 'fabricante',
            'model' => 'modelo',
            'serial_number' => 'número de serie',
            'sku' => 'SKU',
            'barcode' => 'código de barras',
            'weight' => 'peso',
            'dimensions' => 'dimensiones',
            'color' => 'color',
            'size' => 'tamaño',
            'material' => 'material',
            'style' => 'estilo',
            'pattern' => 'patrón',
            'season' => 'temporada',
            'occasion' => 'ocasión',
            'target_audience' => 'audiencia objetivo',
            'language' => 'idioma',
            'timezone' => 'zona horaria',
            'currency' => 'moneda',
            'tax_rate' => 'tasa de impuesto',
            'commission_rate' => 'tasa de comisión',
            'profit_margin' => 'margen de beneficio',
            'cost_price' => 'precio de costo',
            'selling_price' => 'precio de venta',
            'wholesale_price' => 'precio al por mayor',
            'retail_price' => 'precio al por menor',
            'special_price' => 'precio especial',
            'offer_price' => 'precio de oferta',
            'discount_percentage' => 'porcentaje de descuento',
            'tax_amount' => 'monto del impuesto',
            'shipping_cost' => 'costo de envío',
            'handling_fee' => 'tarifa de manejo',
            'insurance_fee' => 'tarifa de seguro',
            'packaging_fee' => 'tarifa de empaquetado',
            'storage_fee' => 'tarifa de almacenamiento',
            'pickup_fee' => 'tarifa de recolección',
            'delivery_fee' => 'tarifa de entrega',
            'installation_fee' => 'tarifa de instalación',
            'setup_fee' => 'tarifa de configuración',
            'subscription_fee' => 'tarifa de suscripción',
            'membership_fee' => 'tarifa de membresía',
            'registration_fee' => 'tarifa de registro',
            'processing_fee' => 'tarifa de procesamiento',
            'transaction_fee' => 'tarifa de transacción',
            'service_fee' => 'tarifa de servicio',
            'admin_fee' => 'tarifa administrativa',
            'late_fee' => 'tarifa por retraso',
            'cancellation_fee' => 'tarifa de cancelación',
            'refund_fee' => 'tarifa de reembolso',
            'restocking_fee' => 'tarifa de reabastecimiento',
            'return_shipping_fee' => 'tarifa de envío de devolución',
        ];
    }
}