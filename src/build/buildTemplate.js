import os from 'os';
import fs from 'fs';
import path from 'path';
import mnemonic from '../util/mnemonic.js';
import { generateEnvFile } from '../util/app.js';

const buildTemplate = {
    hasAccess(file){
        try {
            fs.accessSync(file);
            return true;
        } catch ( error ) {
            return false;
        }
    },
    run(){
        const PATH_ENV = path.resolve('src/build/config/environment.json');
        if(!this.hasAccess(PATH_ENV)){
            generateEnvFile();
        }
        const ENV = JSON.parse(fs.readFileSync(PATH_ENV, 'utf-8'));
        const FILES = [
            {
                filePath: path.resolve('src/docker/docker-compose.yml.template'),
                onBeforeWrite: ( fileContent ) => fileContent.replace(/#.+/gi, '').replace(/^\n/gim, '')
            }
        ];
        const replaceMnemonics = configFile => {
            const { filePath, onBeforeWrite = null } = configFile;
            mnemonic.replaceFromMap(filePath, ENV, { onBeforeWrite });
        };
        FILES.forEach( replaceMnemonics );
    }
};
buildTemplate.run();