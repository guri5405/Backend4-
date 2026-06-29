import express, { Router } from 'express';
import AuthController from '@controllers/api/v1/auth';
import { tryCatchMiddleware } from '@middlewares/async';
import { validator } from '@middlewares/validator';
import { loginValidation, signupValidation } from './validation';

const router: Router = express.Router();

router.post('/signup', validator(signupValidation), tryCatchMiddleware(AuthController.signup));
router.post('/login', validator(loginValidation), tryCatchMiddleware(AuthController.login));

export default router;
