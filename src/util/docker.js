import { exec } from 'child_process';
import path from 'path';

import { getAppRootPath } from './app.js';

const docker = {
    registerCredentials(USER, PASSWORD, REGISTRY = "", pathSaveCredential = null){
        const APP_ROOT_PATH = getAppRootPath();
        const PATH_SAVE_CREDENTIAL = pathSaveCredential || path.join(APP_ROOT_PATH, 'src', 'docker', 'credentials');
        let dockerLoginScript = path.join(APP_ROOT_PATH, 'src', 'util', 'scripts', 'docker_create_credential.sh');
        exec(`/bin/bash ${dockerLoginScript} "${REGISTRY}" "${USER}" "${PASSWORD}" "${PATH_SAVE_CREDENTIAL}"`, ( err, stdout, stderr ) => {
            if( err ) console.log(err);
            else console.log(stdout);
        });
    }
};

const { registerCredentials } = docker;

export { registerCredentials };
export default docker;