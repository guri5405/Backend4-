import * as yup from 'yup';
import { isAfter, isBeforeToday } from '@helpers/date';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const applyLeaveValidation = yup.object({
    body: yup.object({
        start_date: yup
            .string()
            .matches(dateRegex, 'start_date must be in YYYY-MM-DD format')
            .required('Start date is required')
            .test('not-in-past', 'Start date cannot be in the past.', value => !!value && !isBeforeToday(value)),
        end_date: yup
            .string()
            .matches(dateRegex, 'end_date must be in YYYY-MM-DD format')
            .required('End date is required')
            .test('after-start', 'End date must be greater than the start date.', function (value) {
                const { start_date } = this.parent;
                return !!value && !!start_date && isAfter(value, start_date);
            }),
        reason: yup.string().trim().required('Reason is required')
    })
});

export const leaveIdParamValidation = yup.object({
    params: yup.object({
        id: yup.string().matches(uuidRegex, 'Invalid leave request id').required()
    })
});
