<?php

use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\AppSettingsController;
use App\Http\Controllers\AppNotificationReadController;
use App\Http\Controllers\RecentActivityController;
use App\Http\Controllers\Admin\WinnerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('ticket-board', [TicketController::class, 'publicTicketBoard'])
    ->name('public.ticket-board');

Route::get('tickets/public-check-availability', [TicketController::class, 'publicCheckAvailability'])
    ->name('tickets.public-check-availability');

Route::get('/prizes', function () {
    return Inertia::render('prizes', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('prizes');

Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');


Route::get('dashboard', [TicketController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('dashboard/ticket-board', [TicketController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.ticket-board');

Route::get('tickets/check-availability', [TicketController::class, 'checkAvailability'])
    ->middleware(['auth', 'verified'])
    ->name('tickets.check-availability');

// this are admin routes
Route::get('admin/settings', [AppSettingsController::class, 'index'])->middleware(['auth', 'verified'])->name('admin.settings');
Route::put('admin/settings', [AppSettingsController::class, 'store'])->middleware(['auth', 'verified'])->name('admin.settings.update');
Route::get('admin/notifications', [AppSettingsController::class, 'notifications'])->middleware(['auth', 'verified'])->name('admin.notifications');
Route::post('admin/notifications', [AppSettingsController::class, 'notificationsStore'])->middleware(['auth', 'verified'])->name('admin.notifications.store');
Route::get('admin/payments', [AppSettingsController::class, 'payments'])->middleware(['auth', 'verified'])->name('admin.payments');
Route::get('admin/users', [AppSettingsController::class, 'user'])->middleware(['auth', 'verified'])->name('admin.users');
Route::get('admin/prize', [AppSettingsController::class, 'prize'])->middleware(['auth', 'verified'])->name('admin.prize');
Route::get('admin/cycle', [AppSettingsController::class, 'cycle'])->middleware(['auth', 'verified'])->name('admin.cycle');
Route::get('admin/dashboard', [AppSettingsController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('admin.dashboard');

Route::post('admin/winners/announce', [WinnerController::class, 'announce'])
    ->middleware(['auth', 'verified', 'is_admin']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/mypayments', [PaymentsController::class, 'mypayments'])->name('mypayments');
    Route::post('/payments', [PaymentsController::class, 'store'])->name('payments.store');
    Route::put('/payments/{id}', [PaymentsController::class, 'update'])->name('payments.update');
    Route::delete('/payments/{id}', [PaymentsController::class, 'delete'])->name('payments.delete');
    Route::get('/recent-activities', [RecentActivityController::class, 'index'])->name('recent-activities.index');

    Route::post('/notifications/{notification}/read', [AppNotificationReadController::class, 'store'])
        ->name('user.notifications.read');
    Route::post('/notifications/read-all', [AppNotificationReadController::class, 'storeAll'])
        ->name('user.notifications.read-all');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/payments', [PaymentsController::class, 'adminpayments'])->name('admin.payments');
    Route::put('/admin/payments/{id}/status', [PaymentsController::class, 'updateStatus'])->name('payments.updateStatus');
});


// this are the normal routes
Route::get('myticket', [TicketController::class, 'tickets'])->middleware(['auth', 'verified'])->name('user.mytickets');
Route::get('mycycle', [TicketController::class, 'mycycle'])->middleware(['auth', 'verified'])->name('user.mycycle');
// Route::get('mypayments', [TicketController::class, 'mypayments'])->middleware(['auth', 'verified'])->name('user.mypaymnets');
Route::get('mywinnings', [TicketController::class, 'mywinnings'])->middleware(['auth', 'verified'])->name('user.mywinnings');
Route::get('notifications', [TicketController::class, 'notifications'])->middleware(['auth', 'verified'])->name('user.mynotifications');

require __DIR__ . '/settings.php';
