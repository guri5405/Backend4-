import { Request, Response } from 'express';
import { authConstant, constants } from '@config/constant/index';
import { ResponseHandler } from '@config/responseHandler';
import authServices from '@services/auth.services';

const message = authConstant.auth;

class AuthController extends ResponseHandler {
    constructor() {
        super();
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
    }

    async signup(req: Request, res: Response) {
        const result = await authServices.signup(req.body);
        return this.handleResponse(res, message.signupSuccess, result, constants.createdCode);
    }

    async login(req: Request, res: Response) {
        const result = await authServices.login(req.body);
        return this.handleResponse(res, message.loginSuccess, result);
    }
}

export default new AuthController();
