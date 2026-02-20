<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Payments;
use App\Models\RecentActivity;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 5000 tickets
        /*
        for ($i = 1; $i <= 5000; $i++) {
            Ticket::create([
                'ticketNumber' => $i,
                'status' => 'AVAILABLE',
                'userId' => null,
                'paymentId' => null,
            ]);
        }
        /*/
        $user = User::first();
        /*

        // Create 10 payment requests and assign each to a random ticket
        for ($i = 1; $i <= 10; $i++) {
            $payment = Payments::create([
                'userId' => $user->id,
                'userName' => $user->name,
                'userPhone' => '1234567890',
                'amount' => rand(50, 500), // random amount
                'receiptUrl' => "https://hips.hearstapps.com/hmg-prod/images/future-cars-2-6939c3d6c9abe.jpg",
                'requestedTicket' => $i, // example ticket request
            ]);

            // Assign this payment to a random available ticket
            $ticket = Ticket::where('status', 'AVAILABLE')->inRandomOrder()->first();
            if ($ticket) {
                $ticket->update([
                    'status' => 'RESERVED',
                    'userId' => $user->id,
                    'paymentId' => $payment->id,
                    'reservedAt' => now(),
                ]);
            }
        }

        */
        RecentActivity::factory()->count(10)->create([
            'userId' => $user->id
        ]);
    }
}
