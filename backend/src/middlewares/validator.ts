import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'yup';
import { constants } from '@config/constant/index';

export const validator = (schema: ObjectSchema<any>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validated = await schema.validate(
            { body: req.body, query: req.query, params: req.params },
            { abortEarly: true, stripUnknown: false }
        );

        req.body = validated.body ?? req.body;
        next();
    } catch (err: any) {
        res.status(constants.errorCode).json({ success: false, message: err?.message, data: null });
    }
};
