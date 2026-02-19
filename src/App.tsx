import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { ServiceLogForm } from './components/service-log-form.tsx';
import { ServiceLogsTable } from './components/service-logs-table.tsx';
import { EditLogDialog } from './components/edit-log-dialog.tsx';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks.ts';
import {
  clearAutoSave,
  setAutoSave,
} from './features/drafts/auto-save-slice.ts';
import { addLog, updateLog, deleteLog } from './features/logs/logs-slice.ts';
import type { DraftFormData, ServiceLog } from './types/service-log.ts';

const App = () => {
  const dispatch = useAppDispatch();
  const autoSave = useAppSelector((state) => state.autoSave.autoSave);
  const logs = useAppSelector((state) => state.logs.logs);
  const drafts = logs.filter((l) => l.draft);
  const serviceLogs = logs.filter((l) => !l.draft);

  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);

  const handleEdit = (log: ServiceLog) => setEditingLog(log);
  const handleDelete = (id: string) => dispatch(deleteLog(id));
  const handleConfirmDraft = (id: string) => {
    const log = logs.find((l) => l.id === id);
    if (log) dispatch(updateLog({ ...log, draft: false }));
  };
  const handleSave = (id: string, data: DraftFormData, draft: boolean) => {
    const existing = logs.find((l) => l.id === id);
    if (existing) dispatch(updateLog({ ...existing, ...data, draft }));
    setEditingLog(null);
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
            onCreateDraft={(data) => dispatch(addLog({ ...data, draft: true }))}
            onSubmit={(data) => dispatch(addLog({ ...data, draft: false }))}
          />
        </Paper>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Drafts
        </Typography>
        <ServiceLogsTable
          logs={drafts}
          type="draft"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfirm={handleConfirmDraft}
        />

        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
          Service Logs
        </Typography>
        <ServiceLogsTable
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
    </Box>
  );
};

export default App;
