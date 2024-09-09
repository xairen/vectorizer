import React, { useState } from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import FileUpload from './components/FileUpload';
import ColumnSelect from './components/ColumnSelect';
import VectorDisplay from './components/VectorDisplay';

function App() {
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [fileData, setFileData] = useState(null);

    return (
        <Container maxWidth="md" sx={{ mt: 4, p: 4, bgcolor: '#f9f9f9', borderRadius: 3, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Vectorizer
                </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />
            <FileUpload setColumns={setColumns} setFileData={setFileData} />
            {columns.length > 0 && (
                <>
                    <Box sx={{ mt: 4 }}>
                        <ColumnSelect columns={columns} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} />
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        <VectorDisplay selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} fileData={fileData} />
                    </Box>
                </>
            )}
        </Container>
    );
}

export default App;
