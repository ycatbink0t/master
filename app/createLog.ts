import {Socket} from "socket.io";
import axios from 'axios'

interface Query {
    type: string,
    query: string,
}

async function createLog (data: Query | Buffer | string, socket: Socket, path: string = '', newbie: boolean = false) {
    let log: string = `[${socket.handshake.time}] ${socket.handshake.address} ${JSON.stringify(socket.request.headers['user-agent'])} `;
    if (newbie) {
        log += ' - New Connection';
    }
    else {
        if (path.length > 1) {
            log += ' - New Image: ' + path;
        }
        else {
            if (data instanceof String) {
                log += ' - New RAW: ' + data;
            }
            if (data instanceof Object) {
                log += ' - New JSON: ' + JSON.stringify(data);
                let res: any;
                try {
                    res = await axios.get('https://app.zenserp.com/api/v2/search', {
                        headers: {
                            apikey: '1f9c70e0-d18f-11e9-81db-9913d9ac3b59',
                        },
                        params: {
                            // @ts-ignore
                            q: data.query,
                        },
                    });
                } catch (e) {
                    console.log(e);
                }
                log += ' ,about ' + res.data.number_of_results + ' results.';
            }
        }
    }
    return log + '\n';
}

export default createLog;



