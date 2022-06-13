import fs from 'fs';
import path from 'path';

import UtilApp from '../util/app.js';

const cleanBuild = {
    hasAccess(file){
        try {
            fs.accessSync(file);
            return true;
        } catch ( error ) {
            return false;
        }
    },
    execute(){
        const APP_ROOT_PATH = UtilApp.getAppRootPath();
        const FILES_TO_REMOVE = [
            path.join(APP_ROOT_PATH, 'src/build/config/environment.json'),
            path.join(APP_ROOT_PATH, 'src/docker/credentials/config.json'),
            path.join(APP_ROOT_PATH, 'src/docker/docker-compose.yml'),
        ];
        
        const removeFiles = function( filePath ) {
            if( this.hasAccess(filePath) ) {
                fs.unlinkSync(filePath);
            }
        }.bind(this);

        FILES_TO_REMOVE.forEach( removeFiles );
    }
}

cleanBuild.execute();