<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\VisitLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VisitController extends Controller
{
    public function index(Request $request)
    {
        $query = Visit::withCommonRelations()->withOptionalRelations();

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('headquarter_id')) {
            $query->where('headquarter_id', $request->headquarter_id);
        }

        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('visit_code', 'like', "%{$search}%")
                  ->orWhere('purpose', 'like', "%{$search}%")
                  ->orWhere('visitor_name', 'like', "%{$search}%")
                  ->orWhere('visitor_identification', 'like', "%{$search}%");
            });
        }

        $visits = $query->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 15));

        return response()->json($visits);
    }

    public function store(Request $request)
    {
        $request->validate([
            'purpose' => 'required|string|max:255',
            'description' => 'nullable|string',
            'visit_date' => 'required|date',
            'entry_time' => 'nullable|date_format:H:i',
            'exit_time' => 'nullable|date_format:H:i|after:entry_time',
            'visitor_name' => 'required|string|max:255',
            'visitor_email' => 'nullable|email|max:255',
            'visitor_phone' => 'nullable|string|max:50',
            'visitor_identification' => 'required|string|max:100',
            'visitor_company' => 'nullable|string|max:255',
            'has_vehicle' => 'boolean',
            'vehicle_plate' => 'nullable|string|max:50',
            'vehicle_model' => 'nullable|string|max:255',
            'vehicle_color' => 'nullable|string|max:100',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'headquarter_id' => 'required|exists:headquarters,id',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        DB::beginTransaction();

        try {
            // Generar código de visita
            $lastVisit = Visit::orderBy('id', 'desc')->first();
            $nextId = $lastVisit ? $lastVisit->id + 1 : 1;
            $visitCode = 'VIS-' . date('Y') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);

            $visit = Visit::create([
                'visit_code' => $visitCode,
                'purpose' => $request->purpose,
                'description' => $request->description,
                'visit_date' => $request->visit_date,
                'entry_time' => $request->entry_time,
                'exit_time' => $request->exit_time,
                'visitor_name' => $request->visitor_name,
                'visitor_email' => $request->visitor_email,
                'visitor_phone' => $request->visitor_phone,
                'visitor_identification' => $request->visitor_identification,
                'visitor_company' => $request->visitor_company,
                'has_vehicle' => $request->has_vehicle ?? false,
                'vehicle_plate' => $request->vehicle_plate,
                'vehicle_model' => $request->vehicle_model,
                'vehicle_color' => $request->vehicle_color,
                'employee_id' => $request->employee_id,
                'department_id' => $request->department_id,
                'headquarter_id' => $request->headquarter_id,
                'priority' => $request->priority,
                'status' => 'pending',
                'created_by' => Auth::id(),
            ]);

            // Registrar log de creación
            VisitLog::create([
                'visit_id' => $visit->id,
                'action' => 'created',
                'status_from' => null,
                'status_to' => 'pending',
                'user_id' => Auth::id(),
                'notes' => 'Visit created',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Visit created successfully',
                'visit' => $visit->load(['employee', 'department', 'headquarter', 'creator'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating visit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $visit = Visit::withCommonRelations()
                     ->with(['logs.user' => function($q) {
                         $q->select('id', 'first_name', 'last_name');
                     }, 'attachments'])
                     ->findOrFail($id);

        return response()->json($visit);
    }

    public function update(Request $request, $id)
    {
        $visit = Visit::findOrFail($id);

        $request->validate([
            'purpose' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'visit_date' => 'sometimes|required|date',
            'entry_time' => 'nullable|date_format:H:i',
            'exit_time' => 'nullable|date_format:H:i|after:entry_time',
            'visitor_name' => 'sometimes|required|string|max:255',
            'visitor_email' => 'nullable|email|max:255',
            'visitor_phone' => 'nullable|string|max:50',
            'visitor_identification' => 'sometimes|required|string|max:100',
            'visitor_company' => 'nullable|string|max:255',
            'has_vehicle' => 'boolean',
            'vehicle_plate' => 'nullable|string|max:50',
            'vehicle_model' => 'nullable|string|max:255',
            'vehicle_color' => 'nullable|string|max:100',
            'employee_id' => 'sometimes|required|exists:employees,id',
            'department_id' => 'sometimes|required|exists:departments,id',
            'headquarter_id' => 'sometimes|required|exists:headquarters,id',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
        ]);

        $visit->update($request->all());

        return response()->json([
            'message' => 'Visit updated successfully',
            'visit' => $visit->load(['employee', 'department', 'headquarter', 'creator'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $visit = Visit::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,approved,rejected,in_progress,completed,cancelled',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $oldStatus = $visit->status;
        $newStatus = $request->status;

        DB::beginTransaction();

        try {
            $updateData = ['status' => $newStatus];
            
            if ($newStatus === 'rejected') {
                $updateData['rejection_reason'] = $request->rejection_reason;
            }

            if ($newStatus === 'approved') {
                $updateData['approved_by'] = Auth::id();
                $updateData['approved_at'] = now();
            }

            $visit->update($updateData);

            // Registrar log de cambio de estado
            VisitLog::create([
                'visit_id' => $visit->id,
                'action' => 'status_changed',
                'status_from' => $oldStatus,
                'status_to' => $newStatus,
                'user_id' => Auth::id(),
                'notes' => $request->rejection_reason ?? "Status changed from {$oldStatus} to {$newStatus}",
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Visit status updated successfully',
                'visit' => $visit->load(['employee', 'department', 'headquarter', 'creator', 'approver'])
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error updating visit status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $visit = Visit::findOrFail($id);
        $visit->delete();

        return response()->json(['message' => 'Visit deleted successfully']);
    }
}
