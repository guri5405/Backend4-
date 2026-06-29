import { Response } from 'express';
import { constants } from '@config/constant/index';
import { activityLogger } from '@config/logger';

export class ResponseHandler {
    protected handleResponse(res: Response, message: string, data: any = null, statusCode: number = constants.successCode) {
        activityLogger.info(message, { data });
        return res.status(statusCode).json({ success: true, message, data });
    }
}
