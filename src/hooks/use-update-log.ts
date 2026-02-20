import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux-hooks.ts';
import { updateLog } from '../features/logs-slice.ts';
import type { DraftFormData, ServiceLog } from '../types/service-log.ts';
import { useToast } from './use-toast.ts';

export const useUpdateLog = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.logs.logs);

  const { toast } = useToast();

  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);

  const handleEdit = (log: ServiceLog) => setEditingLog(log);

  const handleCloseEdit = () => setEditingLog(null);

  const handleSave = (id: string, data: DraftFormData, draft: boolean) => {
    const existing = logs.find((l) => l.id === id);
    if (existing) dispatch(updateLog({ ...existing, ...data, draft }));
    setEditingLog(null);
    toast('Service log updated');
  };

  const handleConfirmDraft = (id: string) => {
    const log = logs.find((l) => l.id === id);
    if (log) {
      dispatch(updateLog({ ...log, draft: false }));
      toast('Draft confirmed');
    }
  };

  return {
    editingLog,
    handleEdit,
    handleCloseEdit,
    handleSave,
    handleConfirmDraft,
  };
};
