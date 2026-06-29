import authConstant from './auth';
import employeeConstant from './employee';
import leaveConstant from './leave';

export const constants = {
    notFound: 'Invalid API endpoint. Please verify the URL and try again.',
    serverError: 'Something went wrong. Please try again later.',

    successCode: 200,
    createdCode: 201,
    errorCode: 400,
    unauthorized: 401,
    forbidden: 403,
    notFoundCode: 404
};

export const userRoles = {
    employee: 'employee',
    admin: 'admin'
};

export const leaveStatus = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    cancelled: 'cancelled'
};

export { authConstant, employeeConstant, leaveConstant };
