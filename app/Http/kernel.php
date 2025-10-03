protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
    // Add your middleware here
    'assistant' => \App\Http\Middleware\AssistantMiddleware::class,
    'attach.role' => \App\Http\Middleware\AttachUserRole::class,
    
];
