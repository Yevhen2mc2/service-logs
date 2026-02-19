import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { ServiceLog, ServiceType } from '../types/service-log.ts';
import { serviceTypes } from '../constants/service-types.ts';

const chipColorMap: Record<ServiceType, 'default' | 'warning' | 'error'> = {
  planned: 'default',
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

export const ServiceLogsTable = ({
  logs,
  type,
  onEdit,
  onDelete,
  onConfirm,
}: Props) => {
  const columnCount = type === 'draft' ? 10 : 10;
  const emptyMessage =
    type === 'draft' ? 'No drafts saved.' : 'No service logs found.';

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Provider ID</TableCell>
            <TableCell>Car ID</TableCell>
            <TableCell>Service Order</TableCell>
            <TableCell>Odometer</TableCell>
            <TableCell>Engine Hours</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} align="center">
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => {
              const typeEntry = serviceTypes.find((t) => t.value === log.type);
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <Chip
                      label={typeEntry?.label ?? log.type}
                      color={chipColorMap[log.type]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.providerId}</TableCell>
                  <TableCell>{log.carId}</TableCell>
                  <TableCell>{log.serviceOrder}</TableCell>
                  <TableCell>{log.odometer}</TableCell>
                  <TableCell>{log.engineHours}</TableCell>
                  <TableCell>{log.startDate}</TableCell>
                  <TableCell>{log.endDate}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        display: 'block',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {log.serviceDescription}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(log)}
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(log.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {type === 'draft' && (
                        <IconButton
                          size="small"
                          onClick={() => onConfirm?.(log.id)}
                          aria-label="confirm"
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
