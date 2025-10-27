<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'mime_type',
        'uploaded_by',
        'upload_date',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'upload_date' => 'date',
    ];

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
