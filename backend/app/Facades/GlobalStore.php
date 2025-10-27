<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed get($key, $default = null)
 * @method static \App\Services\GlobalStoreService set($key, $value)
 * @method static mixed remember($key, $callback, $ttl = null)
 * @method static \App\Services\GlobalStoreService forget($key)
 * @method static \App\Services\GlobalStoreService flush()
 * @method static array getStats()
 */
class GlobalStore extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'global.store';
    }
}