import { NextFunction, Request, Response } from 'express';
import { supabaseAuthClient } from '@config/connection/supabaseClient';
import { constants, authConstant } from '@config/constant/index';
import profileRepo from '@repository/profile.repo';

const { auth: message } = authConstant;

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(constants.forbidden).json({ success: false, message: message.noAuth, data: null });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !data?.user) {
        return res.status(constants.forbidden).json({ success: false, message: message.invalidToken, data: null });
    }

    const profile = await profileRepo.findById(data.user.id);

    if (!profile) {
        return res.status(constants.notFoundCode).json({ success: false, message: message.profileNotFound, data: null });
    }

    req.user = profile;
    next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): any => {
    if (req.user.role !== 'admin') {
        return res.status(constants.forbidden).json({ success: false, message: message.notAdmin, data: null });
    }
    next();
};
