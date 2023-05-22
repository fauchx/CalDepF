import React from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';

const MuiSwitch: React.FC<{
    labelText: String;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({labelText, setState}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(event.target.checked);
      };

    return(
        <Box>
            <FormControlLabel
                control={<Switch defaultChecked onChange={handleChange}/>} 
                label={labelText.toString()}
                labelPlacement="start"
            />
        </Box>
    );
};

export default MuiSwitch;