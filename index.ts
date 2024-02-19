import express, { Request, Response, raw } from 'express';
import fs from 'fs';
import { exec } from 'child_process';

const app = express();
const port = 5355;
async function runDockerCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                reject(error);
            } else {
                console.log(`Command output:\n${stdout}`);
                console.error(`Command errors:\n${stderr}`);
                resolve();
            }
        });
    });
}

app.use(express.json());

app.post('/', (req: Request, res: Response) => {
    // 受け取った値を変数に代入
    const rawvalue: string = req.body.value;
    const type: number = req.body.type;
    const lot = (() => {
        if (rawvalue.indexOf("K") !== -1) {
            return Number(rawvalue.replace("K", "")) * 1000
        } else {
            if (rawvalue.indexOf("M") !== -1) {
                return Number(rawvalue.replace("M", "")) * 1000000
            } else {
                return Number(rawvalue)
            }
        }
    })();
    // console.log(lot);
    if (lot) {
        const receivedValue: Number = lot; // 仮のキー名(value)です。実際のJSONの構造に合わせて変更してください。

        // squid.confのパス
        const configFile = './squid/data/squid.conf';

        // squid.confの読み込み
        fs.readFile(configFile, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading squid.conf:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // 行ごとに分割
            const lines = data.split('\n');

            // 1568行目の値を受け取った値で書き換え
            lines[1567] = "delay_parameters 1 " + receivedValue + "/" + receivedValue + " #EDITHERE";

            // 書き換えた内容を結合して新しい文字列を作成
            const modifiedConfig = lines.join('\n');

            // squid.confに書き込み
            fs.writeFile(configFile, modifiedConfig, 'utf-8', async (err) => {
                if (err) {
                    console.error('Error writing squid.conf:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log('squid.conf updated successfully');
                try {
                    await runDockerCommand('docker exec proxy squid -k reconfigure');
                    console.log('Docker command executed successfully.');
                } catch (error) {
                    console.error('Error executing Docker command:', error);
                }
                res.status(200).send('OK');
            });
        });
    } else {
        console.log("not a num");
        res.status(200).send('not a number!');
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
