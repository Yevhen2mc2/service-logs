import { useState } from 'react';

type ToastState = {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
};

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity?: ToastState['severity']) =>
    setToast({ open: true, message, severity: severity ?? 'success' });

  const hideToast = () => setToast((prev) => ({ ...prev, open: false }));

  return { toast, showToast, hideToast };
};
