import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';


const PrimeraColumna: React.FC<{
    onIngresarDistancias: () => void;
    onNumEquiposChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFechaInicioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    
}> = ({ onIngresarDistancias, onNumEquiposChange, onFechaInicioChange, disabled }) => {
    return (
        <div className="primera-columna">
            <Typography variant="h5" gutterBottom>
                Calendario de eventos deportivos
            </Typography>
            {/* Agrega aquí el logo */}
            <Typography variant="body1" gutterBottom>
                Para generar el calendario de eventos deportivos, ingrese el número de equipos que van a participar, el máximo y mínimo de encuentros continuos como visitante o de local y la fecha desde la que desea que se calcule.
            </Typography>
            <div className="parametros-equipos">
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
                    onChange={onFechaInicioChange}
                />
            </div>
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
    const [fechaInicio, setFechaInicio] = useState<String>('');
    const [encuentros, setEncuentros] = useState<[]>([]);

    const handleIngresarDistancias = () => {
        setMostrarSegundaColumna(true);
    };

    const handleNumEquiposChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNumEquipos(Number(e.target.value));
    };
    
    const handleFechaInicioChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFechaInicio(String(e.target.value));
    };

    const handleGenerar = async () => {


        const data = {
            numEquipos,
            minTamañoGira: 1,
            maxTamañoGira: 3,
            distancias: Object.fromEntries(distancias),
        };

        try {
            await axios.post('/api/generar', data).then((res) => {
                setEncuentros(res.data.result);
            });
        } catch (error) {
            console.error('Error al generar:', error);
        }

    };



    return (
        <div className="tres-columnas">

            <div className="tres-columnas-header">
                <Typography variant="h5" color="white" textAlign="center" gutterBottom>
                    Calendario de eventos deportivos
                </Typography>
            </div>

            <div className="columnas">
                <PrimeraColumna
                    onIngresarDistancias={handleIngresarDistancias}
                    onNumEquiposChange={handleNumEquiposChange}
                    onFechaInicioChange={handleFechaInicioChange}
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
                <TerceraColumna 
                    fechaInicio={fechaInicio}
                    encuentros={encuentros}
                />
            </div>

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
            <div className="distancias-inputs">
                {generarDistancias()}
            </div>
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

const TerceraColumna: React.FC <{ 
    fechaInicio: String,
    encuentros: []
 }> = ( {fechaInicio, encuentros} ) => {
    
    const fechaInicioDate : string = fechaInicio.toString()+'T12:00:00';
    var currentDate = new Date(fechaInicioDate);

    const handleFechaCurrent = () => {
        currentDate.setDate(currentDate.getDate() + 1);

        return(
            <Typography variant="h6" gutterBottom>
                            Fecha {currentDate.toLocaleDateString()}
            </Typography>
        );
    };

    return (
        <div className={Object.keys(encuentros).length === 0 ? 'tercera-columna' : 'tercera-columna-tournament-loaded'}>
            <Typography variant="h5" gutterBottom>
                Calendario Sugerido
            </Typography>
            <div className ='encuentros'>
                {encuentros.map((encuentro: any, indexFecha: number) => (
                    <div className="fecha">

                         {handleFechaCurrent()}

                        {encuentro.map((rival: any, indexEquipo: number) => (
                            <div className="partido">
                                <Typography variant="subtitle1" gutterBottom>
                                    {'->'} {rival < 0 ? '(V)' : '(L)'} {indexEquipo + 1} vs {Math.abs(rival)} 
                                </Typography>
                            </div>
                        ))}

                    </div>
                ))}
            </div>  
        </div>
    );
};

export default TresColumnas;