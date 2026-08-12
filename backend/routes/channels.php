<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function (User $user, int $id) {
    return $user->id === $id;
});

/**
 * Everything on the admin dashboard - live enquiries and the visitor feed -
 * rides this one private channel. Any authenticated admin may listen.
 */
Broadcast::channel('admin', function (User $user) {
    return ['id' => $user->id, 'name' => $user->name];
});
