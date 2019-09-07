import http from 'http'
import path from 'path'
import fs from 'fs'
import socket, {Socket} from 'socket.io'
import writeFile from './writeFile'
import createLog from './createLog'

const dir = path.join(__dirname, 'public');

const logPath = path.join(__dirname, `log${(new Date()).toDateString().split(' ').join('')}.log`);
let logger = fs.createWriteStream(logPath);

const server = http.createServer(async (req, res) => {
    res.writeHead(200);
    res.end();
});
let serverClosed: boolean = Math.random() < 0.3;

const io = socket(server);
const connectedSockets = new Set();

setInterval(() => {
    serverClosed ? Array.from(connectedSockets).forEach((s:any) => s.disconnect(true)) : '';
    serverClosed = Math.random() < 0.3;
    console.log(serverClosed);
}, 5000);

io.on('connection', async socket => {
    let log = await createLog('', socket, '', true);
    logger.write(log);
    connectedSockets.add(socket);

    socket.use((packet, next) => {
       if (serverClosed) return next(new Error('server closed'));
       return next();
    });

    socket.emit('connected');
    socket.on('request', async data => {
        let log: string;
        if (data instanceof Buffer) {
            const path = await writeFile(data);
            log = await createLog(data, socket, path);
        }
        else {
            console.log(data);
            log = await createLog(data, socket);
        }
        console.log(log);
        logger.write(log);
    });
    console.log('connected');
});

server.listen(8000, () => console.log('Running on ' + 8000));
