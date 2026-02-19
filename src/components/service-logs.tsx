import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ServiceLogsTable } from './service-logs-table.tsx';
import { serviceTypes } from '../constants/service-types.ts';
import type { ServiceLog, ServiceType } from '../types/service-log.ts';

const toggleColorMap: Record<ServiceType, 'standard' | 'warning' | 'error'> = {
  planned: 'standard',
  unplanned: 'warning',
  emergency: 'error',
};

interface Props {
  logs: ServiceLog[];
  type: 'draft' | 'log';
  onEdit: (log: ServiceLog) => void;
  onDelete: (id: string) => void;
  onConfirm?: (id: string) => void;
}

export const ServiceLogs = ({
  logs,
  type,
  onEdit,
  onDelete,
  onConfirm,
}: Props) => {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ServiceType[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);

  const isFiltered =
    search !== '' ||
    selectedTypes.length > 0 ||
    dateFrom !== null ||
    dateTo !== null;

  const filteredLogs = logs.filter((log) => {
    if (search) {
      const q = search.toLowerCase();
      const matches =
        log.providerId.toLowerCase().includes(q) ||
        log.carId.toLowerCase().includes(q) ||
        log.serviceOrder.toLowerCase().includes(q) ||
        log.serviceDescription.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (selectedTypes.length > 0 && !selectedTypes.includes(log.type)) {
      return false;
    }

    if (dateFrom !== null && dayjs(log.startDate).isBefore(dateFrom, 'day')) {
      return false;
    }

    if (dateTo !== null && dayjs(log.startDate).isAfter(dateTo, 'day')) {
      return false;
    }

    return true;
  });

  const handleClear = () => {
    setSearch('');
    setSelectedTypes([]);
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          placeholder="Search by provider, car, service order, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <ToggleButtonGroup
            value={selectedTypes}
            onChange={(_, newTypes: ServiceType[]) =>
              setSelectedTypes(newTypes)
            }
            size="small"
          >
            {serviceTypes.map((t) => (
              <ToggleButton
                key={t.value}
                value={t.value}
                color={toggleColorMap[t.value]}
              >
                {t.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <DatePicker
            label="From"
            value={dateFrom}
            onChange={setDateFrom}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="To"
            value={dateTo}
            onChange={setDateTo}
            slotProps={{ textField: { size: 'small' } }}
          />
          {isFiltered && (
            <Button size="small" onClick={handleClear}>
              Clear filters
            </Button>
          )}
        </Box>
        <ServiceLogsTable
          logs={filteredLogs}
          type={type}
          onEdit={onEdit}
          onDelete={onDelete}
          onConfirm={onConfirm}
        />
      </Stack>
    </Paper>
  );
};
