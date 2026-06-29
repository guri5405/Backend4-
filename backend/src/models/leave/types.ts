export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequestInterface {
    id: string;
    employee_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: LeaveStatus;
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateLeaveRequestPayload {
    employee_id: string;
    start_date: string;
    end_date: string;
    reason: string;
}
