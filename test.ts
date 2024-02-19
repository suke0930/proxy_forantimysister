import axios from 'axios';
import { existsSync } from 'fs';
const argvalue = process.argv[2];
//-console.log(argvalue);
if (!argvalue) {
    console.log("no set arg.exit.");
    process.exit();
}
const postData = {
    value: argvalue, // テスト用に適当な値を指定
};

axios.post('http://localhost:5355', postData)
    .then(response => {
        console.log('POST request successful:', response.data);
    })
    .catch(error => {
        console.error('Error making POST request:', error.message);
    });
