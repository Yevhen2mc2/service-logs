import { useState } from 'react';
import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ServiceLogForm } from './service-log-form.tsx';
import { ServiceLogs } from './service-logs.tsx';
import { EditLogDialog } from './edit-log-dialog.tsx';
import { RemoveAllDraftsDialog } from './remove-all-drafts-dialog.tsx';
import { useGetLogs } from '../hooks/use-get-logs.ts';
import { useCreateLog } from '../hooks/use-create-log.ts';
import { useUpdateLog } from '../hooks/use-update-log.ts';
import { useRemoveLog } from '../hooks/use-remove-log.ts';

export const LogsPage = () => {
  const [removeDraftsOpen, setRemoveDraftsOpen] = useState(false);

  const { autoSave, drafts, serviceLogs } = useGetLogs();

  const { handleDelete, handleRemoveAllDrafts } = useRemoveLog();

  const {
    handleCreateDraft,
    handleSubmit,
    handleAutoSave,
    handleClearAutoSave,
  } = useCreateLog();

  const {
    editingLog,
    handleEdit,
    handleCloseEdit,
    handleSave,
    handleConfirmDraft,
  } = useUpdateLog();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant={'h6'}>Create Service Log</Typography>

        <ServiceLogForm
          initialValues={autoSave ?? undefined}
          onAutoSave={handleAutoSave}
          onClear={handleClearAutoSave}
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
          onClick={() => setRemoveDraftsOpen(true)}
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
        onClose={handleCloseEdit}
        onSave={handleSave}
      />

      <RemoveAllDraftsDialog
        open={removeDraftsOpen}
        draftsCount={drafts.length}
        onClose={() => setRemoveDraftsOpen(false)}
        onConfirm={handleRemoveAllDrafts}
      />
    </Container>
  );
};
