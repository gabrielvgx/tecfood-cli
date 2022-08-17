import os from 'os';
import path from 'path';
import prompts from 'prompts';
import { text } from '../template_option.js';

const basedev = {
    name: 'BASEDEV',
    async execute(){
        const { value: BASEDEV_BASEPATH       } = await text("Caminho base (mapeado para /home/developer/workfolder)", path.join(os.homedir(), 'workfolder'));
        const { value: BASEDEV_CONTAINER_NAME } = await text("Container name", 'dev-container');
        const { value: BASEDEV_EXT_PORT_80    } = await text("Porta mapeada para 80", '3000');
        const { value: SSH_PATH               } = await prompts([
            {
                type: 'confirm',
                name: 'value',
                message: 'Mapear pasta .ssh? (Ssh dentro do container será a mesma por fora)',
                initial: true
            },
            {
                type: prev => prev === true ? 'text' : null,
                name: 'value',
                message: 'Caminho para mapear pasta ssh (mapeado para /root/.ssh)',
                initial: path.join(os.homedir(), '.ssh')
            }
        ]);
        const RESPONSE = {
            BASEDEV_BASEPATH,
            BASEDEV_CONTAINER_NAME,
            BASEDEV_EXT_PORT_80,
            BASEDEV_SSHPATH: SSH_PATH || ''
        };
        return RESPONSE;
    }
}
export default basedev;