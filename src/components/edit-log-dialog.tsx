import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { ServiceLogForm } from './service-log-form.tsx';
import type { DraftFormData, ServiceLog } from '../types/service-log.ts';

interface Props {
  log: ServiceLog | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: DraftFormData, draft: boolean) => void;
}

export const EditLogDialog = ({ log, open, onClose, onSave }: Props) => {
  if (!log) return null;

  const { id, draft, ...formValues } = log;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {log.draft ? 'Edit Service Log Draft' : 'Edit Service Log'}
      </DialogTitle>
      <DialogContent dividers>
        <ServiceLogForm
          mode="edit"
          initialValues={formValues}
          onSubmit={(data) => {
            onSave(id, data, draft);
          }}
          onCreateDraft={(data) => {
            onSave(id, data, true);
          }}
          onClear={onClose}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
