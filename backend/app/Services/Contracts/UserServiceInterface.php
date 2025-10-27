<?php

namespace App\Services\Contracts;

interface UserServiceInterface
{
    /**
     * Obtener todos los usuarios con paginación
     *
     * @param int $perPage
     * @param array $filters
     * @return array
     */
    public function getAllUsers(int $perPage = 15, array $filters = []): array;

    /**
     * Obtener un usuario específico
     *
     * @param int $id
     * @return array
     */
    public function getUserById(int $id): array;

    /**
     * Crear un nuevo usuario
     *
     * @param array $data
     * @return array
     */
    public function createUser(array $data): array;

    /**
     * Actualizar un usuario existente
     *
     * @param int $id
     * @param array $data
     * @return array
     */
    public function updateUser(int $id, array $data): array;

    /**
     * Eliminar un usuario
     *
     * @param int $id
     * @return array
     */
    public function deleteUser(int $id): array;

    /**
     * Buscar usuarios por término
     *
     * @param string $term
     * @param int $limit
     * @return array
     */
    public function searchUsers(string $term, int $limit = 10): array;

    /**
     * Obtener usuarios por rol
     *
     * @param string $roleName
     * @return array
     */
    public function getUsersByRole(string $roleName): array;

    /**
     * Actualizar último acceso del usuario
     *
     * @param int $userId
     * @return array
     */
    public function updateUserLastLogin(int $userId): array;

    /**
     * Verificar disponibilidad de email
     *
     * @param string $email
     * @param int|null $excludeUserId
     * @return array
     */
    public function checkEmailAvailability(string $email, ?int $excludeUserId = null): array;

    /**
     * Verificar disponibilidad de username
     *
     * @param string $username
     * @param int|null $excludeUserId
     * @return array
     */
    public function checkUsernameAvailability(string $username, ?int $excludeUserId = null): array;
}