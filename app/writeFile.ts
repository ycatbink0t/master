import fs from 'fs';
import { promisify } from "util";
import path from 'path';
import fileType from 'file-type';

const writeFile = promisify(fs.writeFile);
const dir = path.join(__dirname, 'public');

async function writeF(buffer: Buffer) {
    // @ts-ignore
    const { ext } = fileType(buffer);

    const path = dir + '\\' + Math.random().toString(36).substring(7) + '.' + ext;
    try {
        await writeFile(path, buffer);
    } catch (e) {
        console.log(e);
    }
    return path
}

export default writeF;
