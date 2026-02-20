import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const columnCount = type === 'draft' ? 10 : 10;
  const emptyMessage =
    type === 'draft' ? 'No drafts saved.' : 'No service logs found.';
  const entityLabel = type === 'draft' ? 'draft' : 'service log';

  const handleDeleteConfirm = () => {
    if (pendingDeleteId) {
      onDelete(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
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
                const typeEntry = serviceTypes.find(
                  (t) => t.value === log.type,
                );
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
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(log)}
                            aria-label="edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove" placement="top">
                          <IconButton
                            size="small"
                            onClick={() => setPendingDeleteId(log.id)}
                            aria-label="delete"
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {type === 'draft' && (
                          <Tooltip title="Confirm" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onConfirm?.(log.id)}
                              aria-label="confirm"
                              sx={{ color: 'success.main' }}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

      <Dialog
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
      >
        <DialogTitle>Delete {entityLabel}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {entityLabel}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
