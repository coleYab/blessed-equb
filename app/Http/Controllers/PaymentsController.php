<?php

namespace App\Http\Controllers;

use App\Models\Payments;
use App\Models\RecentActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PaymentsController extends Controller
{
    public function mypayments()
    {
        $payments = Payments::where('userId', Auth::user()->id)
            ->latest()
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => (string) $payment->id,
                    'userId' => $payment->userId,
                    'userName' => $payment->userName,
                    'userPhone' => $payment->userPhone,
                    'amount' => (float) $payment->amount,
                    'date' => $payment->created_at->toIso8601String(),
                    'receiptUrl' => $payment->receiptUrl,
                    'status' => $payment->status,
                    'requestedTicket' => $payment->requestedTicket ?? null,
                ];
            });

            return Inertia::render('mypayments', [
                'payments' => $payments
            ]);
    }

    public function adminpayments()
    {
        $payments = Payments::latest()->get();

        return Inertia::render('admin/payments', [
            'paymentRequest' => $payments
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'requestedTicket' => 'required|integer|min:1',
            'receipt' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Upload Image
        $path = $request->file('receipt')->store('receipts', 'public');

        $user = Auth::user();
        $payment = Payments::create([
            'userId' => $user->id,
            'userName' => $user->name,
            'userPhone' => $user->phoneNumber ?? '',
            'amount' => $request->amount,
            'receiptUrl' => '/storage/' . $path,
            'requestedTicket' => $request->requestedTicket,
        ]);

        RecentActivity::query()->create([
            'userId' => $user->id,
            'type' => 'PAYMENT_SUBMITTED',
            'status' => 'info',
            'title_en' => 'Payment submitted',
            'title_am' => null,
            'description_en' => 'Your payment receipt is under review.',
            'description_am' => null,
            'link' => $payment->receiptUrl,
            'cycle' => null,
            'meta' => [
                'paymentId' => $payment->id,
                'requestedTicket' => (int) $payment->requestedTicket,
                'amount' => (float) $payment->amount,
            ],
            'occurred_at' => now(),
        ]);

        return redirect()->route('mypayments')
            ->with('success', 'Payment request submitted successfully.');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $payment = Payments::where('userId', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'You cannot update this payment.');
        }

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'requestedTicket' => 'required|integer|min:1',
            'receipt' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('receipt')) {
            // Delete old receipt
            Storage::disk('public')->delete(str_replace('/storage/', '', $payment->receiptUrl));
            $path = $request->file('receipt')->store('receipts', 'public');
            $payment->receiptUrl = '/storage/' . $path;
        }

        $payment->amount = $request->amount;
        $payment->requestedTicket = $request->requestedTicket;
        $payment->save();

        return redirect()->route('mypayments')->with('success', 'Payment updated successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user->is_admin) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:APPROVED,REJECTED'
        ]);

        $payment = Payments::findOrFail($id);

        // Only allow change if currently PENDING
        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'Status cannot be changed.');
        }

        $payment->status = $request->status;
        $payment->save();

        RecentActivity::query()->create([
            'userId' => $payment->userId,
            'type' => $payment->status === 'APPROVED' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
            'status' => $payment->status === 'APPROVED' ? 'success' : 'error',
            'title_en' => $payment->status === 'APPROVED' ? 'Payment approved' : 'Payment rejected',
            'title_am' => null,
            'description_en' => $payment->status === 'APPROVED'
                ? 'Your payment was approved.'
                : 'Your payment was rejected.',
            'description_am' => null,
            'link' => $payment->receiptUrl,
            'cycle' => null,
            'meta' => [
                'paymentId' => $payment->id,
                'requestedTicket' => (int) $payment->requestedTicket,
                'amount' => (float) $payment->amount,
                'status' => $payment->status,
            ],
            'occurred_at' => now(),
        ]);

        return redirect()->route('admin.payments')->with('success', 'Payment status updated.');
    }

    public function delete($id)
    {
        $user = Auth::user();
        $payment = Payments::where('userId', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'You cannot delete this payment.');
        }

        Storage::disk('public')->delete(str_replace('/storage/', '', $payment->receiptUrl));

        $payment->delete();

        return redirect()->route('mypayments')->with('success', 'Payment deleted successfully.');
    }
}
