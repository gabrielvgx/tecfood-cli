import path from 'path';
import os from 'os';

import question from './questions/question.js';
import app from './util/app.js';
import docker from './util/docker.js';
import emoji from 'node-emoji';

function build(){
    const HOME_PATH = os.homedir();
    const IP_PROXY = 'http://192.168.122.121:3128';
    const WORKDIR_PATH = `${HOME_PATH}/workfolder`;
    const DEFAULT_CONFIG = {
        services: {
            app: {
                volumes: [ `${WORKDIR_PATH}:/var/www` ]
            },
            basedev: {
                volumes: [ `${WORKDIR_PATH}:/home/developer/workfolder` ],
                ports: [ "3000:80" ]
            },
            birt: {
                environment: [
                    `http_proxy=${IP_PROXY}`,
                    `https_proxy=${IP_PROXY}`,
                ],
                volumes: [ `${WORKDIR_PATH}:/var/www` ],
                ports: [ "9191:9191" ]
            },
            mongo: {
                ports: [ "27017:27017" ]
            }
        }
    };
    app.generateEnvFile(DEFAULT_CONFIG);
}
build();
question.executeQuestions().then( services => {
    const ROOT_PATH = app.getAppRootPath();
    const dockerComposeFile = path.join(ROOT_PATH, 'src', 'docker', 'docker-compose.yml');
    if(app.hasAccess(dockerComposeFile)){
        docker.runServices( services );
    }
}).catch( error => {
    console.error(emoji.get('x'), error.message);
});