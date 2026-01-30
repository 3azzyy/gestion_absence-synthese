<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AbsenceController extends Controller
{
    public function index(Request $request)
    {
        $query = Absence::with(['student', 'creator']);

        // Date range filter
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->byDateRange($request->date_from, $request->date_to);
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

        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:hours,days,session',
            'duration' => 'required|numeric|min:0',
            'status' => 'required|in:absent,justified,late,present',
            'reason' => 'nullable|string',
            'session' => 'nullable|in:S1,S2,S3,S4',
        ]);

        $validated['student_id'] = $studentId;
        $validated['created_by'] = Auth::id(); // Fixed: Use Auth::id() instead of auth()->id()

        $absence = Absence::create($validated);

        // Update student counters
        $this->updateStudentCounters($student);

        return response()->json([
            'success' => true,
            'data' => $absence->load(['student', 'creator']),
            'message' => 'Absence recorded successfully',
        ], 201);
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
        // Fixed: Get absences collection properly
        $absences = $student->absences()->get();

        $student->update([
            'hours' => $absences->where('status', 'absent')->sum('duration') * 2.5,
            'tardies' => $absences->where('status', 'late')->count(),
            'days_absent' => $absences->where('status', 'absent')->pluck('date')->unique()->count(),
            'justified_absences' => $absences->where('status', 'justified')->count(),
        ]);
    }
}