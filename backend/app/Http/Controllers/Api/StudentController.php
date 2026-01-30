<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with('group')->withCount('absences');

        if ($request->has('group_id')) {
            $query->byGroup($request->group_id);
        }

        if ($request->has('level')) {
            $query->byLevel($request->level);
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate($request->get('per_page', 15))
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->get('q');
        $students = Student::search($search)->with('group')->get();

        return response()->json([
            'success' => true,
            'data' => $students
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cef' => 'required|string|unique:students',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'group_id' => 'nullable|exists:groups,id',
            'email' => 'nullable|email',
            'cin' => 'nullable|string',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'success' => true,
            'data' => $student,
            'message' => 'Student created successfully'
        ], 201);
    }

    public function show($id)
    {
        $student = Student::with(['group', 'absences.creator'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $student,
            'current_sanction' => $student->getCurrentSanction()
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $validated = $request->validate([
            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'group_id' => 'sometimes|nullable|exists:groups,id',
            'email' => 'sometimes|nullable|email',
        ]);

        $student->update($validated);

        return response()->json([
            'success' => true,
            'data' => $student,
            'message' => 'Student updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully'
        ]);
    }

    public function statistics()
    {
        $stats = [
            'total_students' => Student::count(),
            'by_level' => Student::select('level', DB::raw('count(*) as count'))->groupBy('level')->get(),
            'top_absent' => Student::orderBy('hours', 'desc')->limit(5)->get(['first_name', 'last_name', 'hours']),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function exportCsv() { /* Implement CSV logic */ return response()->json(['message' => 'Export started']); }
    public function import(Request $request) { /* Implement Import logic */ return response()->json(['message' => 'Import started']); }
}