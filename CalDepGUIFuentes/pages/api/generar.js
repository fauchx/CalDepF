import fs from 'fs';
import { nanoid } from 'nanoid';
import * as MiniZinc from 'minizinc';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { numEquipos, minTamañoGira, maxTamañoGira, distancias } = req.body;

        const fileName = `instancias/${nanoid()}.dzn`;

        let content = `n = ${numEquipos};\nMin = ${minTamañoGira};\nMax = ${maxTamañoGira};\nD = [|\n`;

        for (let i = 1; i <= numEquipos; i++) {
            let row = '';
            for (let j = 1; j <= numEquipos; j++) {
                if (i === j) {
                    row += '0';
                } else {
                    const key = i < j ? `${i}-${j}` : `${j}-${i}`;
                    row += distancias[key];
                }

                row += j === numEquipos ? '|' : ',';
            }

            content += row + (i === numEquipos ? '];' : '\n');
        }
        console.log("filename:", fileName)

        const modelPath = 'modelo/CalDep.mzn';
        const dataPath = `${fileName}`;

        fs.writeFile(fileName, content, async (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al escribir el archivo' });
            } else {
                try {
                    const model = new MiniZinc.Model();
                    model.addFile(modelPath);
                    //model.addDznString("n = 4; Min = 1; Max = 3; D = [|0,1,2,3|1,0,4,5|2,4,0,6|3,5,6,0|];");
                    model.addFile(dataPath);
                    const solve = model.solve({
                        jsonOutput: true,
                        options: {
                            solver: 'gecode',
                            timeout: 10000,
                            statistics: true
                        }
                    });
                    // You can listen for events
                    solve.on('solution', solution => console.log(solution.output.json));
                    solve.on('statistics', stats => console.log(stats.statistics));
                    // And/or wait until complete
                    solve.then(result => {
                    console.log(result.solution.output.json);
                    console.log(result.statistics);
                    });
                    
                    solve.then(result => {
                        res.status(200).json(result.solution.output.json);
                        //console.log("SOLUCIÓN --------->", result.solution.output.json);
                    });

                    // Eliminar el archivo .dzn después de su uso
                    fs.unlink(dataPath, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });

                    //res.status(200).json(solve);
                } catch (error) {
                    // Elimina el archivo .dzn en caso de error
                    fs.unlink(dataPath, (err) => {
                        if (err) {
                            console.error('UNLINK ERROR ->', err);
                            return;
                        }
                    });
                    res.status(500).json({ error: 'Error al ejecutar el modelo MiniZinc', message: error.message });
                }
            }
        });
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
