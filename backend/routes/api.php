<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SanctionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Students routes
    Route::prefix('students')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::get('/search', [StudentController::class, 'search']);
        Route::get('/export/csv', [StudentController::class, 'exportCsv']);
        Route::post('/import', [StudentController::class, 'import']);
        Route::get('/statistics', [StudentController::class, 'statistics']);
        Route::get('/{id}', [StudentController::class, 'show']);
        Route::post('/', [StudentController::class, 'store']);
        Route::put('/{id}', [StudentController::class, 'update']);
        Route::delete('/{id}', [StudentController::class, 'destroy']);
        
        // Student absences
        Route::get('/{studentId}/absences', [AbsenceController::class, 'studentAbsences']);
        Route::post('/{studentId}/absences', [AbsenceController::class, 'store']);
    });

    // Absences routes
    Route::prefix('absences')->group(function () {
        Route::get('/', [AbsenceController::class, 'index']);
        Route::get('/statistics', [AbsenceController::class, 'statistics']);
        Route::put('/{id}', [AbsenceController::class, 'update']);
        Route::delete('/{id}', [AbsenceController::class, 'destroy']);
    });

    // Groups routes
    Route::prefix('groups')->group(function () {
        Route::get('/', [GroupController::class, 'index']);
        Route::post('/', [GroupController::class, 'store']);
        Route::put('/{id}', [GroupController::class, 'update']);
        Route::delete('/{id}', [GroupController::class, 'destroy']);
    });

    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::put('/', [SettingsController::class, 'update']);
    });

    // Sanctions routes
    Route::prefix('sanctions')->group(function () {
        Route::get('/config', [SanctionController::class, 'index']);
        Route::put('/config', [SanctionController::class, 'update']);
    });
});