<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ExperienceController as AdminExperienceController;
use App\Http\Controllers\Api\Admin\MessageController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PublicTestimonialController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\VisitController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API - consumed by the React front end, no auth required
|--------------------------------------------------------------------------
*/

Route::get('/site', SiteController::class);

Route::get('/profile', [ContentController::class, 'profile']);
Route::get('/experiences', [ContentController::class, 'experiences']);
Route::get('/skills', [ContentController::class, 'skills']);
Route::get('/services', [ContentController::class, 'services']);
Route::get('/testimonials', [ContentController::class, 'testimonials']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

// Write endpoints are throttled - these are the only public POSTs.
Route::middleware('throttle:6,1')->group(function () {
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/testimonials', [PublicTestimonialController::class, 'store']);
});

Route::post('/track', [VisitController::class, 'store'])->middleware('throttle:60,1');

/*
|--------------------------------------------------------------------------
| Admin API - Sanctum bearer token
|--------------------------------------------------------------------------
*/

Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', DashboardController::class);

    Route::get('/profile', [AdminProfileController::class, 'show']);
    Route::put('/profile', [AdminProfileController::class, 'update']);
    Route::post('/profile/asset', [AdminProfileController::class, 'uploadAsset']);

    // Bound by id, not slug - the admin can rename a project's slug, so the
    // public slug binding on the model would be an unstable key here.
    Route::apiResource('projects', AdminProjectController::class)
        ->parameters(['projects' => 'project:id']);
    Route::apiResource('experiences', AdminExperienceController::class);
    Route::apiResource('skills', AdminSkillController::class);
    Route::apiResource('services', AdminServiceController::class);
    Route::apiResource('testimonials', AdminTestimonialController::class)->except('show');
    Route::patch('/testimonials/{testimonial}/approval', [AdminTestimonialController::class, 'toggleApproval']);

    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/{message}', [MessageController::class, 'show']);
    Route::patch('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
});
