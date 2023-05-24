import React, { use, useEffect, useState } from 'react';
import { Button, TextField, Typography, Switch } from '@mui/material';
import MuiSwitch from './MuiSwitch';
import MuiSelect from './MuiSelect';
import Loader from './Loader';
import Canva from './Canva';
import axios from 'axios';


const PrimeraColumna: React.FC<{
    onIngresarDistancias: () => void;
    onNumEquiposChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFechaInicioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setEscribirDistancias: React.Dispatch<React.SetStateAction<boolean>>;
    objetivo: string;
    setObjetivo: React.Dispatch<React.SetStateAction<string>>;
    disabled: boolean;
    
}> = ({ onIngresarDistancias,
    onNumEquiposChange,
    onFechaInicioChange,
    setEscribirDistancias,
    objetivo, 
    setObjetivo, 
    disabled }) => {
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
                    inputProps={ {min: 0, inputMode: 'numeric'} }
                />
                <TextField
                    label="Tamaño mínimo de gira"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={disabled}
                    inputProps={ {min: 0, inputMode: 'numeric'} }
                />
                <TextField
                    label="Tamaño máximo de gira"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={disabled}
                    inputProps={ {min: 0, inputMode: 'numeric'} }
                />
                <TextField
                    label="Fecha de inicio"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                    onChange={onFechaInicioChange}
                />
                <MuiSwitch labelText='Ingresar distancias manualmente:' setState={setEscribirDistancias}/>
                <MuiSelect label='Objetivo' objetivo={objetivo} setObjetivo={setObjetivo}/>
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
    const [escribirDistancias, setEscribirDistancias] = useState<boolean>(true);
    const [fechaInicio, setFechaInicio] = useState<String>('');
    const [encuentros, setEncuentros] = useState<[]>([]);
    const [costo, setCosto] = useState<number>(0);
    const [mostrarFechas, setMostrarFechas] = useState(false);
    const [loading, setLoading] = useState(false);
    const [objetivo, setObjetivo] = useState<string>('optimizar');

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

        setMostrarFechas(true);
        setLoading(true);

        const data = {
            numEquipos,
            minTamañoGira: 1,
            maxTamañoGira: 3,
            distancias: escribirDistancias ? Object.fromEntries(distancias) : distancias,
            objetivo: objetivo,
        };

        try {
            await axios.post('/api/generar', data).then((res) => {
                setEncuentros(res.data.result);
                setCosto(res.data.cost);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error al generar:', error);
            setLoading(false);
        }

    };



    return (
        <div className="tres-columnas">

            <div className="tres-columnas-header">
                <Typography variant="h4" className='m-0' color="white" textAlign="center" gutterBottom>
                    Calendario de eventos deportivos
                </Typography>
            </div>

            <div className="columnas">
                <PrimeraColumna
                    onIngresarDistancias={handleIngresarDistancias}
                    onNumEquiposChange={handleNumEquiposChange}
                    onFechaInicioChange={handleFechaInicioChange}
                    setEscribirDistancias={setEscribirDistancias}
                    objetivo={objetivo}
                    setObjetivo={setObjetivo}
                    disabled={mostrarSegundaColumna}
                />
                {mostrarSegundaColumna && (
                    <SegundaColumna
                        numEquipos={numEquipos}
                        distancias={distancias}
                        setDistancias={setDistancias}
                        onGenerar={handleGenerar}
                        escribirDistancias={escribirDistancias}
                        disabled={mostrarFechas}
                        
                    />
                )}
                <TerceraColumna 
                    fechaInicio={fechaInicio}
                    encuentros={encuentros}
                    costo={costo}
                    numEquipos={numEquipos}
                    loading={loading}
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
    escribirDistancias: boolean;
    disabled: boolean;
}> = ({ numEquipos, distancias, setDistancias, onGenerar, escribirDistancias, disabled }) => {
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
                            //value={distancias.get(key) || ''}
                            /*@ts-ignore */
                            onChange={(e) => handleDistanciaChange(e, key)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            inputProps={ {min: 0, inputMode: 'numeric'} }
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
                {escribirDistancias ? generarDistancias() : <Canva numeroEquipos={numEquipos} setDistancias={setDistancias} />}	  
            </div>
            <Button
                variant="contained"
                color="primary"
                className="boton-generar"
                onClick={onGenerar}
                disabled={disabled}
            >
                Generar
            </Button>
        </div>
    );
};

const TerceraColumna: React.FC <{ 
    fechaInicio: String,
    encuentros: [],
    costo: number,
    numEquipos: number
    loading: boolean
 }> = ( {fechaInicio, encuentros, costo, numEquipos, loading} ) => {
    
    const [chargedRequest, setChargedRequest] = useState(false);
    const fechaInicioDate : Date = new Date (fechaInicio.toString()+'T12:00:00');
    var currentDate : Date;
    var matches : any = {}; //Variable que sirve para verifica si ya se registró un partido para un equipo en una fecha particular

    const handleFechaCurrent = (indexFecha :  number) => {
        currentDate = new Date(fechaInicioDate);
        currentDate.setDate(currentDate.getDate() + indexFecha);

        return(
            <Typography variant="subtitle2" gutterBottom>
                            {currentDate.toLocaleDateString()}
            </Typography>
        );
    };

    useEffect(() => {
        if(!chargedRequest && loading){
            setChargedRequest(true);
        }
    }, [loading]);

    const handleRefresh = () => {
        window.location.reload();
    }

    const handlePartidos = (rival : number, equipo :  number) => {;
        
        if (!(Math.abs(rival) in matches)) {

            if (equipo === numEquipos) {
                matches = {};
            } else {
                matches[equipo] = rival;
            }

            return (
                <div className="partido">
                        <Typography variant="subtitle1" gutterBottom>
                            Partido  {rival < 0 ? '(V)' : '(L)'} Equipo {equipo} vs Equipo {Math.abs(rival)} 
                        </Typography>
                </div>
            );
        } else if (equipo === numEquipos) {
            matches = {};
        }

    };

    return (
        <div className={ chargedRequest ? 'tercera-columna' : 'tercera-columna no-tournament-loaded'}>
            <div className='header-tercera-columna'>
                <Typography variant="h5" gutterBottom>
                    Calendario Sugerido
                </Typography>
                { chargedRequest &&
                    <div className='costo-resultado'>
                        <Typography variant="subtitle1" gutterBottom>
                            Costo de giras: {costo}
                        </Typography> 
                    </div>
                }
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className ='encuentros'>
                    {encuentros.map((encuentro: any, indexFecha: number) => (
                        <div className="fecha">

                            <div className='date'>
                                {handleFechaCurrent(indexFecha)}
                                <div className='linea'></div>
                            </div>

                            <div className='partidos'>
                                {encuentro.map((rival: number, indexEquipo: number) => (
                                    handlePartidos(rival, indexEquipo + 1)
                                ))}
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
            { chargedRequest &&
                <Button variant="contained" color="primary" className="boton-generar" onClick={handleRefresh} >
                    Reset
                </Button>
            }
        </div>
    );
};

export default TresColumnas;