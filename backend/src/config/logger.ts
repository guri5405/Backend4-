import { createLogger, transports, config, format } from 'winston';
import appConfig from '@config/config';

const { combine, timestamp, json } = format;

const createCustomLogger = (module: string) => {
    return createLogger({
        levels: config.syslog.levels,
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            json()
        ),
        transports: [
            new transports.File({
                filename: `logs/${module}.log`,
                maxsize: appConfig.defaultLogger.maxLoggerFileSize
            })
        ]
    });
};

export const errorLogger = createCustomLogger('error');
export const activityLogger = createCustomLogger('activity');
export const requestLogger = createCustomLogger('request');
