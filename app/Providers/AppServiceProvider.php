<?php

namespace App\Providers;

use App\Models\AppSetting;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('settings', function() {
            $settings = AppSetting::first();

            if (! $settings) {
                return null;
            }

            return [
                'id' => $settings->id,
                'cycle' => $settings->cycle,
                'daysRemaining' => $settings->days_remaining,
                'drawDate' => optional($settings->draw_date)->toDateString(),
                'prizeName' => $settings->prize_name,
                'prizeValue' => $settings->prize_value,
                'prizeImage' => $settings->prize_image,
                'prizeImages' => $settings->prize_images,
                'liveStreamUrl' => $settings->live_stream_url,
                'isLive' => $settings->is_live,
                'registrationEnabled' => $settings->registration_enabled,
                'ticketSelectionEnabled' => $settings->ticket_selection_enabled,
                'winnerAnnouncementMode' => $settings->winner_announcement_mode,
                'nextDrawDateEn' => $settings->next_draw_date_en,
                'nextDrawDateAm' => $settings->next_draw_date_am,
                'potValue' => $settings->pot_value,
                'totalMembers' => $settings->total_members,
                'carsDelivered' => $settings->cars_delivered,
                'trustScore' => $settings->trust_score,
            ];
        });

        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
