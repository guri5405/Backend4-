import express, { Router } from 'express';
import EmployeeController from '@controllers/api/v1/employee';
import { tryCatchMiddleware } from '@middlewares/async';
import { verifyToken } from '@middlewares/auth';
import { validator } from '@middlewares/validator';
import { updateProfileValidation } from './validation';

const router: Router = express.Router();

router.get('/profile', verifyToken, tryCatchMiddleware(EmployeeController.getProfile));
router.patch('/profile', verifyToken, validator(updateProfileValidation), tryCatchMiddleware(EmployeeController.updateProfile));

export default router;
