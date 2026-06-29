import appConfig from '@config/config';
import './config/serverValidator';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { constants } from '@config/constant/index';

import { errorLogger } from '@config/logger';
import { ApiError } from '@helpers/apiError';
import v1Routes from '@routes/v1';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: appConfig.webUrl }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', v1Routes);

app.use((req: Request, res: Response) => {
    res.status(constants.notFoundCode).json({ success: false, message: constants.notFound, data: null });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof ApiError ? err.statusCode : constants.errorCode;
    errorLogger.error('Error', { error: err?.message, url: req?.url, body: req?.body });
    res.status(statusCode).json({ success: false, message: err?.message ?? constants.serverError, data: null });
});

app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
});

export default app;
