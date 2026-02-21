<?php

use App\Models\AppSetting;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin settings page is displayed for admins', function () {
    $user = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($user)
        ->get(route('admin.settings'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings')
            ->has('settings')
        );
});

test('admin settings can be updated', function () {
    $user = User::factory()->create(['is_admin' => true]);
    AppSetting::factory()->create();

    $response = $this
        ->actingAs($user)
        ->put(route('admin.settings.update'), [
            'cycle' => 2,
            'daysRemaining' => 7,
            'drawDate' => '2026-03-15',
            'prizeName' => 'Test Prize',
            'prizeValue' => 'ETB 5M',
            'prizeImage' => 'https://example.com/prize.jpg',
            'liveStreamUrl' => 'https://youtube.com/watch?v=test',
            'isLive' => true,
            'registrationEnabled' => false,
            'ticketSelectionEnabled' => false,
            'winnerAnnouncementMode' => true,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertSessionHas('status', 'Settings saved successfully.')
        ->assertRedirect(route('admin.settings'));

    $settings = AppSetting::query()->firstOrFail();
    expect($settings->cycle)->toBe(2);
    expect($settings->days_remaining)->toBe(7);
    expect($settings->draw_date->format('Y-m-d'))->toBe('2026-03-15');
    expect($settings->prize_name)->toBe('Test Prize');
    expect($settings->prize_value)->toBe('ETB 5M');
    expect($settings->is_live)->toBeTrue();
    expect($settings->registration_enabled)->toBeFalse();
    expect($settings->ticket_selection_enabled)->toBeFalse();
    expect($settings->winner_announcement_mode)->toBeTrue();
});

test('admin settings validates required fields', function () {
    $user = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($user)
        ->put(route('admin.settings.update'), [
            'cycle' => 'invalid',
            'daysRemaining' => -1,
            'drawDate' => '',
            'prizeName' => '',
            'prizeValue' => '',
            'isLive' => 'not-bool',
            'registrationEnabled' => '',
            'ticketSelectionEnabled' => '',
            'winnerAnnouncementMode' => '',
        ]);

    $response
        ->assertSessionHasErrors(['cycle', 'daysRemaining', 'drawDate', 'prizeName', 'prizeValue']);
});

test('unauthenticated users cannot access admin settings', function () {
    $response = $this->get(route('admin.settings'));

    $response->assertRedirect(route('login'));
});

test('non-admin authenticated users cannot access admin settings', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.settings'))
        ->assertForbidden();
});
