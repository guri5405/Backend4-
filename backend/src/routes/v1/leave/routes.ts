import express, { Router } from 'express';
import LeaveController from '@controllers/api/v1/leave';
import { tryCatchMiddleware } from '@middlewares/async';
import { verifyToken } from '@middlewares/auth';
import { validator } from '@middlewares/validator';
import { applyLeaveValidation, leaveIdParamValidation } from './validation';

const router: Router = express.Router();

router.post('/', verifyToken, validator(applyLeaveValidation), tryCatchMiddleware(LeaveController.applyLeave));
router.get('/', verifyToken, tryCatchMiddleware(LeaveController.getMyLeaves));
router.patch('/:id/cancel', verifyToken, validator(leaveIdParamValidation), tryCatchMiddleware(LeaveController.cancelLeave));

export default router;
