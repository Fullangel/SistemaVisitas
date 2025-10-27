<?php

namespace App\Transformers;

use App\Models\Visit;

class VisitTransformer extends BaseTransformer
{
    /**
     * Transformar una visita
     *
     * @param Visit $visit
     * @return array
     */
    public function transform($visit): array
    {
        return [
            'id' => $visit->id,
            'visitor_name' => $visit->visitor_name,
            'visitor_email' => $visit->visitor_email,
            'visitor_phone' => $visit->visitor_phone,
            'visitor_company' => $visit->visitor_company,
            'visit_date' => $visit->visit_date,
            'visit_time' => $visit->visit_time,
            'purpose' => $visit->purpose,
            'status' => $visit->status,
            'notes' => $visit->notes,
            'completion_notes' => $visit->completion_notes,
            'cancellation_reason' => $visit->cancellation_reason,
            'employee' => $visit->employee ? [
                'id' => $visit->employee->id,
                'employee_id' => $visit->employee->employee_id,
                'full_name' => $visit->employee->full_name,
                'email' => $visit->employee->email,
                'phone' => $visit->employee->phone,
                'department' => $visit->employee->department->name ?? null,
                'designation' => $visit->employee->designation->name ?? null,
                'headquarter' => $visit->employee->headquarter->name ?? null
            ] : null,
            'created_by' => $visit->created_by_user ? [
                'id' => $visit->created_by_user->id,
                'full_name' => $visit->created_by_user->full_name,
                'email' => $visit->created_by_user->email
            ] : null,
            'cancelled_by' => $visit->cancelled_by_user ? [
                'id' => $visit->cancelled_by_user->id,
                'full_name' => $visit->cancelled_by_user->full_name
            ] : null,
            'completed_at' => $this->formatDate($visit->completed_at),
            'cancelled_at' => $this->formatDate($visit->cancelled_at),
            'created_at' => $this->formatDate($visit->created_at),
            'updated_at' => $this->formatDate($visit->updated_at)
        ];
    }

    /**
     * Transformar visita para listado (versión simplificada)
     *
     * @param Visit $visit
     * @return array
     */
    public function transformForList($visit): array
    {
        return [
            'id' => $visit->id,
            'visitor_name' => $visit->visitor_name,
            'visitor_company' => $visit->visitor_company,
            'visit_date' => $visit->visit_date,
            'visit_time' => $visit->visit_time,
            'purpose' => $visit->purpose,
            'status' => $visit->status,
            'employee' => $visit->employee ? [
                'id' => $visit->employee->id,
                'full_name' => $visit->employee->full_name,
                'department' => $visit->employee->department->name ?? null
            ] : null,
            'created_at' => $this->formatDate($visit->created_at)
        ];
    }

    /**
     * Transformar visita para calendario
     *
     * @param Visit $visit
     * @return array
     */
    public function transformForCalendar($visit): array
    {
        return [
            'id' => $visit->id,
            'title' => $visit->visitor_name . ' - ' . $visit->purpose,
            'start' => $visit->visit_date . 'T' . $visit->visit_time,
            'end' => $visit->visit_date . 'T' . $visit->visit_time,
            'status' => $visit->status,
            'employee' => $visit->employee ? $visit->employee->full_name : null,
            'visitor_company' => $visit->visitor_company,
            'notes' => $visit->notes,
            'color' => $this->getStatusColor($visit->status)
        ];
    }

    /**
     * Obtener color según estado
     *
     * @param string $status
     * @return string
     */
    protected function getStatusColor($status): string
    {
        $colors = [
            'scheduled' => '#007bff',
            'confirmed' => '#28a745',
            'completed' => '#6c757d',
            'cancelled' => '#dc3545',
            'no_show' => '#ffc107'
        ];

        return $colors[$status] ?? '#6c757d';
    }
}