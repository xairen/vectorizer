import { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Divider,
  IconButton,
  CssBaseline,
  Snackbar,
  Alert,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DarkMode, LightMode } from '@mui/icons-material';
import { getTheme } from './theme';
import FileUpload from './components/FileUpload';
import ColumnSelect from './components/ColumnSelect';
import VectorDisplay from './components/VectorDisplay';

function App() {
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [fileData, setFileData] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('themeMode');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{ mt: 4, p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Vectorizer
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <FileUpload
          setColumns={setColumns}
          setFileData={setFileData}
          onError={setError}
        />
        {columns.length > 0 && (
          <>
            <Box sx={{ mt: 4 }}>
              <ColumnSelect
                columns={columns}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
              />
            </Box>
            <Box sx={{ mt: 4 }}>
              <VectorDisplay
                columns={columns}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
                fileData={fileData}
                onError={setError}
              />
            </Box>
          </>
        )}
      </Container>
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
