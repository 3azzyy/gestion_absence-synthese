<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = DB::table('settings')->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        // Accept either { settings: {...} } or just {...}
        $settingsData = $request->has('settings') ? $request->get('settings') : $request->all();

        foreach ($settingsData as $key => $value) {
            // Skip timestamp fields if they leaked into the request
            if (in_array($key, ['created_at', 'updated_at'])) continue;

            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => json_encode($value), 'updated_at' => now()]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
        ]);
    }
}