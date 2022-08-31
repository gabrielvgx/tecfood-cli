// import { Observable } from 'rxjs';
// import Listr from 'listr';
// import path from 'path';
// import async from 'async';
import UtilApp from './app.js';
import terminal from './terminal.js';

const apk = {
    async buildApk(pathApp, typeBuild){
        if(!UtilApp.hasAccess(pathApp)) {
            return Promise.reject('INVALID_PATH');
        }
        return terminal.execute('cordova --version').then( async _ => {
            return await terminal.execute('build_apk.sh', `${pathApp} ${typeBuild}`, true).catch( error => {
                return 'ERROR_BUILD_APK ' + error;
            });
        }).catch( error => {
            return 'CORDOVA_NOT_INSTALLED ' + error;
        });
    }
};

// const { registerCredentials } = docker;
// export { registerCredentials };
export default apk;