import express, { Router } from 'express';
import authRoute from './auth/routes';
import employeeRoute from './employee/routes';
import leaveRoute from './leave/routes';
import adminRoute from './admin/routes';

const v1Routes: Router = express.Router();

v1Routes.use('/auth', authRoute);
v1Routes.use('/employee', employeeRoute);
v1Routes.use('/leave', leaveRoute);
v1Routes.use('/admin', adminRoute);

export default v1Routes;
