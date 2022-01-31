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
        return termina.execute(`docker info --format '{{json .}}'`).then( response => {
            return JSON.parse(response).IndexServerAddress;
        });
    }
};

const { registerCredentials } = docker;
export { registerCredentials };
export default docker;