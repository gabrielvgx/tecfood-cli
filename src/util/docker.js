import { exec } from 'child_process';
import path from 'path';
import { getAppRootPath, getPathConfigFolderDocker } from './app.js';

const docker = {
    async registerCredentials(USER, PASSWORD, REGISTRY = "", pathSaveCredential = null){
        const APP_ROOT_PATH = getAppRootPath();
        const PATH_SAVE_CREDENTIAL = pathSaveCredential || getPathConfigFolderDocker();
        let dockerLoginScript = path.join(APP_ROOT_PATH, 'src', 'util', 'scripts', 'docker_create_credential.sh');
        let resolvePromise, rejectPromise;
        let promise = new Promise((resolve, reject)=>{
            resolvePromise = resolve;
            rejectPromise = reject;
        });
        exec(`/bin/bash ${dockerLoginScript} "${REGISTRY}" "${USER}" "${PASSWORD}" "${PATH_SAVE_CREDENTIAL}"`, ( err, stdout, stderr ) => {
            if( err ) {
                rejectPromise(err);
            } else {
                resolvePromise('sucess');
            }
        });
        return promise;
    }
};

const { registerCredentials } = docker;
export { registerCredentials };
export default docker;