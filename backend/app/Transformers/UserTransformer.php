<?php

namespace App\Transformers;

use App\Models\User;

class UserTransformer extends BaseTransformer
{
    /**
     * Transformar un usuario
     *
     * @param User $user
     * @return array
     */
    public function transform($user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'full_name' => $user->full_name,
            'status' => $user->status,
            'role' => $user->role ? [
                'id' => $user->role->id,
                'name' => $user->role->name,
                'display_name' => $user->role->display_name
            ] : null,
            'employee' => $user->employee ? [
                'id' => $user->employee->id,
                'employee_id' => $user->employee->employee_id,
                'first_name' => $user->employee->first_name,
                'last_name' => $user->employee->last_name,
                'department' => $user->employee->department->name ?? null,
                'designation' => $user->employee->designation->name ?? null,
                'headquarter' => $user->employee->headquarter->name ?? null
            ] : null,
            'last_login_at' => $this->formatDate($user->last_login_at),
            'email_verified_at' => $this->formatDate($user->email_verified_at),
            'created_at' => $this->formatDate($user->created_at),
            'updated_at' => $this->formatDate($user->updated_at),
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray()
        ];
    }

    /**
     * Transformar usuario para respuesta de autenticación
     *
     * @param User $user
     * @param string $token
     * @return array
     */
    public function transformForAuth($user, $token): array
    {
        return [
            'user' => $this->transform($user),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    /**
     * Transformar usuario para listado (versión simplificada)
     *
     * @param User $user
     * @return array
     */
    public function transformForList($user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'full_name' => $user->full_name,
            'status' => $user->status,
            'role' => $user->role->display_name ?? null,
            'employee' => $user->employee ? $user->employee->full_name : null,
            'last_login_at' => $this->formatDate($user->last_login_at),
            'created_at' => $this->formatDate($user->created_at)
        ];
    }
}