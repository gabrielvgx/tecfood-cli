import { confirm, text } from '../template_option.js';

const apk = {
    name: 'BUILD_APK',
    async execute(){
        
        const { value: SSH_PATH } = await prompts([
            {
                type: 'select',
                name: 'typeProjectCordova',
                message: "Tipo de Projeto - Cordova",
                choices: [
                    { title: 'Novo',      description: 'Configurar um projeto novo do zero', value: "NEW_PROJECT_CORDOVA" },
                    { title: 'Existente', description: 'Utilizar um projeto existente',      value: "NOT_NEW_PROJECT_CORDOVA" },
                ],
                initial: 0
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

export default apk;