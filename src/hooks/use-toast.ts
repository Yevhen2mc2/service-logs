import { useAppDispatch } from './redux-hooks.ts';
import { showToast } from '../features/app-slice.ts';
import type { ToastState } from '../types/toast.ts';

export const useToast = () => {
  const dispatch = useAppDispatch();

  const toast = (
    message: ToastState['message'],
    severity?: ToastState['severity'],
  ) => dispatch(showToast({ message, severity }));

  return { toast };
};
