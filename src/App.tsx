import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { ServiceLogForm } from './components/service-log-form.tsx';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks.ts';
import {
  clearAutoSave,
  setAutoSave,
} from './features/drafts/auto-save-slice.ts';

const App = () => {
  const dispatch = useAppDispatch();
  const autoSave = useAppSelector((state) => state.autoSave.autoSave);

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
        <ServiceLogForm
          initialValues={autoSave ?? undefined}
          onAutoSave={(data) => dispatch(setAutoSave(data))}
          onClear={() => dispatch(clearAutoSave())}
          onCreateDraft={() => {}}
          onSubmit={() => {}}
        />
      </Container>
    </Box>
  );
};

export default App;
