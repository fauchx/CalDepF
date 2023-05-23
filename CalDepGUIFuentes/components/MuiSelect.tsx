import React from 'react';
import { MenuItem, Select , SelectChangeEvent, InputLabel} from '@mui/material';

const MuiSelect: React.FC<{
    label: String,
    objetivo: string,
    setObjetivo: React.Dispatch<React.SetStateAction<string>>
}> = ({label, objetivo, setObjetivo }) => {

    const handleChange = (event: SelectChangeEvent) => {
        setObjetivo(event.target.value as string);
      };

    return (
        <div>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={objetivo}
                label={label}
                onChange={handleChange}
            >
                <MenuItem value={'optimizar'}>Optimizar</MenuItem>
                <MenuItem value={'satisfacer'}>Satisfacer</MenuItem>
            </Select>
        </div>
    );
};

export default MuiSelect;