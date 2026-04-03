import { time } from 'console';
import fs from 'fs';

const logpath = './data/logs.txt'

if(!fs.existsSync(logpath))
{
    fs.writeFileSync(logpath,JSON.stringify([]));
}

export function LogMethod(req, start, status)
{
    let logs = JSON.parse(fs.readFileSync(logpath));

    let log = {
        date: new Date().toLocaleDateString(),
        method: req.method,
        url: req.url,
        params: req.query,
        body: req.body,
        status: status,
        duration: `${Date.now() - start} ms`
    }

    logs.push(log);
    fs.writeFileSync(logpath,JSON.stringify(logs) + "\n");
}