import { constants, leaveConstant } from '@config/constant/index';
import { ApiError } from '@helpers/apiError';
import { CreateLeaveRequestPayload } from '@models/leave';
import leaveRepo from '@repository/leave.repo';

const { leave: message } = leaveConstant;

class LeaveService {
    async applyLeave(employeeId: string, payload: Omit<CreateLeaveRequestPayload, 'employee_id'>) {
        const overlapping = await leaveRepo.findApprovedOverlap(employeeId, payload.start_date, payload.end_date);
        if (overlapping.length > 0) throw new ApiError(message.overlappingLeave, constants.errorCode);

        return leaveRepo.create({ ...payload, employee_id: employeeId });
    }

    async getMyLeaves(employeeId: string) {
        return leaveRepo.findByEmployee(employeeId);
    }

    async cancelLeave(employeeId: string, leaveId: string) {
        const leave = await leaveRepo.findById(leaveId);
        if (!leave) throw new ApiError(message.leaveNotFound, constants.notFoundCode);

        if (leave.employee_id !== employeeId) throw new ApiError(message.notOwner, constants.forbidden);
        if (leave.status !== 'pending') throw new ApiError(message.onlyPendingCancel, constants.errorCode);

        return leaveRepo.updateStatus(leaveId, 'cancelled');
    }
}

export default new LeaveService();
