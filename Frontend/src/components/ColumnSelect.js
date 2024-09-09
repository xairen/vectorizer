import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

function ColumnSelect({ columns, selectedColumn, setSelectedColumn }) {
    return (
        <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
                <InputLabel>Select Column</InputLabel>
                <Select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    label="Select Column"
                >
                    {columns.map((column, index) => (
                        <MenuItem key={index} value={column}>
                            {column}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default ColumnSelect;
