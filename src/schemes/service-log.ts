import * as yup from 'yup';

export const serviceLogSchema = yup.object({
  providerId: yup.string().required('Provider ID is required'),
  serviceOrder: yup.string().required('Service order is required'),
  carId: yup.string().required('Car ID is required'),
  odometer: yup
    .number()
    .typeError('Must be a number')
    .min(0, 'Must be ≥ 0')
    .required('Odometer is required'),
  engineHours: yup
    .number()
    .typeError('Must be a number')
    .min(0, 'Must be ≥ 0')
    .required('Engine hours is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  type: yup
    .string()
    .oneOf(['planned', 'unplanned', 'emergency'], 'Invalid type')
    .required('Type is required'),
  serviceDescription: yup.string().required('Service description is required'),
});
