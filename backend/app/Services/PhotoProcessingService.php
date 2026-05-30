<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoProcessingService
{
    protected $manager;

    public function __construct()
    {
        // Crear ImageManager con driver GD
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Procesar y guardar foto del visitante
     * 
     * @param string $base64Image Imagen en formato base64
     * @param int $visitId ID de la visita
     * @return array Rutas de las versiones guardadas
     */
    public function processVisitorPhoto(string $base64Image, int $visitId): array
    {
        $imageData = $this->decodeBase64Image($base64Image);
        
        $filename = "visitor_{$visitId}_" . time();
        $directory = 'visitors/photos';
        
        return $this->saveMultipleVersions($imageData, $filename, $directory, [
            'original' => ['width' => 2000, 'quality' => 90],
            'medium' => ['width' => 800, 'quality' => 85],
            'thumbnail' => ['width' => 200, 'quality' => 80]
        ]);
    }

    /**
     * Procesar y guardar foto de cédula
     * 
     * @param string $base64Image Imagen en formato base64
     * @param int $visitId ID de la visita
     * @return array Rutas de las versiones guardadas
     */
    public function processIdCardPhoto(string $base64Image, int $visitId): array
    {
        $imageData = $this->decodeBase64Image($base64Image);
        
        $filename = "idcard_{$visitId}_" . time();
        $directory = 'visitors/id_cards';
        
        return $this->saveMultipleVersions($imageData, $filename, $directory, [
            'original' => ['width' => 2000, 'quality' => 90],
            'medium' => ['width' => 1200, 'quality' => 85],
            'thumbnail' => ['width' => 400, 'quality' => 80]
        ]);
    }

    /**
     * Decodificar imagen base64
     * 
     * @param string $base64String Cadena base64
     * @return string Datos binarios de la imagen
     * @throws \Exception Si la cadena base64 es inválida
     */
    private function decodeBase64Image(string $base64String): string
    {
        // Remover prefijo data:image/...;base64, si existe
        $base64String = preg_replace('/^data:image\/\w+;base64,/', '', $base64String);
        
        $imageData = base64_decode($base64String, true);
        
        if ($imageData === false) {
            throw new \Exception('Invalid base64 image data');
        }
        
        return $imageData;
    }

    /**
     * Guardar múltiples versiones de la imagen
     * 
     * @param string $imageData Datos binarios de la imagen
     * @param string $filename Nombre base del archivo
     * @param string $directory Directorio donde guardar
     * @param array $versions Configuración de versiones
     * @return array Rutas y tamaño total
     */
    private function saveMultipleVersions(string $imageData, string $filename, string $directory, array $versions): array
    {
        $paths = [];
        $totalSize = 0;

        // Crear imagen desde datos binarios
        $image = $this->manager->read($imageData);

        foreach ($versions as $versionName => $config) {
            $path = "{$directory}/{$filename}_{$versionName}.webp";
            
            // Crear copia de la imagen para cada versión
            $versionImage = clone $image;
            
            // Redimensionar manteniendo aspect ratio
            $versionImage->scale(width: $config['width']);
            
            // Codificar a WebP con calidad especificada
            $encoded = $versionImage->toWebp($config['quality']);
            
            // Guardar en storage
            Storage::put($path, $encoded);
            
            $paths["{$versionName}_path"] = $path;
            $totalSize += strlen($encoded);
        }

        $paths['file_size'] = $totalSize;
        
        return $paths;
    }

    /**
     * Eliminar foto y todas sus versiones
     * 
     * @param array $paths Array de rutas a eliminar
     * @return bool True si se eliminaron correctamente
     */
    public function deletePhoto(array $paths): bool
    {
        return Storage::delete($paths);
    }

    /**
     * Validar que la imagen base64 sea válida
     * 
     * @param string $base64String Cadena base64
     * @return bool True si es válida
     */
    public function validateBase64Image(string $base64String): bool
    {
        try {
            $imageData = $this->decodeBase64Image($base64String);
            $image = $this->manager->read($imageData);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Obtener información de la imagen
     * 
     * @param string $base64String Cadena base64
     * @return array Información de la imagen (width, height, size)
     */
    public function getImageInfo(string $base64String): array
    {
        $imageData = $this->decodeBase64Image($base64String);
        $image = $this->manager->read($imageData);
        
        return [
            'width' => $image->width(),
            'height' => $image->height(),
            'size' => strlen($imageData)
        ];
    }
}
