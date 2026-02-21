<?php

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

test('admin users page is displayed', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($admin)
        ->get(route('admin.users'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users')
            ->has('users')
        );
});

test('admin can create a user and send password setup email', function () {
    Notification::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'new-user@example.com',
            'phone' => '0911000000',
            'status' => 'PENDING',
            'joinedDate' => '2026-02-21',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertSessionHas('status', 'User created and password setup email sent.')
        ->assertRedirect(route('admin.users'));

    $user = User::query()->where('email', 'new-user@example.com')->firstOrFail();

    expect($user->name)->toBe('New User');
    expect($user->phoneNumber)->toBe('0911000000');
    expect($user->email_verified_at)->toBeNull();

    Notification::assertSentTo($user, ResetPassword::class);
});

test('admin can create a user with multiple ticket numbers and they are marked as sold', function () {
    Notification::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    Ticket::factory()->create(['ticketNumber' => 120, 'status' => 'AVAILABLE']);
    Ticket::factory()->create(['ticketNumber' => 121, 'status' => 'AVAILABLE']);

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Ticket User',
            'email' => 'ticket-user@example.com',
            'phone' => '0911222333',
            'status' => 'PENDING',
            'ticketNumbers' => [120, 121],
        ]);

    $response->assertSessionHasNoErrors();

    $user = User::query()->where('email', 'ticket-user@example.com')->firstOrFail();

    expect(Ticket::query()->where('ticketNumber', 120)->value('userId'))->toBe($user->id);
    expect(Ticket::query()->where('ticketNumber', 121)->value('userId'))->toBe($user->id);
    expect(Ticket::query()->where('ticketNumber', 120)->value('status'))->toBe('SOLD');
    expect(Ticket::query()->where('ticketNumber', 121)->value('status'))->toBe('SOLD');

    Notification::assertSentTo($user, ResetPassword::class);
});

test('admin user create validates required fields', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'phone' => '',
            'status' => 'INVALID',
        ]);

    $response->assertSessionHasErrors(['name', 'email', 'phone', 'status']);
});

test('non-admin authenticated users cannot access admin users', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.users'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'new-user@example.com',
            'phone' => '0911000000',
            'status' => 'PENDING',
        ])
        ->assertForbidden();
});

test('guests cannot access admin users', function () {
    $this->get(route('admin.users'))->assertRedirect(route('login'));
    $this->post(route('admin.users.store'))->assertRedirect(route('login'));
});
