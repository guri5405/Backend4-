import * as yup from 'yup';

export const updateProfileValidation = yup.object({
    body: yup.object({
        full_name: yup.string().trim().optional(),
        department: yup.string().trim().optional()
    })
});
