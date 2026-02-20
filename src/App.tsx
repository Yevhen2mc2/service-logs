import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';
import { useToast } from './hooks/use-toast.ts';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ServiceLogForm } from './components/service-log-form.tsx';
import { ServiceLogs } from './components/service-logs.tsx';
import { EditLogDialog } from './components/edit-log-dialog.tsx';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks.ts';
import { clearAutoSave, setAutoSave } from './features/auto-save-slice.ts';
import {
  addLog,
  updateLog,
  deleteLog,
  removeAllDrafts,
} from './features/logs-slice.ts';
import type { DraftFormData, ServiceLog } from './types/service-log.ts';

const App = () => {
  const { toast, showToast, hideToast } = useToast();

  const dispatch = useAppDispatch();
  const autoSave = useAppSelector((state) => state.autoSave.autoSave);
  const logs = useAppSelector((state) => state.logs.logs);
  const drafts = logs.filter((l) => l.draft);
  const serviceLogs = logs.filter((l) => !l.draft);

  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);
  const [removeAllDraftsOpen, setRemoveAllDraftsOpen] = useState(false);

  const handleEdit = (log: ServiceLog) => setEditingLog(log);

  const handleDelete = (id: string) => {
    dispatch(deleteLog(id));
    showToast('Service log deleted', 'warning');
  };

  const handleConfirmDraft = (id: string) => {
    const log = logs.find((l) => l.id === id);
    if (log) {
      dispatch(updateLog({ ...log, draft: false }));
      showToast('Draft confirmed');
    }
  };

  const handleSave = (id: string, data: DraftFormData, draft: boolean) => {
    const existing = logs.find((l) => l.id === id);
    if (existing) dispatch(updateLog({ ...existing, ...data, draft }));
    setEditingLog(null);
    showToast('Service log updated');
  };

  const handleCreateDraft = (data: DraftFormData) => {
    dispatch(addLog({ ...data, draft: true }));
    showToast('Draft created', 'info');
  };

  const handleSubmit = (data: DraftFormData) => {
    dispatch(addLog({ ...data, draft: false }));
    showToast('Service log created');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            MediDrive
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <ServiceLogForm
            initialValues={autoSave ?? undefined}
            onAutoSave={(data) => dispatch(setAutoSave(data))}
            onClear={() => dispatch(clearAutoSave())}
            onCreateDraft={handleCreateDraft}
            onSubmit={handleSubmit}
          />
        </Paper>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'space-between'}
          gap={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">Drafts</Typography>
          <Button
            size="small"
            color="error"
            disabled={drafts.length === 0}
            sx={{ ml: 2 }}
            onClick={() => setRemoveAllDraftsOpen(true)}
          >
            Remove All Drafts
          </Button>
        </Stack>
        <ServiceLogs
          logs={drafts}
          type="draft"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfirm={handleConfirmDraft}
        />

        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
          Service Logs
        </Typography>
        <ServiceLogs
          logs={serviceLogs}
          type="log"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EditLogDialog
          log={editingLog}
          open={editingLog !== null}
          onClose={() => setEditingLog(null)}
          onSave={handleSave}
        />
      </Container>

      <Dialog
        open={removeAllDraftsOpen}
        onClose={() => setRemoveAllDraftsOpen(false)}
      >
        <DialogTitle>Remove All Drafts</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all {drafts.length} draft
            {drafts.length === 1 ? '' : 's'}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveAllDraftsOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              dispatch(removeAllDrafts());
              setRemoveAllDraftsOpen(false);
            }}
          >
            Remove All
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={hideToast}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
