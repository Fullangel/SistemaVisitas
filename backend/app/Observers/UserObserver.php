<?php

namespace App\Observers;

use App\Models\User;

class UserObserver extends BaseObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function created(User $user)
    {
        $this->logActivity($user, 'created', [
            'username' => $user->username,
            'email' => $user->email,
            'role_id' => $user->role_id,
            'status' => $user->status
        ]);
    }

    /**
     * Handle the User "updated" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        $changes = $this->getChanges($user);
        
        // Sanitizar datos sensibles
        $changes = $this->sanitizeData($changes);

        $this->logActivity($user, 'updated', $changes);
    }

    /**
     * Handle the User "deleted" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        $this->logActivity($user, 'deleted', [
            'username' => $user->username,
            'email' => $user->email,
            'deleted_at' => now()->toDateTimeString()
        ]);
    }

    /**
     * Handle the User "restored" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        $this->logActivity($user, 'restored', [
            'username' => $user->username,
            'email' => $user->email,
            'restored_at' => now()->toDateTimeString()
        ]);
    }

    /**
     * Handle the User "forceDeleted" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        $this->logActivity($user, 'force_deleted', [
            'username' => $user->username,
            'email' => $user->email,
            'force_deleted_at' => now()->toDateTimeString()
        ]);
    }
}