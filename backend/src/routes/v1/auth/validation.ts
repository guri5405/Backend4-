import * as yup from 'yup';

export const signupValidation = yup.object({
    body: yup.object({
        email: yup.string().email('Please provide a valid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        full_name: yup.string().trim().required('Full name is required'),
        department: yup.string().trim().optional()
    })
});

export const loginValidation = yup.object({
    body: yup.object({
        email: yup.string().email('Please provide a valid email').required('Email is required'),
        password: yup.string().required('Password is required')
    })
});
