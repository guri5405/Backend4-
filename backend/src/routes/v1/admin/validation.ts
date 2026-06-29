import * as yup from 'yup';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const leaveListQueryValidation = yup.object({
    query: yup.object({
        status: yup.string().oneOf(['pending', 'approved', 'rejected', 'cancelled']).optional()
    })
});

export const leaveIdParamValidation = yup.object({
    params: yup.object({
        id: yup.string().matches(uuidRegex, 'Invalid leave request id').required()
    })
});
