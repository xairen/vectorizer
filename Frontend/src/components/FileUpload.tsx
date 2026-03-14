import { useCallback } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { CloudUpload } from '@mui/icons-material';

interface FileUploadProps {
  setColumns: (columns: string[]) => void;
  setFileData: (file: File | null) => void;
  onError: (message: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

function FileUpload({ setColumns, setFileData, onError }: FileUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/upload`, formData);
        setColumns(response.data.columns);
        setFileData(file);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          onError(`Upload failed: ${error.response.data?.error || error.message}`);
        } else {
          onError('Upload failed: Could not connect to the server.');
        }
      }
    },
    [setColumns, setFileData, onError]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/octet-stream': ['.parquet'],
    },
    maxFiles: 1,
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload your CSV or Parquet file:
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        {acceptedFiles.length > 0 ? (
          <Typography color="success.main">{acceptedFiles[0].name}</Typography>
        ) : isDragActive ? (
          <Typography color="primary">Drop the file here...</Typography>
        ) : (
          <Typography color="text.secondary">
            Drag & drop a file here, or click to select
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FileUpload;
