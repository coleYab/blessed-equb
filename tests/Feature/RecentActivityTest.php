<?php

use App\Models\Payments;
use App\Models\RecentActivity;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('registration creates a joined recent activity', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect(RecentActivity::query()->where('userId', $user->id)->where('type', 'JOINED')->exists())->toBeTrue();
});

test('submitting a payment creates a payment submitted recent activity', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->post(route('payments.store'), [
            'amount' => 2000,
            'requestedTicket' => 12,
            'receipt' => UploadedFile::fake()->image('receipt.jpg'),
        ])
        ->assertRedirect(route('mypayments'));

    expect(RecentActivity::query()->where('userId', $user->id)->where('type', 'PAYMENT_SUBMITTED')->exists())->toBeTrue();
});

test('admin approving a payment creates a payment approved recent activity for the payment user', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $payment = Payments::factory()->create([
        'userId' => $user->id,
        'status' => 'PENDING',
    ]);

    $this
        ->actingAs($admin)
        ->put(route('payments.updateStatus', ['id' => $payment->id]), [
            'status' => 'APPROVED',
        ])
        ->assertRedirect(route('admin.payments'));

    expect(RecentActivity::query()->where('userId', $user->id)->where('type', 'PAYMENT_APPROVED')->exists())->toBeTrue();
});

test('recent activities endpoint returns only the authenticated users activities', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    RecentActivity::factory()->create(['userId' => $user->id, 'type' => 'JOINED']);
    RecentActivity::factory()->create(['userId' => $other->id, 'type' => 'JOINED']);

    $this
        ->actingAs($user)
        ->getJson(route('recent-activities.index'))
        ->assertSuccessful()
        ->assertJsonCount(1, 'data');
});
