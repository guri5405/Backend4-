import { Request, Response } from 'express';
import { leaveConstant } from '@config/constant/index';
import { ResponseHandler } from '@config/responseHandler';
import leaveServices from '@services/leave.services';

const message = leaveConstant.leave;

class LeaveController extends ResponseHandler {
    constructor() {
        super();
        this.applyLeave = this.applyLeave.bind(this);
        this.getMyLeaves = this.getMyLeaves.bind(this);
        this.cancelLeave = this.cancelLeave.bind(this);
    }

    async applyLeave(req: Request, res: Response) {
        const leave = await leaveServices.applyLeave(req.user.id, req.body);
        return this.handleResponse(res, message.leaveApplied, leave);
    }

    async getMyLeaves(req: Request, res: Response) {
        const leaves = await leaveServices.getMyLeaves(req.user.id);
        return this.handleResponse(res, message.leaveFetched, leaves);
    }

    async cancelLeave(req: Request, res: Response) {
        const leave = await leaveServices.cancelLeave(req.user.id, req.params.id);
        return this.handleResponse(res, message.leaveCancelled, leave);
    }
}

export default new LeaveController();
