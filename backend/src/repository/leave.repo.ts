import { supabaseAdminClient } from '@config/connection/supabaseClient';
import { CreateLeaveRequestPayload, LEAVE_REQUESTS_TABLE, LeaveRequestInterface, LeaveStatus } from '@models/leave';

class LeaveRepository {
    async create(payload: CreateLeaveRequestPayload) {
        const { data, error } = await supabaseAdminClient
            .from(LEAVE_REQUESTS_TABLE)
            .insert({ ...payload, status: 'pending' })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as LeaveRequestInterface;
    }

    async findById(id: string) {
        const { data, error } = await supabaseAdminClient
            .from(LEAVE_REQUESTS_TABLE)
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as LeaveRequestInterface | null;
    }

    async findByEmployee(employeeId: string) {
        const { data, error } = await supabaseAdminClient
            .from(LEAVE_REQUESTS_TABLE)
            .select('*')
            .eq('employee_id', employeeId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data as LeaveRequestInterface[];
    }

    async findApprovedOverlap(employeeId: string, startDate: string, endDate: string) {
        const { data, error } = await supabaseAdminClient
            .from(LEAVE_REQUESTS_TABLE)
            .select('*')
            .eq('employee_id', employeeId)
            .eq('status', 'approved')
            .lte('start_date', endDate)
            .gte('end_date', startDate);

        if (error) throw new Error(error.message);
        return data as LeaveRequestInterface[];
    }

    async findAll(status?: LeaveStatus) {
        let query = supabaseAdminClient
            .from(LEAVE_REQUESTS_TABLE)
            .select('*, profiles!leave_requests_employee_id_fkey(full_name, email, department)')
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);

        const { data, error } = await query;

        if (error) throw new Error(error.message);
        return data;
    }

    async updateStatus(id: string, status: LeaveStatus, reviewedBy?: string) {
        const { data, error } = await supabaseAdminClient
            .from(LEAVE_REQUESTS_TABLE)
            .update({
                status,
                reviewed_by: reviewedBy ?? null,
                reviewed_at: reviewedBy ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as LeaveRequestInterface;
    }
}

export default new LeaveRepository();
