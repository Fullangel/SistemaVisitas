<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class GlobalStoreService
{
    private static $instance = null;
    private $data = [];
    private $cacheTtl = 3600; // 1 hora por defecto
    
    private function __construct()
    {
        $this->loadInitialData();
    }
    
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    /**
     * Cargar datos iniciales en memoria
     */
    private function loadInitialData()
    {
        // Datos de configuración que no cambian frecuentemente
        $this->data['settings'] = $this->loadSettings();
        $this->data['regions'] = $this->loadRegions();
        $this->data['headquarters'] = $this->loadHeadquarters();
        $this->data['departments'] = $this->loadDepartments();
        $this->data['roles'] = $this->loadRoles();
        $this->data['designations'] = $this->loadDesignations();
    }
    
    /**
     * Obtener dato del store
     */
    public function get($key, $default = null)
    {
        return $this->data[$key] ?? $default;
    }
    
    /**
     * Establecer dato en el store
     */
    public function set($key, $value)
    {
        $this->data[$key] = $value;
        
        // Cachear en Redis para persistencia
        Cache::store('redis')->put("global_store:{$key}", $value, $this->cacheTtl);
        
        return $this;
    }
    
    /**
     * Obtener desde cache o calcular
     */
    public function remember($key, $callback, $ttl = null)
    {
        $ttl = $ttl ?? $this->cacheTtl;
        
        // Primero verificar en memoria
        if (isset($this->data[$key])) {
            return $this->data[$key];
        }
        
        // Luego verificar en cache
        $cached = Cache::store('redis')->get("global_store:{$key}");
        if ($cached !== null) {
            $this->data[$key] = $cached;
            return $cached;
        }
        
        // Calcular y guardar
        $value = $callback();
        $this->set($key, $value);
        
        return $value;
    }
    
    /**
     * Limpiar dato del store
     */
    public function forget($key)
    {
        unset($this->data[$key]);
        Cache::store('redis')->forget("global_store:{$key}");
        
        return $this;
    }
    
    /**
     * Limpiar todo el store
     */
    public function flush()
    {
        $this->data = [];
        Cache::store('redis')->flush();
        
        // Recargar datos iniciales
        $this->loadInitialData();
        
        return $this;
    }
    
    /**
     * Obtener estadísticas del store
     */
    public function getStats()
    {
        return [
            'total_keys' => count($this->data),
            'memory_usage' => strlen(serialize($this->data)),
            'cache_keys' => count(Cache::store('redis')->getRedis()->keys('global_store:*')),
            'last_update' => now()->toDateTimeString()
        ];
    }
    
    // Métodos privados para cargar datos específicos
    
    private function loadSettings()
    {
        return Cache::remember('app_settings', $this->cacheTtl, function() {
            return DB::table('settings')->pluck('value', 'key')->toArray();
        });
    }
    
    private function loadRegions()
    {
        return Cache::remember('regions_active', $this->cacheTtl, function() {
            return DB::table('regiones')
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get()
                ->keyBy('id')
                ->toArray();
        });
    }
    
    private function loadHeadquarters()
    {
        return Cache::remember('headquarters_active', $this->cacheTtl, function() {
            return DB::table('headquarters')
                ->select('id', 'name', 'code', 'region_id', 'address')
                ->orderBy('name')
                ->get()
                ->groupBy('region_id')
                ->toArray();
        });
    }
    
    private function loadDepartments()
    {
        return Cache::remember('departments_active', $this->cacheTtl, function() {
            return DB::table('departments')
                ->select('id', 'name', 'code', 'headquarter_id')
                ->orderBy('name')
                ->get()
                ->groupBy('headquarter_id')
                ->toArray();
        });
    }
    
    private function loadRoles()
    {
        return Cache::remember('roles_active', $this->cacheTtl, function() {
            return DB::table('roles')
                ->select('id', 'name', 'description', 'permissions')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->keyBy('id')
                ->toArray();
        });
    }
    
    private function loadDesignations()
    {
        return Cache::remember('designations_active', $this->cacheTtl, function() {
            return DB::table('designations')
                ->select('id', 'name')
                ->where('status', true)
                ->orderBy('name')
                ->get()
                ->keyBy('id')
                ->toArray();
        });
    }
}