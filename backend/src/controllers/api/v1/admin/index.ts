import { Request, Response } from 'express';
import { leaveConstant } from '@config/constant/index';
import { ResponseHandler } from '@config/responseHandler';
import adminServices from '@services/admin.services';

const message = leaveConstant.leave;

class AdminController extends ResponseHandler {
    constructor() {
        super();
        this.getAllLeaves = this.getAllLeaves.bind(this);
        this.approveLeave = this.approveLeave.bind(this);
        this.rejectLeave = this.rejectLeave.bind(this);
    }

    async getAllLeaves(req: Request, res: Response) {
        const leaves = await adminServices.getAllLeaves(req.query.status as any);
        return this.handleResponse(res, message.leaveFetched, leaves);
    }

    async approveLeave(req: Request, res: Response) {
        const leave = await adminServices.reviewLeave(req.params.id, req.user.id, 'approved');
        return this.handleResponse(res, message.leaveApproved, leave);
    }

    async rejectLeave(req: Request, res: Response) {
        const leave = await adminServices.reviewLeave(req.params.id, req.user.id, 'rejected');
        return this.handleResponse(res, message.leaveRejected, leave);
    }
}

export default new AdminController();
