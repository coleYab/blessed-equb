<?php

namespace App\Http\Controllers;

use App\Models\RecentActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecentActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $limit = (int) $request->integer('limit', 20);
        $limit = max(1, min(100, $limit));

        $activities = RecentActivity::query()
            ->where('userId', $user->id)
            ->latest('occurred_at')
            ->latest('id')
            ->limit($limit)
            ->get()
            ->map(fn (RecentActivity $activity): array => $activity->toFrontendPayload())
            ->values();

        return response()->json([
            'data' => $activities,
        ]);
    }
}
