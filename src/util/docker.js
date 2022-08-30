import { Observable } from 'rxjs';
import Listr from 'listr';
import path from 'path';
import async from 'async';
import UtilApp from './app.js';
import terminal from './terminal.js';

const docker = {
    getRegistryByImage( imageStr ){
        if( !imageStr || typeof imageStr !== 'string') imageStr = '';
        let {groups: {registry = ''}} = (imageStr.match(/(?<registry>[\w\-\.]+)/i) || {groups: {}});
        return registry;
    },
    async registerCredentials(USER, PASSWORD, REGISTRY = "", pathSaveCredential = null){
        const PATH_SAVE_CREDENTIAL = pathSaveCredential || UtilApp.getPathConfigFolderDocker();
        const ARGS = `"${REGISTRY}" "${USER}" "${PASSWORD}" "${PATH_SAVE_CREDENTIAL}"`;
        return terminal.execute(`docker_create_credential.sh`, ARGS, true);
    },
    async getOfficialRegistry(){
        return terminal.execute(`docker info --format '{{json .}}'`).then( response => {
            return JSON.parse(response).IndexServerAddress;
        });
    },
    getDockerConfig(){
        const ROOT_PATH = UtilApp.getAppRootPath();
        const COMPOSE_FILE_PATH = path.join(ROOT_PATH, 'src', 'docker');
        return {
            COMPOSE_FILE_PATH
        };
    },
    async runServices( services ){
        const { COMPOSE_FILE_PATH } = this.getDockerConfig();
        let env = UtilApp.getEnv();
        const tasks = new Listr([
            {
                title: 'Pull Images',
                task: () => {
                    return new Observable(observer => {
                        let selectedServices = Object.keys(env.services).filter( serv => services.includes(serv));
                        async.eachSeries(selectedServices, function(serviceName, callback){
                            const SERVICE_NAME = serviceName.toLowerCase();
                            const IMAGE = env.services[SERVICE_NAME].image;
                            observer.next(IMAGE);
                            terminal.execute(`docker_pull.sh`, IMAGE, true).finally(()=>{
                                callback();
                            });
                        }).then( _ => {
                            observer.complete();
                        });

                    });
                }
            },
            {
                title: '(Re)Creating containers',
                task: () => {
                    return new Observable( observer => {
                        async.eachSeries(services, function(serviceName, callback){
                            const SERVICE_NAME = serviceName.toLowerCase();
                            const ARGS = `"${COMPOSE_FILE_PATH}" "${SERVICE_NAME}"`;
                            observer.next(env.services[SERVICE_NAME].container_name);
                            terminal.execute(`docker_up_service.sh`, ARGS, true).finally(()=>{
                                callback();
                            });
                        }).then( _ => observer.complete());
                    });
                }
            }
        ]);
        
        return tasks.run();
    }
};

const { registerCredentials } = docker;
export { registerCredentials };
export default docker;