<?php

namespace App\Services;

use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeService extends BaseService
{
    protected $employeeRepository;
    protected $userRepository;

    public function __construct(
        EmployeeRepositoryInterface $employeeRepository,
        UserRepositoryInterface $userRepository
    ) {
        $this->employeeRepository = $employeeRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Crear nuevo empleado
     *
     * @param array $data
     * @return array
     */
    public function createEmployee(array $data)
    {
        try {
            DB::beginTransaction();

            // Validar que no exista otro empleado con el mismo email
            $existingEmployee = $this->employeeRepository->findBy('email', $data['email']);
            if ($existingEmployee) {
                return $this->errorResponse('Ya existe un empleado con este email');
            }

            // Validar que no exista otro empleado con el mismo employee_id
            $existingEmployeeId = $this->employeeRepository->findBy('employee_id', $data['employee_id']);
            if ($existingEmployeeId) {
                return $this->errorResponse('Ya existe un empleado con este ID');
            }

            // Crear el empleado
            $employee = $this->employeeRepository->create([
                'employee_id' => $data['employee_id'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'department_id' => $data['department_id'] ?? null,
                'designation_id' => $data['designation_id'] ?? null,
                'headquarter_id' => $data['headquarter_id'] ?? null,
                'status' => $data['status'] ?? 'active',
                'joining_date' => $data['joining_date'] ?? now(),
                'address' => $data['address'] ?? null
            ]);

            DB::commit();

            Log::info('Empleado creado exitosamente', [
                'employee_id' => $employee->id,
                'employee_name' => $employee->full_name
            ]);

            return $this->successResponse($employee, 'Empleado creado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear empleado', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Actualizar empleado
     *
     * @param int $employeeId
     * @param array $data
     * @return array
     */
    public function updateEmployee($employeeId, array $data)
    {
        try {
            $employee = $this->employeeRepository->find($employeeId);
            
            if (!$employee) {
                return $this->errorResponse('Empleado no encontrado');
            }

            // Validar email único si se está actualizando
            if (isset($data['email']) && $data['email'] !== $employee->email) {
                $existingEmployee = $this->employeeRepository->findBy('email', $data['email']);
                if ($existingEmployee) {
                    return $this->errorResponse('Ya existe otro empleado con este email');
                }
            }

            // Validar employee_id único si se está actualizando
            if (isset($data['employee_id']) && $data['employee_id'] !== $employee->employee_id) {
                $existingEmployeeId = $this->employeeRepository->findBy('employee_id', $data['employee_id']);
                if ($existingEmployeeId) {
                    return $this->errorResponse('Ya existe otro empleado con este ID');
                }
            }

            $updatedEmployee = $this->employeeRepository->update($employeeId, $data);

            Log::info('Empleado actualizado exitosamente', [
                'employee_id' => $employeeId,
                'updated_data' => $data
            ]);

            return $this->successResponse($updatedEmployee, 'Empleado actualizado exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al actualizar empleado', [
                'employee_id' => $employeeId,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Desactivar empleado
     *
     * @param int $employeeId
     * @return array
     */
    public function deactivateEmployee($employeeId)
    {
        try {
            $employee = $this->employeeRepository->find($employeeId);
            
            if (!$employee) {
                return $this->errorResponse('Empleado no encontrado');
            }

            if ($employee->status === 'inactive') {
                return $this->errorResponse('El empleado ya está desactivado');
            }

            $updatedEmployee = $this->employeeRepository->update($employeeId, [
                'status' => 'inactive',
                'resignation_date' => now()
            ]);

            // Desactivar también el usuario asociado si existe
            if ($employee->user) {
                $this->userRepository->update($employee->user->id, [
                    'status' => 'inactive'
                ]);
            }

            Log::info('Empleado desactivado exitosamente', [
                'employee_id' => $employeeId
            ]);

            return $this->successResponse($updatedEmployee, 'Empleado desactivado exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al desactivar empleado', [
                'employee_id' => $employeeId,
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Obtener estadísticas del empleado
     *
     * @param int $employeeId
     * @return array
     */
    public function getEmployeeStatistics($employeeId)
    {
        try {
            $employee = $this->employeeRepository->find($employeeId);
            
            if (!$employee) {
                return $this->errorResponse('Empleado no encontrado');
            }

            $visitStats = $this->employeeRepository->getEmployeeVisitStats($employeeId);
            $totalVisits = $this->employeeRepository->countEmployeeVisits($employeeId);

            $statistics = [
                'employee_info' => [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'email' => $employee->email,
                    'status' => $employee->status,
                    'department' => $employee->department->name ?? null,
                    'designation' => $employee->designation->name ?? null,
                    'headquarter' => $employee->headquarter->name ?? null
                ],
                'visit_statistics' => array_merge($visitStats, [
                    'total_visits' => $totalVisits
                ]),
                'user_account' => $employee->user ? [
                    'id' => $employee->user->id,
                    'username' => $employee->user->username,
                    'email' => $employee->user->email,
                    'status' => $employee->user->status,
                    'last_login' => $employee->user->last_login_at
                ] : null
            ];

            return $this->successResponse($statistics, 'Estadísticas del empleado obtenidas exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas del empleado', [
                'employee_id' => $employeeId,
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Buscar empleados
     *
     * @param string $search
     * @return array
     */
    public function searchEmployees($search)
    {
        try {
            $employees = $this->employeeRepository->searchEmployees($search);

            return $this->successResponse($employees, 'Búsqueda de empleados completada');

        } catch (\Exception $e) {
            Log::error('Error al buscar empleados', [
                'search' => $search,
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }
}