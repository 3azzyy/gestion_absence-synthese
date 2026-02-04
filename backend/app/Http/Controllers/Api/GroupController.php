<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use function Laravel\Prompts\search;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $groups = Group::withCount('students');

        if ($search) {
            $groups = $groups->where('name', 'like', "%$search%");
        }

        $groups = $groups->get();

        return response()->json([
            'success' => true,
            'data' => $groups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:groups',
            'description' => 'nullable|string',
        ]);

        $group = Group::create($validated);

        return response()->json([
            'success' => true,
            'data' => $group,
            'message' => 'Group created successfully',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:groups,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return response()->json([
            'success' => true,
            'data' => $group,
            'message' => 'Group updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        
        if ($group->students()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete group with students',
            ], 400);
        }

        $group->delete();

        return response()->json([
            'success' => true,
            'message' => 'Group deleted successfully',
        ]);
    }
}