<?php

namespace App\Services\Implementations;

use App\Services\BaseService;
use App\Services\Contracts\UserServiceInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserService extends BaseService implements UserServiceInterface
{
    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * Constructor
     *
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * {@inheritdoc}
     */
    public function getAllUsers(int $perPage = 15, array $filters = []): array
    {
        try {
            $query = $this->userRepository->with(['role']);

            // Aplicar filtros
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['role_id'])) {
                $query->where('role_id', $filters['role_id']);
            }

            if (!empty($filters['search'])) {
                $searchTerm = $filters['search'];
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('username', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%")
                      ->orWhere('first_name', 'like', "%{$searchTerm}%")
                      ->orWhere('last_name', 'like', "%{$searchTerm}%");
                });
            }

            $users = $query->paginate($perPage);

            return $this->successResponse($users, 'Usuarios obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getUserById(int $id): array
    {
        try {
            $user = $this->userRepository->with(['role'])->find($id);

            if (!$user) {
                return $this->errorResponse('Usuario no encontrado', null, 404);
            }

            return $this->successResponse($user, 'Usuario obtenido exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function createUser(array $data): array
    {
        try {
            // Validar datos
            $validator = Validator::make($data, [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'username' => 'required|string|unique:users,username|max:255',
                'password' => 'required|string|min:8|confirmed',
                'role_id' => 'required|exists:roles,id',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Error de validación', $validator->errors(), 422);
            }

            // Crear usuario
            $user = $this->userRepository->create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'username' => $data['username'],
                'password' => Hash::make($data['password']),
                'role_id' => $data['role_id'],
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            // Cargar relaciones
            $user->load('role');

            return $this->successResponse($user, 'Usuario creado exitosamente', 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updateUser(int $id, array $data): array
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->errorResponse('Usuario no encontrado', null, 404);
            }

            // Validar datos
            $validator = Validator::make($data, [
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:users,email,' . $id,
                'username' => 'nullable|string|unique:users,username,' . $id . '|max:255',
                'password' => 'nullable|string|min:8|confirmed',
                'role_id' => 'nullable|exists:roles,id',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'status' => 'nullable|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Error de validación', $validator->errors(), 422);
            }

            // Preparar datos para actualizar
            $updateData = array_filter($data, function ($value, $key) {
                return $key !== 'password' || !empty($value);
            }, ARRAY_FILTER_USE_BOTH);

            if (isset($data['password']) && !empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            // Actualizar usuario
            $updatedUser = $this->userRepository->update($id, $updateData);

            // Cargar relaciones
            $updatedUser->load('role');

            return $this->successResponse($updatedUser, 'Usuario actualizado exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function deleteUser(int $id): array
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->errorResponse('Usuario no encontrado', null, 404);
            }

            // Verificar si el usuario tiene visitas asociadas
            if ($user->employee && $user->employee->visits()->exists()) {
                return $this->errorResponse('No se puede eliminar el usuario porque tiene visitas asociadas', null, 422);
            }

            $this->userRepository->delete($id);

            return $this->successResponse(null, 'Usuario eliminado exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function searchUsers(string $term, int $limit = 10): array
    {
        try {
            $users = $this->userRepository->search($term, $limit);

            return $this->successResponse($users, 'Usuarios encontrados exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getUsersByRole(string $roleName): array
    {
        try {
            $users = $this->userRepository->getByRole($roleName);

            return $this->successResponse($users, 'Usuarios obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updateUserLastLogin(int $userId): array
    {
        try {
            $success = $this->userRepository->updateLastLogin($userId);

            if (!$success) {
                return $this->errorResponse('Usuario no encontrado', null, 404);
            }

            return $this->successResponse(null, 'Último acceso actualizado exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function checkEmailAvailability(string $email, ?int $excludeUserId = null): array
    {
        try {
            $exists = $this->userRepository->emailExists($email, $excludeUserId);

            return $this->successResponse([
                'available' => !$exists,
                'email' => $email
            ], 'Disponibilidad de email verificada');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function checkUsernameAvailability(string $username, ?int $excludeUserId = null): array
    {
        try {
            $exists = $this->userRepository->usernameExists($username, $excludeUserId);

            return $this->successResponse([
                'available' => !$exists,
                'username' => $username
            ], 'Disponibilidad de username verificada');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}