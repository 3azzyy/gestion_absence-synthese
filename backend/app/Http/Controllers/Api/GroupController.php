<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
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
            'name' => 'required|string|unique:groups,name',
        ]);

        // Using the Facade makes it clear to Intelephense that this returns an ID
        $authId = Auth::id() ?? 'System';

        $group = Group::create([
            'name' => $validated['name'],
            'description' => "Manually created by user ID: " . $authId,
        ]);

        return response()->json([
            'success' => true,
            'data' => $group,
            'message' => 'Groupe créé avec succès'
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
        
        // Le 'booted' du modèle s'occupe de supprimer les étudiants et les absences
        $group->delete(); 
    
        return response()->json([
            'success' => true,
            'message' => 'Groupe et toutes les données associées archivés.'
        ]);
    }


    public function restore($id)
    {
        // On utilise withTrashed() pour trouver le groupe dans la corbeille
        $group = Group::withTrashed()->findOrFail($id);
        
        // Le 'booted' du modèle restaurera aussi les étudiants et les absences
        $group->restore();
    
        return response()->json([
            'success' => true,
            'message' => 'Groupe et toutes les données associées restaurés.'
        ]);
    }


    public function trashed()
    {
        // Récupère uniquement les groupes supprimés pour votre "Corbeille"
        $groups = Group::onlyTrashed()->get();
        return response()->json($groups);
    }
    
    
}
