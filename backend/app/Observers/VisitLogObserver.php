<?php

namespace App\Observers;

use App\Models\VisitLog;

class VisitLogObserver
{
    /**
     * Handle the VisitLog "creating" event.
     */
    public function creating(VisitLog $visitLog): void
    {
        if (empty($visitLog->log_date)) {
            $visitLog->log_date = now()->toDateString();
        }
    }
}