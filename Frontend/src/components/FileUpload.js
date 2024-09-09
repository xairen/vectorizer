import React, { useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';

function FileUpload({ setColumns, setFileData }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5001/upload', formData);
            setColumns(response.data.columns);
            setFileData(file);
        } catch (error) {
            console.error("There was an error uploading the file!", error);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Upload your CSV or Parquet file:</Typography>
            <input
                type="file"
                onChange={handleFileChange}
                style={{ margin: '20px 0' }}
            />
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
        </Box>
    );
}

export default FileUpload;
