<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Headquarter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'code',
        'region_id',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
