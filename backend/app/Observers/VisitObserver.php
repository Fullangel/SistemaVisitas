<?php

namespace App\Observers;

use App\Models\Visit;

class VisitObserver extends BaseObserver
{
    /**
     * Handle the Visit "created" event.
     *
     * @param  \App\Models\Visit  $visit
     * @return void
     */
    public function created(Visit $visit)
    {
        $this->logActivity($visit, 'created', [
            'visitor_name' => $visit->visitor_name,
            'visitor_email' => $visit->visitor_email,
            'visit_date' => $visit->visit_date,
            'visit_time' => $visit->visit_time,
            'purpose' => $visit->purpose,
            'employee_id' => $visit->employee_id,
            'status' => $visit->status
        ]);
    }

    /**
     * Handle the Visit "updated" event.
     *
     * @param  \App\Models\Visit  $visit
     * @return void
     */
    public function updated(Visit $visit)
    {
        $changes = $this->getChanges($visit);
        
        // Detectar cambios de estado importantes
        if (isset($changes['status'])) {
            $this->logStatusChange($visit, $changes['status']);
        }

        $this->logActivity($visit, 'updated', $changes);
    }

    /**
     * Handle the Visit "deleted" event.
     *
     * @param  \App\Models\Visit  $visit
     * @return void
     */
    public function deleted(Visit $visit)
    {
        $this->logActivity($visit, 'deleted', [
            'visitor_name' => $visit->visitor_name,
            'visit_date' => $visit->visit_date,
            'deleted_at' => now()->toDateTimeString()
        ]);
    }

    /**
     * Log de cambio de estado específico
     *
     * @param Visit $visit
     * @param array $statusChange
     * @return void
     */
    protected function logStatusChange(Visit $visit, array $statusChange)
    {
        $oldStatus = $statusChange['old'];
        $newStatus = $statusChange['new'];

        $this->logActivity($visit, 'status_changed', [
            'from_status' => $oldStatus,
            'to_status' => $newStatus,
            'visitor_name' => $visit->visitor_name,
            'visit_date' => $visit->visit_date
        ]);

        // Log adicional para ciertos cambios de estado
        if ($newStatus === 'completed') {
            $this->logActivity($visit, 'visit_completed', [
                'visitor_name' => $visit->visitor_name,
                'visit_date' => $visit->visit_date,
                'completed_at' => $visit->completed_at
            ]);
        } elseif ($newStatus === 'cancelled') {
            $this->logActivity($visit, 'visit_cancelled', [
                'visitor_name' => $visit->visitor_name,
                'visit_date' => $visit->visit_date,
                'cancellation_reason' => $visit->cancellation_reason,
                'cancelled_at' => $visit->cancelled_at
            ]);
        }
    }
}