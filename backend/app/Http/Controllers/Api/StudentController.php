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

    public function DashboardStats(Request $request)
    {
        // 1. Total count of students
        $total = Student::count();

        // 2. Sum of all durations for 'absent' records
        $totalHours = \App\Models\Absence::where('status', 'absent')->sum('duration');

        // 3. Count students "At Risk" (e.g., > 5 days)
        $atRisk = Student::where('days_absent', '>', 5)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'atRisk' => $atRisk,
                'totalHours' => $totalHours * 2.5 / 1,
                'totalDays' => $totalHours * 2.5 / 10,
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
