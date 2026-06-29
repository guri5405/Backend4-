import { ProfileInterface } from '@models/profile';

declare global {
    namespace Express {
        interface Request {
            user: ProfileInterface;
        }
    }
}

export {};
