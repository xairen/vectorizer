import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface ColumnSelectProps {
  columns: string[];
  selectedColumn: string;
  setSelectedColumn: (column: string) => void;
}

function ColumnSelect({ columns, selectedColumn, setSelectedColumn }: ColumnSelectProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <FormControl fullWidth>
        <InputLabel>Select Column</InputLabel>
        <Select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          label="Select Column"
        >
          {columns.map((column) => (
            <MenuItem key={column} value={column}>
              {column}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default ColumnSelect;
