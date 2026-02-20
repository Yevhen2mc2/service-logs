import { useAppDispatch } from './redux-hooks.ts';
import { deleteLog, removeAllDrafts } from '../features/logs-slice.ts';
import { useToast } from './use-toast.ts';

export const useRemoveLog = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    dispatch(deleteLog(id));
    toast('Service log deleted', 'warning');
  };

  const handleRemoveAllDrafts = () => {
    dispatch(removeAllDrafts());
    toast('All drafts removed', 'warning');
  };

  return { handleDelete, handleRemoveAllDrafts };
};
