<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     *
     * @param User $model
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Encontrar usuario por email o username
     */
    public function findByLogin(string $login)
    {
        return $this->model
            ->where('email', $login)
            ->orWhere('username', $login)
            ->first();
    }

    /**
     * Encontrar usuario activo por email o username
     */
    public function findActiveByLogin(string $login)
    {
        return $this->model
            ->where('status', 'active')
            ->where(function ($query) use ($login) {
                $query->where('email', $login)
                      ->orWhere('username', $login);
            })
            ->first();
    }

    /**
     * Obtener usuarios con rol específico
     */
    public function getByRole(string $roleName): Collection
    {
        return $this->model
            ->whereHas('role', function ($query) use ($roleName) {
                $query->where('name', $roleName);
            })
            ->get();
    }

    /**
     * Buscar usuarios por término
     */
    public function search(string $term, int $limit = 10): Collection
    {
        return $this->model
            ->where(function ($query) use ($term) {
                $query->where('username', 'like', "%{$term}%")
                      ->orWhere('email', 'like', "%{$term}%")
                      ->orWhere('full_name', 'like', "%{$term}%");
            })
            ->limit($limit)
            ->get();
    }

    /**
     * Obtener usuarios activos
     */
    public function getActiveUsers(int $limit = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);
    }

    /**
     * Actualizar último acceso del usuario
     */
    public function updateLastLogin(int $userId): bool
    {
        return $this->model
            ->where('id', $userId)
            ->update([
                'last_login_at' => now(),
                'last_login_ip' => request()->ip(),
            ]) > 0;
    }

    /**
     * Verificar si el email ya existe
     */
    public function emailExists(string $email, ?int $excludeUserId = null): bool
    {
        $query = $this->model->where('email', $email);
        
        if ($excludeUserId !== null) {
            $query->where('id', '!=', $excludeUserId);
        }
        
        return $query->exists();
    }

    /**
     * Verificar si el username ya existe
     */
    public function usernameExists(string $username, ?int $excludeUserId = null): bool
    {
        $query = $this->model->where('username', $username);
        
        if ($excludeUserId !== null) {
            $query->where('id', '!=', $excludeUserId);
        }
        
        return $query->exists();
    }

    /**
     * Crear un nuevo usuario con contraseña hasheada
     */
    public function create(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return parent::create($data);
    }

    /**
     * Actualizar usuario con contraseña hasheada si se proporciona
     */
    public function update(int $id, array $data)
    {
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return parent::update($id, $data);
    }
}