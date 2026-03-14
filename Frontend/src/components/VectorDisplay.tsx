import { useState, useRef } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { VectorizedRow } from '../types';

interface VectorDisplayProps {
  columns: string[];
  selectedColumn: string;
  setSelectedColumn: (column: string) => void;
  fileData: File | null;
  onError: (message: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

function VectorDisplay({
  columns,
  selectedColumn,
  setSelectedColumn,
  fileData,
  onError,
}: VectorDisplayProps) {
  const [loading, setLoading] = useState(false);
  const [vectorized, setVectorized] = useState(false);
  const [vectorizedData, setVectorizedData] = useState<VectorizedRow[]>([]);
  const downloadLink = useRef<HTMLAnchorElement>(null);

  const handleVectorize = async () => {
    if (!selectedColumn) {
      onError('Please select a column first.');
      return;
    }
    if (!fileData) {
      onError('No file data available.');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim() !== '');

      if (lines.length === 0) {
        onError('The file appears to be empty or improperly formatted.');
        setLoading(false);
        return;
      }

      const headers = lines[0].split(',').map((header) => header.trim());
      const data = lines.slice(1).map((row) => {
        const values = row.split(',').map((value) => value.trim());
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      try {
        const response = await axios.post(`${API_URL}/vectorize`, {
          column: selectedColumn,
          data,
        });

        const vectors: number[][] = response.data.vectors;
        const updatedData: VectorizedRow[] = data.map((row, index) => ({
          ...row,
          vectorized: vectors[index] || [],
        }));

        setVectorizedData(updatedData.slice(0, 5));
        setVectorized(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          onError(`Vectorization failed: ${error.response.data?.error || error.message}`);
        } else {
          onError('Vectorization failed: Could not connect to the server.');
        }
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(fileData);
  };

  const handleDownload = async () => {
    if (!vectorized) {
      onError('Please vectorize the data first.');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      if (downloadLink.current) {
        downloadLink.current.href = url;
        downloadLink.current.click();
      }

      setVectorized(false);
      setSelectedColumn('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        onError(`Download failed: ${error.response.data?.error || error.message}`);
      } else {
        onError('Download failed: Could not connect to the server.');
      }
    }
  };

  // Dynamic columns: all CSV columns except render vectorized separately
  const displayColumns = columns.filter((c) => c !== 'vectorized');

  return (
    <Box sx={{ mt: 3 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleVectorize}
        disabled={loading || vectorized}
      >
        {loading ? 'Processing...' : 'Vectorize'}
      </Button>

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {vectorized && (
        <>
          <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
            Vectorization completed!
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {displayColumns.map((col) => (
                    <TableCell key={col}>{col}</TableCell>
                  ))}
                  <TableCell>Vectorized</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vectorizedData.map((row, index) => (
                  <TableRow key={index}>
                    {displayColumns.map((col) => (
                      <TableCell key={col}>{String(row[col] ?? '')}</TableCell>
                    ))}
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {JSON.stringify(row.vectorized?.slice(0, 5))}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" onClick={handleDownload} sx={{ mt: 2 }}>
            Download Vectorized Data
          </Button>
        </>
      )}

      <a ref={downloadLink} style={{ display: 'none' }} href="#placeholder">
        Download
      </a>
    </Box>
  );
}

export default VectorDisplay;
