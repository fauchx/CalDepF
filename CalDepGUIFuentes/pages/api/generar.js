import fs from 'fs';
import { nanoid } from 'nanoid';
import * as MiniZinc from 'minizinc';
const { exec } = require('child_process');
const path = require('path');

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
        const minizincPath = 'node_modules/minizinc/dist/minizinc.js';

        fs.writeFile(fileName, content, async (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al escribir el archivo' });
            } else {
                try {
                    // Construct the command to execute the MiniZinc model
                    const command = `minizinc ${modelPath} ${dataPath}`;//ERROR LOCALIZAR EJECUTABLE DE MINIZINC

                    // Execute the command using the child_process module
                    exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error executing MiniZinc model:', error);
                        res.status(500).json({ error: 'Failed to execute MiniZinc model' });
                        return;
                    }

                    // Process the output or error messages from the command
                    const result = stdout.trim();
                    const errorOutput = stderr.trim();

                    if (errorOutput) {
                        console.error('Error executing MiniZinc model:', errorOutput);
                        res.status(500).json({ error: 'Failed to execute MiniZinc model' });
                        return;
                    }

                    // Handle the result of the MiniZinc execution
                    res.status(200).json({ result });
                    });
                } catch (error) {
                    res.status(500).json({ error: 'Error al ejecutar el modelo MiniZinc', message: error.message });
                }
            }
        });
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
