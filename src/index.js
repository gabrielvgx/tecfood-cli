import path from 'path';
import os from 'os';
import emoji from 'node-emoji';
import getPort, {portNumbers} from 'get-port';

import question from './questions/question.js';
import app from './util/app.js';
import docker from './util/docker.js';

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error, error.message);
});
  

async function build(){
    const HOME_PATH = os.homedir();
    const WORKDIR_PATH = `${HOME_PATH}/workfolder`;
    let availablePorts = [];
    availablePorts = availablePorts.concat( await getPort({port: portNumbers(3000, 3100)}) );
    availablePorts = availablePorts.concat( await getPort({
        port: [9191, 8080].concat(Array.from(portNumbers(9000, 9100)))
    }) );
    availablePorts = availablePorts.concat( await getPort({
        port: [27017].concat(Array.from(portNumbers(27000, 27100)))
    }) );
    const DEFAULT_CONFIG = {
        services: {
            app: {
                volumes: [ `${WORKDIR_PATH}:/home/developer/workfolder` ]
            },
            basedev: {
                volumes: [ 
                    `${WORKDIR_PATH}:/home/developer/workfolder`,
                    '/u01:/u01'
                ],
                ports: [ `${availablePorts.shift()}:80` ]
            },
            birt: {
                volumes: [ `${WORKDIR_PATH}:/var/www` ],
                ports: [ `${availablePorts.shift()}:9191` ]
            },
            mongo: {
                ports: [ `${availablePorts.shift()}:27017` ]
            }
        }
    };
    app.generateEnvFile(DEFAULT_CONFIG);
}
await build();
question.executeQuestions().then( response => {
    if ( response !== 'EXIT' ) {
        const ROOT_PATH = app.getAppRootPath();
        const dockerComposeFile = path.join(ROOT_PATH, 'src', 'docker', 'docker-compose.yml');
        if(app.hasAccess(dockerComposeFile)){
            docker.runServices( response );
        }
    }
}).catch( error => {
    console.error(emoji.get('x'), error.message);
});