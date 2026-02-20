import { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { DraftFormData } from '../types/service-log.ts';
import { serviceLogSchema } from '../schemes/service-log.ts';
import { serviceTypes } from '../constants/service-types.ts';

const addOneDay = (dateStr: string) =>
  dayjs(dateStr).add(1, 'day').format('YYYY-MM-DD');

type AutoSaveStatus = 'idle' | 'saving' | 'saved';

interface Props {
  onClear: () => void;
  onSubmit: (data: DraftFormData) => void;
  onCreateDraft: (data: DraftFormData) => void;
  mode?: 'create' | 'edit';
  onClose?: () => void;
  onAutoSave?: (data: Partial<DraftFormData>) => void;
  initialValues?: Partial<DraftFormData>;
}

export const ServiceLogForm = ({
  mode = 'create',
  initialValues,
  onCreateDraft,
  onSubmit,
  onClear,
  onAutoSave,
  onClose,
}: Props) => {
  const today = dayjs().format('YYYY-MM-DD');

  const defaultValues: DraftFormData = {
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: 0,
    engineHours: 0,
    startDate: today,
    endDate: addOneDay(today),
    type: 'planned',
    serviceDescription: '',
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<DraftFormData>({
    defaultValues: { ...defaultValues, ...initialValues },
    resolver: yupResolver(serviceLogSchema),
  });

  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');
  const startDateInitRef = useRef(false);
  const isResettingRef = useRef(false);

  const watchedStartDate = useWatch({ control, name: 'startDate' });
  const watchedValues = useWatch({ control });

  // Auto-update endDate when startDate changes
  useEffect(() => {
    if (!startDateInitRef.current) {
      startDateInitRef.current = true;
      return;
    }
    if (watchedStartDate) {
      setValue('endDate', addOneDay(watchedStartDate), { shouldDirty: false });
    }
  }, [watchedStartDate, setValue]);

  // Auto-save with debounce
  useEffect(() => {
    if (isResettingRef.current) {
      isResettingRef.current = false;
      return;
    }

    if (!onAutoSave || mode === 'edit' || !isDirty) return;

    const savingTimer = setTimeout(() => setAutoSaveStatus('saving'), 0);
    const savedTimer = setTimeout(() => {
      onAutoSave(watchedValues);
      setAutoSaveStatus('saved');
    }, 800);
    return () => {
      clearTimeout(savingTimer);
      clearTimeout(savedTimer);
    };
  }, [watchedValues, onAutoSave, mode, isDirty]);

  const handleClear = () => {
    isResettingRef.current = true;
    reset(defaultValues);
    setAutoSaveStatus('idle');
    onClear();
  };

  return (
    <Box component="form" noValidate>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={'space-between'}
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6">
          {mode === 'edit' ? 'Edit Service Log' : 'Create Service Log'}
        </Typography>

        <Stack direction={'row'} gap={1} alignItems="center">
          {mode !== 'edit' && autoSaveStatus !== 'idle' && (
            <Typography
              variant="caption"
              color={
                autoSaveStatus === 'saving' ? 'text.secondary' : 'success.main'
              }
            >
              {autoSaveStatus === 'saving' ? 'Saving...' : 'Draft saved'}
            </Typography>
          )}

          {mode !== 'edit' && autoSaveStatus === 'saved' && (
            <CheckCircleOutlineIcon color="success" fontSize="small" />
          )}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {/* Provider ID · Service Order · Car ID */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Provider ID"
                required
                fullWidth
                error={!!errors.providerId}
                helperText={errors.providerId?.message}
              />
            )}
          />
          <Controller
            name="serviceOrder"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Service Order"
                required
                fullWidth
                error={!!errors.serviceOrder}
                helperText={errors.serviceOrder?.message}
              />
            )}
          />
          <Controller
            name="carId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Car ID"
                required
                fullWidth
                error={!!errors.carId}
                helperText={errors.carId?.message}
              />
            )}
          />
        </Stack>

        {/* Odometer · Engine Hours · Type */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="odometer"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Odometer (mi)"
                required
                fullWidth
                type="number"
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                error={!!errors.odometer}
                helperText={errors.odometer?.message}
                onChange={(e) =>
                  field.onChange((e.target as HTMLInputElement).valueAsNumber)
                }
              />
            )}
          />
          <Controller
            name="engineHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Engine Hours"
                required
                fullWidth
                type="number"
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                error={!!errors.engineHours}
                helperText={errors.engineHours?.message}
                onChange={(e) =>
                  field.onChange((e.target as HTMLInputElement).valueAsNumber)
                }
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.type}>
                <InputLabel>Type</InputLabel>
                <Select {...field} label="Type">
                  {serviceTypes.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Stack>

        {/* Start Date · End Date */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Date"
                required
                fullWidth
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Date"
                required
                fullWidth
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            )}
          />
        </Stack>

        {/* Service Description */}
        <Controller
          name="serviceDescription"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Service Description"
              required
              fullWidth
              multiline
              minRows={3}
              error={!!errors.serviceDescription}
              helperText={errors.serviceDescription?.message}
            />
          )}
        />

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {mode !== 'edit' && (
            <Button variant="text" color="inherit" onClick={handleClear}>
              Clear
            </Button>
          )}
          {mode !== 'edit' && (
            <Button
              variant="outlined"
              onClick={() =>
                void handleSubmit((data) => {
                  onCreateDraft(data);
                  handleClear();
                })()
              }
            >
              Create Draft
            </Button>
          )}
          {mode === 'edit' && (
            <Button variant="text" color="inherit" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() =>
              void handleSubmit((data) => {
                onSubmit(data);
                if (mode !== 'edit') handleClear();
              })()
            }
          >
            {mode === 'edit' ? 'Save' : 'Create'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
