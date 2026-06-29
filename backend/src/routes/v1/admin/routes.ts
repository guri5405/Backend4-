import express, { Router } from 'express';
import AdminController from '@controllers/api/v1/admin';
import { tryCatchMiddleware } from '@middlewares/async';
import { requireAdmin, verifyToken } from '@middlewares/auth';
import { validator } from '@middlewares/validator';
import { leaveIdParamValidation, leaveListQueryValidation } from './validation';

const router: Router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/leave-requests', validator(leaveListQueryValidation),tryCatchMiddleware(AdminController.getAllLeaves));
router.patch('/leave-requests/:id/approve', validator(leaveIdParamValidation),tryCatchMiddleware(AdminController.approveLeave));
router.patch('/leave-requests/:id/reject', validator(leaveIdParamValidation),tryCatchMiddleware(AdminController.rejectLeave));

export default router;
