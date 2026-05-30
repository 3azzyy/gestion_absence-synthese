<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['group', 'absences'])->withCount('absences');

        if ($request->has('group_id')) {
            $query->byGroup($request->group_id);
        }

        if ($request->has('level')) {
            $query->byLevel($request->level);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }                               

        public function byClass(Request $request, $class)
    {
        $query = Student::with(['group', 'absences'])->where('class_group', $class)->withCount('absences');
        
        return response()->json([
            'success' => true,
            'data' => $query->get()
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
    // Validate including the new group logic fields
    $validated = $request->validate([
        'cef' => 'required|string|unique:students,cef',
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'cin' => 'nullable|string',
        'class_group' => 'required|string', // The name of the group (existing or new)
    ]);

    try {
        return DB::transaction(function () use ($request, $validated) {
            // 1. Find or create the group by name
            // This handles the "groupType" logic automatically
            $group = Group::firstOrCreate(
                ['name' => $request->class_group],
                ['description' => 'Groupe créé automatiquement via l\'ajout de stagiaire']
            );

            // 2. Create the student and link the group_id
            $student = Student::create([
                'cef' => $validated['cef'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'cin' => $validated['cin'],
                'group_id' => $group->id,      // Linking the foreign key
                'class_group' => $group->name, // Keeping your denormalized column in sync
                'hours' => 0,
                'tardies' => 0,
                'days_absent' => 0,
            ]);

            return response()->json([
                'success' => true,
                'data' => $student,
                'message' => 'Stagiaire ajouté et groupe lié avec succès'
            ], 201);
        });
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création: ' . $e->getMessage()
        ], 500);
    }
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
    
    public function setObservation(Request $request)
    {
        // 1. Find the student (findOrFail will throw a 404 if not found)
        $student = Student::findOrFail($request->id);
        
        // 2. Perform the update with an associative array
        $student->update([
            'observation' => $request->observation
        ]);
        
        // 3. Return the fresh data
        return response()->json([
            'success' => true,
            'data' => $student->fresh(), // .fresh() ensures you return the updated values
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


    public function statistics()
    {
        $stats = [
            'total_students' => Student::count(),
            'by_level' => Student::select('level', DB::raw('count(*) as count'))->groupBy('level')->get(),
            'top_absent' => Student::orderBy('hours', 'desc')->limit(5)->get(['first_name', 'last_name', 'hours']),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function DashboardStats(Request $request)
    {
        // 1. Total count of students
        $total = Student::count();

        // 2. Sum of all durations for 'absent' records
        $totalHours = \App\Models\Absence::where('status', 'absent')->sum('duration');
        $totalLate =  \App\Models\Absence::where('status', 'late')->count();

        // 3. Count students "At Risk" (e.g., > 5 days)
        $atRisk = Student::where('days_absent', '>', 7)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'atRisk' => $atRisk,
                'totalHours' => $totalHours * 2.5 / 1,
                'totalDays' => $totalHours / 2 + $totalLate / 4,
            ]
        ]);
    }

    public function bestStg(Request $request, $id_classe = null)
    {
        $topStudents = Student::where('class_group', $id_classe ? $id_classe : '!=', null)
            ->where('hours','<=', 10)
            ->orderBy('hours', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topStudents
        ]);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        
        // Supprime l'étudiant et ses absences (via le booted du modèle Student)
        $student->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Étudiant et ses absences archivés.'
        ]);
    }
    
    public function restore($id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $student->restore();
    
        return response()->json([
            'success' => true,
            'message' => 'Étudiant et ses absences restaurés.'
        ]);
    }

    public function exportCsv()
    {
        $students = Student::with('group')->get();
        $fileName = 'students_export_' . date('Y-m-d') . '.csv';

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['CEF', 'First Name', 'Last Name', 'Group', 'Email', 'Level', 'Hours'];

        $callback = function () use ($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($students as $student) {
                fputcsv($file, [
                    $student->cef,
                    $student->first_name,
                    $student->last_name,
                    $student->group?->name,
                    $student->email,
                    $student->level,
                    $student->hours,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt']);

        $file = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($file); // Skip header row

        $imported = 0;
        DB::beginTransaction();
        try {
            while (($row = fgetcsv($file)) !== FALSE) {
                // Map CSV columns to Database (Example mapping: 0=cef, 1=fn, 2=ln...)
                Student::updateOrCreate(
                    ['cef' => $row[0]],
                    [
                        'first_name' => $row[1],
                        'last_name'  => $row[2],
                        'email'      => $row[4] ?? null,
                        'level'      => $row[5] ?? null,
                    ]
                );
                $imported++;
            }
            DB::commit();
            return response()->json(['success' => true, 'message' => "Imported $imported students"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Import failed: ' . $e->getMessage()], 500);
        }
    }
}
