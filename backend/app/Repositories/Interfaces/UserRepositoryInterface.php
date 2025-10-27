<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface
{
    /**
     * Encontrar usuario por email o username
     *
     * @param string $login
     * @return \App\Models\User|null
     */
    public function findByLogin(string $login);

    /**
     * Encontrar usuario activo por email o username
     *
     * @param string $login
     * @return \App\Models\User|null
     */
    public function findActiveByLogin(string $login);

    /**
     * Obtener usuarios con rol específico
     *
     * @param string $roleName
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByRole(string $roleName);

    /**
     * Buscar usuarios por término
     *
     * @param string $term
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function search(string $term, int $limit = 10);

    /**
     * Obtener usuarios activos
     *
     * @param int $limit
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getActiveUsers(int $limit = 15);

    /**
     * Actualizar último acceso del usuario
     *
     * @param int $userId
     * @return bool
     */
    public function updateLastLogin(int $userId): bool;

    /**
     * Verificar si el email ya existe
     *
     * @param string $email
     * @param int|null $excludeUserId
     * @return bool
     */
    public function emailExists(string $email, ?int $excludeUserId = null): bool;

    /**
     * Verificar si el username ya existe
     *
     * @param string $username
     * @param int|null $excludeUserId
     * @return bool
     */
    public function usernameExists(string $username, ?int $excludeUserId = null): bool;
}