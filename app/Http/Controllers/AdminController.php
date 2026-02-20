<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inerita\Inertia;

class AdminController extends Controller
{
    public function dashoard() {
        return Inertia::render('app/settings', []);
    }
}
