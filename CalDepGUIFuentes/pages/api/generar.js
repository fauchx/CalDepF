import fs from 'fs';
import { nanoid } from 'nanoid';
import MiniZinc from 'minizinc';

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

        fs.writeFile(fileName, content, async (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al escribir el archivo' });
            } else {
                const minizinc = new MiniZinc();
                const modelPath = 'modelo/CalDep.mzn';
                const dataPath = `./${fileName}`;

                try {
                    const result = await minizinc.solve(modelPath, dataPath, { outputMode: 'json' });
                    fs.unlinkSync(dataPath); // Elimina el archivo .dzn después de su uso
                    res.status(200).json(result);
                } catch (error) {
                    fs.unlinkSync(dataPath); // Elimina el archivo .dzn en caso de error
                    res.status(500).json({ error: 'Error al ejecutar el modelo MiniZinc' });
                }
            }
        });
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
