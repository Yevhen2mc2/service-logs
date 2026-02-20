import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  Alert,
  AppBar,
  Box,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import { LogsPage } from './components/logs-page.tsx';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks.ts';
import { hideToast } from './features/app-slice.ts';

const App = () => {
  const toast = useAppSelector((state) => state.app.toast);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            MediDrive
          </Typography>
        </Toolbar>
      </AppBar>

      <LogsPage />

      <Snackbar
        open={toast.open}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => dispatch(hideToast())}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
