import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';


const PrimeraColumna: React.FC<{
    onIngresarDistancias: () => void;
    onNumEquiposChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}> = ({ onIngresarDistancias, onNumEquiposChange, disabled }) => {
    return (
        <div className="primera-columna">
            <Typography variant="h5" gutterBottom>
                Calendario de eventos deportivos
            </Typography>
            {/* Agrega aquí el logo */}
            <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                fermentum metus ac augue consequat, et bibendum urna ornare. Mauris
                vehicula turpis vitae purus feugiat, ut vestibulum quam ullamcorper.
                Proin vitae magna sed nulla euismod cursus. Donec vitae tincidunt
                urna.
            </Typography>
            <TextField
                label="Número de equipo"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={onNumEquiposChange}
                disabled={disabled}
            />
            <TextField
                label="Tamaño mínimo de gira"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Tamaño máximo de gira"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Fecha de inicio"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <Button
                variant="contained"
                color="primary"
                className="boton-distancias"
                onClick={onIngresarDistancias}
                disabled={disabled}
            >
                Ingresar distancias
            </Button>
        </div>
    );
};

const TresColumnas: React.FC = () => {
    const [numEquipos, setNumEquipos] = useState<number>(0);
    const [distancias, setDistancias] = useState<Map<string, number>>(new Map());
    const [mostrarSegundaColumna, setMostrarSegundaColumna] = useState(false);

    const handleIngresarDistancias = () => {
        setMostrarSegundaColumna(true);
    };

    const handleNumEquiposChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNumEquipos(Number(e.target.value));
    };

    const handleGenerar = async () => {


        const data = {
            numEquipos,
            minTamañoGira: 1,
            maxTamañoGira: 3,
            distancias: Object.fromEntries(distancias),
        };

        try {
            await axios.post('/api/generar', data);
        } catch (error) {
            console.error('Error al generar:', error);
        }

    };



    return (
        <div className="tres-columnas">
            <PrimeraColumna
                onIngresarDistancias={handleIngresarDistancias}
                onNumEquiposChange={handleNumEquiposChange}
                disabled={mostrarSegundaColumna}
            />
            {mostrarSegundaColumna && (
                <SegundaColumna
                    numEquipos={numEquipos}
                    distancias={distancias}
                    setDistancias={setDistancias}
                    onGenerar={handleGenerar}
                />
            )}
            <TerceraColumna />
        </div>
    );
};

const SegundaColumna: React.FC<{
    numEquipos: number;
    distancias: Map<string, number>;
    setDistancias: (distancias: Map<string, number>) => void;
    onGenerar: any;
}> = ({ numEquipos, distancias, setDistancias, onGenerar }) => {
    const handleDistanciaChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => {
        const newDistancias = new Map(distancias);
        newDistancias.set(key, Number(e.target.value));
        setDistancias(newDistancias);
    };

    const generarDistancias = () => {
        const distanciasArray: JSX.Element[] = [];
        for (let i = 1; i <= numEquipos; i++) {
            for (let j = i + 1; j <= numEquipos; j++) {
                const key = `${i}-${j}`;
                distanciasArray.push(
                    <div key={key} className="distancia-item">
                        <Typography variant="body1">
                            Distancia entre equipo {i} y equipo {j}:
                        </Typography>
                        <TextField
                            type="number"
                            value={distancias.get(key) || ''}
                            /*@ts-ignore */
                            onChange={(e) => handleDistanciaChange(e, key)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    </div>
                );
            }
        }
        return distanciasArray;
    };

    return (
        <div className="segunda-columna">
            <Typography variant="h5" gutterBottom>
                Distancia entre locaciones
            </Typography>
            {generarDistancias()}
            <Button
                variant="contained"
                color="primary"
                className="boton-generar"
                onClick={onGenerar}
            >
                Generar
            </Button>
        </div>
    );
};

const TerceraColumna: React.FC = () => {
    return (
        <div className="tercera-columna">

        </div>
    );
};

export default TresColumnas;