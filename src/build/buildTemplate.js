import fs from 'fs';

import mnemonic from '../util/mnemonic.js';

const buildTemplate = {
    run(){
        const environment = JSON.parse(fs.readFileSync('./config/environment.json', 'utf-8'));
        const files = [ // @ equivale ao diretorio base onde se encontra o codigo fonte tecfood-cli
            '@/src/docker/docker-compose.yml.template'
        ];
        const replaceMnemonics = fileName => {
            mnemonic.replaceFromMap(fileName, environment);
        }
        files.forEach( replaceMnemonics );
    }
};

buildTemplate.run();
