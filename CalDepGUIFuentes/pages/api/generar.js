import fs from 'fs';
import { nanoid } from 'nanoid';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCb);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { numEquipos, minTamañoGira, maxTamañoGira, distancias, objetivo } = req.body;

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

        fs.writeFileSync(fileName, content);

        try {
            const { stdout, stderr } = (objetivo === 'optimizar') ?
                await exec(`minizinc /../CalDep.mzn ${fileName}`) :
                await exec(`minizinc /../CalDepSatisfy.mzn ${fileName}`);
            //console.log(`${stdout}`, splitModelStdout(stdout));
            const { result, cost } = splitModelStdout(stdout, objetivo);
            res.status(200).json({ result: result, cost: cost });
        } catch (error) {
            res.status(500).json({ error: 'Error al ejecutar el modelo MiniZinc' });
        }

        fs.unlinkSync(fileName); // Elimina el archivo .dzn después de su uso

    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}

function splitModelStdout(stdout, objetivo) {
    const lines = stdout.split('\n');
    var startSliceRelevantLns, endSliceRelevantLns, startSliceCost, endSliceCost;
    if (objetivo === 'optimizar') {
        startSliceCost = -4;
        endSliceCost = -3;
    } else if (objetivo === 'satisfacer') {
        startSliceCost = -3;
        endSliceCost = -2;

    }
    const relevantLines = lines.slice(0, -4);
    const cost = Number(lines.slice(startSliceCost, endSliceCost));
    const result = relevantLines.map(line => line.split(' ').map(Number))
    return { result, cost };
}