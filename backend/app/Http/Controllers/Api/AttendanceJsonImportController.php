<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Group;
use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AttendanceJsonImportController extends Controller
{
    /**
     * Preview what will be imported from JSON file
     */
    public function preview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_json' => 'required|file|mimes:json|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $jsonContent = file_get_contents($request->file('class_json')->getRealPath());
            $data = json_decode($jsonContent, true);

            if (!$data || !isset($data['class_name']) || !isset($data['students'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JSON structure'
                ], 400);
            }

            $preview = $this->analyzeImportData($data);

            return response()->json([
                'success' => true,
                'preview' => $preview,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reading file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import a single class from JSON file
     */
    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_json' => 'required|file|mimes:json|max:10240',
            'skip_empty' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $jsonContent = file_get_contents($request->file('class_json')->getRealPath());
            $data = json_decode($jsonContent, true);

            if (!$data || !isset($data['class_name']) || !isset($data['students'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JSON structure'
                ], 400);
            }

            $skipEmpty = $request->get('skip_empty', true);

            DB::beginTransaction();

            $result = $this->processImport($data, $skipEmpty);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Class {$data['class_name']} imported successfully",
                'stats' => $result,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null,
            ], 500);
        }
    }

    /**
     * Analyze import data and return preview statistics
     */
    private function analyzeImportData(array $data): array
    {
        $className = $data['class_name'];
        $students = $data['students'];

        $existingCefs = Student::pluck('cef')->toArray();
        $newStudents = 0;
        $existingStudents = 0;
        $totalAttendanceRecords = 0;
        $attendanceBreakdown = [
            'A' => 0,  // Absent
            'R' => 0,  // Late (Retard)
            'AJ' => 0, // Justified
            'P' => 0,  // Present
            'empty' => 0,
        ];

        foreach ($students as $student) {
            if (in_array($student['cef'], $existingCefs)) {
                $existingStudents++;
            } else {
                $newStudents++;
            }

            // Count attendance records
            if (isset($student['attendance'])) {
                foreach ($student['attendance'] as $date => $sessions) {
                    foreach ($sessions as $session => $status) {
                        $totalAttendanceRecords++;
                        $attendanceBreakdown[$status] = ($attendanceBreakdown[$status] ?? 0) + 1;
                    }
                }
            }
        }

        return [
            'class_name' => $className,
            'total_students' => count($students),
            'new_students' => $newStudents,
            'existing_students' => $existingStudents,
            'total_attendance_records' => $totalAttendanceRecords,
            'non_empty_records' => $totalAttendanceRecords - ($attendanceBreakdown['empty'] ?? 0),
            'attendance_breakdown' => $attendanceBreakdown,
            'sample_students' => array_slice(array_map(function ($s) use ($existingCefs) {
                return [
                    'cef' => $s['cef'],
                    'name' => $s['prenom'] . ' ' . $s['nom'],
                    'is_new' => !in_array($s['cef'], $existingCefs),
                ];
            }, $students), 0, 5),
        ];
    }

    /**
     * Process the actual import
     */
    private function processImport(array $data, bool $skipEmpty = true): array
    {
        $className = $data['class_name'];
        $students = $data['students'];

        // Create or get the group
        $group = Group::firstOrCreate(
            ['name' => $className],
            ['description' => 'Imported from JSON']
        );

        $stats = [
            'students_created' => 0,
            'students_updated' => 0,
            'absences_created' => 0,
            'absences_skipped' => 0,
        ];

        foreach ($students as $studentData) {
            // Create or update student
            $student = Student::where('cef', $studentData['cef'])->first();

            $studentAttributes = [
                'first_name' => $studentData['prenom'],
                'last_name' => $studentData['nom'],
                'cin' => $studentData['cin'] ?? null,
                'email' => $studentData['email'],
                'group_id' => $group->id,
                'class_group' => $className,
            ];

            if ($student) {
                $student->update($studentAttributes);
                $stats['students_updated']++;
            } else {
                $student = Student::create(array_merge(
                    ['cef' => $studentData['cef']],
                    $studentAttributes
                ));
                $stats['students_created']++;
            }

            // Process attendance records
            if (isset($studentData['attendance'])) {
                foreach ($studentData['attendance'] as $date => $sessions) {
                    foreach ($sessions as $sessionKey => $status) {
                        // Skip empty records if requested
                        if ($skipEmpty && $status === 'empty') {
                            $stats['absences_skipped']++;
                            continue;
                        }

                        // Map status from JSON to database enum
                        $dbStatus = $this->mapStatus($status);

                        // Convert session key (s1, s2, s3, s4) to uppercase
                        $sessionName = strtoupper($sessionKey); // S1, S2, S3, S4

                        // Calculate duration (each session is 2.5 hours)
                        $duration = ($dbStatus === 'absent') ? 1 : 0; // 1 session

                        // Create or update absence record
                        Absence::updateOrCreate(
                            [
                                'student_id' => $student->id,
                                'date' => $date,
                                'session' => $sessionName,
                            ],
                            [
                                'type' => 'session',
                                'duration' => $duration,
                                'status' => $dbStatus,
                                'original_session' => $sessionKey,
                                'created_by' => Auth::id(),
                            ]
                        );

                        $stats['absences_created']++;
                    }
                }
            }

            // Update student counters after importing all absences
            $this->updateStudentCounters($student);
        }

        return $stats;
    }

    /**
     * Map JSON status to database enum
     */
    private function mapStatus(string $status): string
    {
        $statusMap = [
            'A' => 'absent',
            'R' => 'late',
            'AJ' => 'justified',
            'P' => 'present',
            'empty' => 'present', // Treat empty as present (or skip if $skipEmpty is true)
        ];

        return $statusMap[$status] ?? 'present';
    }

    /**
     * Update student absence counters
     */
    private function updateStudentCounters(Student $student)
    {

        $absences = $student->absences()->get();

        $rawHoursabs = $absences->where('status', 'absent')->sum('duration');
        $rawHourslate = $absences->where('status', 'late')->count();

        $calculatedDays = ($rawHoursabs / 2 ) + ($rawHourslate / 4);

        $student->update([
            'hours' => $rawHoursabs * 2.5,
            'tardies' => $absences->where('status', 'late')->count(),
            'days_absent' => $calculatedDays,
            'justified_absences' => $absences->where('status', 'justified')->count(),
        ]);
    }

    /**
     * Batch import all JSON files from storage
     */
    public function importAll(Request $request)
    {
        $jsonDir = storage_path('app/attendance_json');

        if (!is_dir($jsonDir)) {
            return response()->json([
                'success' => false,
                'message' => "Directory not found: {$jsonDir}"
            ], 404);
        }

        $files = glob($jsonDir . '/*.json');
        $results = [];
        $totalStats = [
            'classes_processed' => 0,
            'classes_failed' => 0,
            'students_total' => 0,
            'absences_total' => 0,
        ];

        foreach ($files as $file) {
            $filename = basename($file);

            // Skip summary file
            if ($filename === 'summary.json') {
                continue;
            }

            try {
                DB::beginTransaction();

                $data = json_decode(file_get_contents($file), true);
                $classStats = $this->processImport($data, true);

                DB::commit();

                $results[] = [
                    'class' => $data['class_name'],
                    'status' => 'success',
                    'students_created' => $classStats['students_created'],
                    'students_updated' => $classStats['students_updated'],
                    'absences' => $classStats['absences_created'],
                ];

                $totalStats['classes_processed']++;
                $totalStats['students_total'] += $classStats['students_created'] + $classStats['students_updated'];
                $totalStats['absences_total'] += $classStats['absences_created'];
            } catch (\Exception $e) {
                DB::rollBack();

                $results[] = [
                    'class' => $filename,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ];
                $totalStats['classes_failed']++;
            }
        }

        return response()->json([
            'success' => $totalStats['classes_failed'] === 0,
            'summary' => $totalStats,
            'results' => $results,
        ]);
    }
}
