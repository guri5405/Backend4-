import { authConstant, constants } from '@config/constant/index';
import { ApiError } from '@helpers/apiError';
import { ProfileUpdatePayload } from '@models/profile';
import profileRepo from '@repository/profile.repo';

const { auth: authMessage } = authConstant;

class EmployeeService {
    async getProfile(employeeId: string) {
        const profile = await profileRepo.findById(employeeId);
        if (!profile) throw new ApiError(authMessage.profileNotFound, constants.notFoundCode);
        return profile;
    }

    async updateProfile(employeeId: string, payload: ProfileUpdatePayload) {
        return profileRepo.update(employeeId, payload);
    }
}

export default new EmployeeService();
