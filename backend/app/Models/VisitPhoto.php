<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class VisitPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'photo_type',
        'original_path',
        'medium_path',
        'thumbnail_path',
        'file_size',
        'mime_type'
    ];

    protected $appends = [
        'original_url',
        'medium_url',
        'thumbnail_url'
    ];

    /**
     * Relación con Visit
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Generar URL pública para foto original
     */
    public function getOriginalUrlAttribute()
    {
        return $this->original_path ? Storage::url($this->original_path) : null;
    }

    /**
     * Generar URL pública para foto tamaño medio
     */
    public function getMediumUrlAttribute()
    {
        return $this->medium_path ? Storage::url($this->medium_path) : null;
    }

    /**
     * Generar URL pública para miniatura
     */
    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail_path ? Storage::url($this->thumbnail_path) : null;
    }

    /**
     * Eliminar archivos físicos al borrar el registro
     */
    protected static function booted()
    {
        static::deleting(function ($photo) {
            // Eliminar archivos del filesystem
            $paths = array_filter([
                $photo->original_path,
                $photo->medium_path,
                $photo->thumbnail_path
            ]);

            if (!empty($paths)) {
                Storage::delete($paths);
            }
        });
    }

    /**
     * Scope para obtener solo fotos de visitantes
     */
    public function scopeVisitorPhotos($query)
    {
        return $query->where('photo_type', 'visitor');
    }

    /**
     * Scope para obtener solo fotos de cédulas
     */
    public function scopeIdCardPhotos($query)
    {
        return $query->where('photo_type', 'id_card');
    }
}
