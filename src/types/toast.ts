export interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}
