import { supabaseAuthClient } from '@config/connection/supabaseClient';
import { authConstant, constants, userRoles } from '@config/constant/index';
import { ApiError } from '@helpers/apiError';
import profileRepo from '@repository/profile.repo';

const { auth: message } = authConstant;

interface SignupPayload {
    email: string;
    password: string;
    full_name: string;
    department?: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

class AuthService {
    async signup({ email, password, full_name, department }: SignupPayload) {
        const { data, error } = await supabaseAuthClient.auth.signUp({ email, password });

        if (error) throw new ApiError(error.message, constants.errorCode);
        if (!data.user) throw new ApiError(constants.serverError, constants.errorCode);

        const profile = await profileRepo.create({
            id: data.user.id,
            email,
            full_name,
            department: department ?? null,
            role: userRoles.employee as 'employee'
        });

        return {
            profile,
            session: data.session
                ? { access_token: data.session.access_token, refresh_token: data.session.refresh_token }
                : null
        };
    }

    async login({ email, password }: LoginPayload) {
        const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email, password });

        if (error || !data.session) throw new ApiError(message.invalidCredentials, constants.unauthorized);

        const profile = await profileRepo.findById(data.user.id);
        if (!profile) throw new ApiError(message.profileNotFound, constants.notFoundCode);

        return {
            profile,
            session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token }
        };
    }
}

export default new AuthService();
