import { confirm, text } from '../template_option.js';
import os from 'os';
import path from 'path';

const birt = {
    name: 'BIRT',
    async execute(){
        const { value: BIRT_BASEPATH       } = await text("Caminho base (mapeado para /var/www)", path.join(os.homedir(), 'workfolder'));
        const { value: BIRT_CONTAINER_NAME } = await text("Container name", 'birt-container');
        const { value: BIRT_EXT_PORT_9191  } = await text("Porta mapeada para 9191", '9191');
        const { value: BIRT_EXT_PORT_8080  } = await text("Porta mapeada para 8080", '8080');
        const RESPONSE = {
            BIRT_BASEPATH,
            BIRT_CONTAINER_NAME,
            BIRT_EXT_PORT_9191,
            BIRT_EXT_PORT_8080
        };
        return RESPONSE;
    }
}
export default birt;