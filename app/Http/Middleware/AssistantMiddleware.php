<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AssistantMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->user()->role !== 'assistant') {
            abort(403);
        }
        return $next($request);
    }
}
