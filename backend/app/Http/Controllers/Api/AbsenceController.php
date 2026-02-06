<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Log;

class AbsenceController extends Controller
{
    public function index(Request $request)
    {
        $query = Absence::with(['student', 'creator']);

        // Date range filter
        if ($request->filled(['date_from', 'date_to'])) {
            $query->whereBetween('date', [$request->date_from, $request->date_to]);
        }

        // Student filter
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Group filter
        if ($request->has('group')) {
            $query->byGroup($request->group);
        }

        // Status filter
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Session filter
        if ($request->has('session')) {
            $query->where('session', $request->input('session'));
        }

        // Sorting
        $sortBy = $request->get('sort', 'date');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $absences = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $absences,
        ]);
    }

    public function store(Request $request, $studentId)
    {
        $student = Student::findOrFail($studentId);

        // Validate that we received an array of absences
        $request->validate([
            'absences' => 'required|array',
            'absences.*.date' => 'required|date',
            'absences.*.isRetard' => 'required|boolean',
            'absences.*.heures' => 'required|numeric',
        ]);

        DB::transaction(function () use ($request, $studentId, $student) {
            foreach ($request->absences as $abs) {
                Absence::create([
                    'student_id' => $studentId,
                    'date' => $abs['date'],
                    // If it's a retard, type is hours, otherwise it's a session
                    'type' => $abs['isRetard'] ? 'hours' : 'session',
                    'duration' => $abs['heures'],
                    // FIX: Use the status sent from React, or fallback to 'late' if isRetard is true
                    'status' => $abs['isRetard'] ? 'late' : ($abs['status'] ?? 'absent'),
                    'session' => $this->mapSeancesToSession($abs['seances'] ?? []),
                    'reason' => $abs['reason'] ?? null,
                    'created_by' => Auth::id(),
                ]);
            }
            $this->updateStudentCounters($student);
        });

        return response()->json(['success' => true, 'message' => 'Records saved']);
    }

    private function mapSeancesToSession(array $seances): ?string
    {
        if ($seances['seance1'] ?? false)
            return 'S1';
        if ($seances['seance2'] ?? false)
            return 'S2';
        if ($seances['seance3'] ?? false)
            return 'S3';
        if ($seances['seance4'] ?? false)
            return 'S4';
        return null;
    }

    public function studentAbsences($studentId)
    {
        $student = Student::findOrFail($studentId);

        $absences = $student->absences()
            ->with('creator')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $absences,
        ]);
    }

    public function update(Request $request, $id)
    {
        $absence = Absence::findOrFail($id);

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'type' => 'sometimes|in:hours,days,session',
            'duration' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:absent,justified,late,present',
            'reason' => 'nullable|string',
            'session' => 'nullable|in:S1,S2,S3,S4',
        ]);

        $absence->update($validated);

        // Update student counters
        $this->updateStudentCounters($absence->student);

        return response()->json([
            'success' => true,
            'data' => $absence->load(['student', 'creator']),
            'message' => 'Absence updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $absence = Absence::findOrFail($id);
        $student = $absence->student;

        $absence->delete();

        // Update student counters
        $this->updateStudentCounters($student);

        return response()->json([
            'success' => true,
            'message' => 'Absence deleted successfully',
        ]);
    }

    public function statistics(Request $request)
    {
        $query = Absence::query();

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->byDateRange($request->date_from, $request->date_to);
        }

        if ($request->has('group')) {
            $query->byGroup($request->group);
        }

        $stats = [
            'total' => $query->count(),
            'by_status' => (clone $query)->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get(),
            'by_session' => (clone $query)->select('session', DB::raw('count(*) as count'))
                ->groupBy('session')
                ->whereNotNull('session')
                ->get(),
            'by_date' => (clone $query)->select('date', DB::raw('count(*) as count'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->limit(30)
                ->get(),
            'by_type' => (clone $query)->select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    private function updateStudentCounters(Student $student)
    {

        $absences = $student->absences()->get();

        $rawHours = $absences->where('status', 'absent')->sum('duration');

        $calculatedDays = ($rawHours * 2.5) / 10;

        $student->update([
            'hours' => $rawHours * 2.5,
            'tardies' => $absences->where('status', 'late')->count(),
            'days_absent' => $calculatedDays,
            'justified_absences' => $absences->where('status', 'justified')->count(),
        ]);
    }

    public function WorstStg(Request $request, $id_classe = null)
    {
        // 1. Date Range Logic
        if ($request->has(['date_from', 'date_to'])) {
            $start = $request->date_from;
            $end = $request->date_to;
            $period = 'Custom Range';
        } else {
            $start = Carbon::now()->startOfWeek()->toDateString();
            $end = Carbon::now()->endOfWeek()->toDateString();
            $period = 'Weekly Default';
        }


        // 2. Aggregate Absences
        $absences = Absence::with(['student'])
            ->select('student_id')
            ->selectRaw('SUM(duration) as total_hours') // Sum the hours
            ->where('status', 'absent')
            ->whereBetween('date', [$start, $end])
            // Filter by class if id_classe is provided
            ->when($id_classe, function ($q) use ($id_classe) {
                $q->whereHas('student', function ($sq) use ($id_classe) {
                    $sq->where('class_group', $id_classe);
                });
            })
            ->groupBy('student_id')
            ->orderBy('total_hours', 'desc') // Worst (most absent) first
            // ->take(10) // Top 10 worst
            ->get();

        $data = $absences->map(function ($abs) use ($start, $end) {
            $student = $abs->student;

            // Attach your calculated math directly to the student object
            $student->hours = $abs->total_hours * 2.5;
            $student->days_absent = ($abs->total_hours * 2.5) / 10;

            $student->absences = Absence::where('student_id', $student->id)
                ->whereBetween('date', [$start, $end])
                ->get();
            return $student;
        });

        return response()->json([
            'success' => true,
            'meta' => [
                'period' => $period,
                'start' => $start,
                'end' => $end,
                'class_id' => $id_classe
            ],
            'data' => $data,
        ]);
    }
}
