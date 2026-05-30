<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SanctionConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SanctionController extends Controller
{
    public function index()
    {
        $sanctions = SanctionConfig::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $sanctions,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sanctions' => 'required|array',
            'sanctions.*.id' => 'required|exists:sanction_configs,id',
            'sanctions.*.threshold' => 'required|numeric|min:0',
            'sanctions.*.is_active' => 'sometimes|boolean',
            'sanctions.*.actions' => 'sometimes|array',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['sanctions'] as $sanctionData) {
                $sanction = SanctionConfig::find($sanctionData['id']);
                $sanction->update($sanctionData);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Sanctions updated successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sanctions',
            ], 500);
        }
    }
}