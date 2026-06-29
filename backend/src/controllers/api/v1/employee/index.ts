import { Request, Response } from 'express';
import { employeeConstant } from '@config/constant/index';
import { ResponseHandler } from '@config/responseHandler';
import employeeServices from '@services/employee.services';

const message = employeeConstant.employee;

class EmployeeController extends ResponseHandler {
    constructor() {
        super();
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    async getProfile(req: Request, res: Response) {
        const profile = await employeeServices.getProfile(req.user.id);
        return this.handleResponse(res, message.profileFetched, profile);
    }

    async updateProfile(req: Request, res: Response) {
        const profile = await employeeServices.updateProfile(req.user.id, req.body);
        return this.handleResponse(res, message.profileUpdated, profile);
    }
}

export default new EmployeeController();
