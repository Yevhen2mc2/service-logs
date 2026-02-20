import { useAppDispatch } from './redux-hooks.ts';
import { clearAutoSave, setAutoSave } from '../features/auto-save-slice.ts';
import { addLog } from '../features/logs-slice.ts';
import type { DraftFormData } from '../types/service-log.ts';
import { useToast } from './use-toast.ts';

export const useCreateLog = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleCreateDraft = (data: DraftFormData) => {
    dispatch(addLog({ ...data, draft: true }));
    toast('Draft created', 'info');
  };

  const handleSubmit = (data: DraftFormData) => {
    dispatch(addLog({ ...data, draft: false }));
    toast('Service log created');
  };

  const handleAutoSave = (data: Partial<DraftFormData>) =>
    dispatch(setAutoSave(data));

  const handleClearAutoSave = () => dispatch(clearAutoSave());

  return {
    handleCreateDraft,
    handleSubmit,
    handleAutoSave,
    handleClearAutoSave,
  };
};
