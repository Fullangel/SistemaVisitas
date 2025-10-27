<?php

namespace App\Observers;

use App\Models\VisitAttachment;

class VisitAttachmentObserver
{
    /**
     * Handle the VisitAttachment "creating" event.
     */
    public function creating(VisitAttachment $visitAttachment): void
    {
        if (empty($visitAttachment->upload_date)) {
            $visitAttachment->upload_date = now()->toDateString();
        }
    }
}