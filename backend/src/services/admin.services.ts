import { constants, leaveConstant } from '@config/constant/index';
import { ApiError } from '@helpers/apiError';
import { LeaveStatus } from '@models/leave';
import leaveRepo from '@repository/leave.repo';

const { leave: message } = leaveConstant;

class AdminService {
    async getAllLeaves(status?: LeaveStatus) {
        return leaveRepo.findAll(status);
    }

    async reviewLeave(leaveId: string, adminId: string, decision: 'approved' | 'rejected') {
        const leave = await leaveRepo.findById(leaveId);
        if (!leave) throw new ApiError(message.leaveNotFound, constants.notFoundCode);
        if (leave.status !== 'pending') throw new ApiError(message.onlyPendingReview, constants.errorCode);

        return leaveRepo.updateStatus(leaveId, decision, adminId);
    }
}

export default new AdminService();
