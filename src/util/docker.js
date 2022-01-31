import { exec } from 'child_process';
import path from 'path';
import { getAppRootPath, getPathConfigFolderDocker } from './app.js';
import terminal from './terminal.js';

const docker = {
    async registerCredentials(USER, PASSWORD, REGISTRY = "", pathSaveCredential = null){
        const PATH_SAVE_CREDENTIAL = pathSaveCredential || getPathConfigFolderDocker();
        const ARGS = `"${REGISTRY}" "${USER}" "${PASSWORD}" "${PATH_SAVE_CREDENTIAL}"`;
        return terminal.execute(`docker_create_credential.sh`, ARGS, true);
    },
    async getOfficialRegistry(){
        return terminal.execute(`docker info --format '{{json .}}'`).then( response => {
            return JSON.parse(response).IndexServerAddress;
        });
    },
    getDockerConfig(){
        const ROOT_PATH = getAppRootPath();
        const COMPOSE_FILE_PATH = path.join(ROOT_PATH, 'src', 'docker');
        return {
            COMPOSE_FILE_PATH
        };
    },
    async runServices( services ){
        const { COMPOSE_FILE_PATH } = this.getDockerConfig();
        const promises = [];
        services.forEach( serviceName => {
            const SERVICE_NAME = serviceName.toLowerCase();
            const ARGS = `"${COMPOSE_FILE_PATH}" "${SERVICE_NAME}"`;
            promises.push(
                terminal.execute(`docker_up_service.sh`, ARGS, true);
            );
        })
        return Promise.allSettled( promises );
    }
};

const { registerCredentials } = docker;
export { registerCredentials };
export default docker;