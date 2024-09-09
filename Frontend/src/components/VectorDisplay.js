import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function VectorDisplay({ selectedColumn, setSelectedColumn, fileData }) {
    const [loading, setLoading] = useState(false);
    const [vectorized, setVectorized] = useState(false);
    const [vectorizedData, setVectorizedData] = useState([]);
    const downloadLink = useRef(null);

    const handleVectorize = async () => {
        if (!selectedColumn) {
            alert("Please select a column first.");
            return;
        }

        setLoading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');

            if (lines.length === 0) {
                alert("The file appears to be empty or improperly formatted.");
                setLoading(false);
                return;
            }

            const headers = lines[0].split(',').map(header => header.trim());
            const data = lines.slice(1).map(row => {
                const values = row.split(',').map(value => value.trim());
                const obj = {};

                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });

                return obj;
            });

            try {
                const response = await axios.post('http://localhost:5001/vectorize', {
                    column: selectedColumn,
                    data: data
                });

                const vectors = response.data.vectors;
                const updatedData = data.map((row, index) => ({
                    ...row,
                    vectorized: vectors[index] || []
                }));

                setVectorizedData(updatedData.slice(0, 5));  // Store the first 5 rows for preview
                setVectorized(true);
            } catch (error) {
                console.error("There was an error vectorizing the column!", error);
                //alert("Check console");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(fileData);
    };

    const handleDownload = async () => {
        if (!vectorized) {
            alert("Please vectorize the data first.");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5001/download', {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            downloadLink.current.href = url;
            downloadLink.current.click();

            // Reset state for next vectorization
            setVectorized(false);
            setSelectedColumn('');

        } catch (error) {
            console.error("There was an error downloading the file!", error);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="secondary" onClick={handleVectorize} disabled={loading || vectorized}>
                {loading ? "Processing..." : "Vectorize"}
            </Button>
            {vectorized && (
                <>
                    <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
                        Vectorization completed!
                    </Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Vectorized Column</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vectorizedData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{JSON.stringify(row.vectorized)}</TableCell>
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
            {loading && <CircularProgress sx={{ mt: 2 }} />}
            <a ref={downloadLink} style={{ display: 'none' }}>Download</a>
        </Box>
    );
}

export default VectorDisplay;
