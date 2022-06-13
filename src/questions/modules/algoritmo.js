import { text } from '../template_option.js';
import os from 'os';
import path from 'path';

const algoritmo = {
    name: 'ALGORITMO',
    async execute(){
        const { value: ALGORITMO_BASEPATH       } = await text("Caminho base (mapeado para /home/node/app)", path.join(os.homedir(), 'workfolder', 'algoritmo'));
        const { value: ALGORITMO_CONTAINER_NAME } = await text("Container name", 'algoritmo-container');
        const { value: ALGORITMO_EXT_PORT_9191  } = await text("Porta mapeada para 9191", '9521');
        const RESPONSE = {
            ALGORITMO_BASEPATH,
            ALGORITMO_CONTAINER_NAME,
            ALGORITMO_EXT_PORT_9191,
        };
        return RESPONSE;
    }
}
export default algoritmo;