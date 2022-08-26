import path from 'path';
import fs from 'fs';
import os from 'os';
import { json2yml } from '../util/fileParser.js';
const app = {
    hasAccess(path){
        try {
            fs.accessSync(path);
            return true;
        } catch ( error ) {
            return false;
        }
    },
    getAppRootPath(){
        const APP_NAME = 'tecfood-cli';
        const CURRENT_PATH = process.env.PWD;
        const PATTERN = new RegExp(`(?<=\\b${APP_NAME}\\b).+`, 'gi');
        const APP_ROOT_PATH = CURRENT_PATH.replace(PATTERN, '');
        return APP_ROOT_PATH;
    },
    getEnvFilePath(){
        const APP_ROOT_PATH = this.getAppRootPath();
        const PATH_ENV = path.join(APP_ROOT_PATH, 'src', 'docker', '.docker-compose.json');
        return PATH_ENV;
    },
    getComposeFilePath(){
        const APP_ROOT_PATH = this.getAppRootPath();
        const PATH_ENV = path.join(APP_ROOT_PATH, 'src', 'docker', 'docker-compose.yml');
        return PATH_ENV;
    },
    getEnv(){
        const PATH_ENV = this.getEnvFilePath();
        const ENV = JSON.parse(fs.readFileSync(PATH_ENV, 'utf8'));
        return ENV;
    },
    getPathAppConfig(){
        return path.join(os.homedir(), '.tecfoodcli');
    },
    loadAppConfig( fileName ){
        let configFolder = this.getPathAppConfig();
        let configFile = path.join(configFolder, fileName);
        fs.mkdirSync(configFolder, {recursive: true});
        if(app.hasAccess(configFile)) {
            let content = fs.readFileSync(configFile, 'utf8');
            return JSON.parse(content);
        } else {
            fs.writeFileSync(configFile, '{}');
            return ({});
        }
    },
    updateAppConfig( fileName, config ){
        let oldConfig = this.loadAppConfig( fileName );
        let newConfig = Object.assign(oldConfig, config);
        let pathAppConfig = this.getPathAppConfig();
        fs.writeFileSync(path.join(pathAppConfig, fileName), JSON.stringify(newConfig, null, 4));
    },
    mergeEnv(defaultEnv, {services}) {
        let copyDefaultEnv = JSON.parse(JSON.stringify(defaultEnv));
        let serviceNames = Object.keys(copyDefaultEnv.services);
        
        serviceNames.forEach( serviceName => {
            if(serviceName in services) {
                copyDefaultEnv.services[serviceName] = Object.assign(copyDefaultEnv.services[serviceName], services[serviceName]);
            }
        });
        return copyDefaultEnv;
    },
    generateEnvFile( sourceObject = { services: {} } ){
        const ROOT_PATH = this.getAppRootPath();
        const ENV_PATH = path.join(ROOT_PATH, 'src', 'docker');
        const DEFAULT_CONFIG_FILE = path.join(ENV_PATH, 'docker-compose.json');
        if( this.hasAccess(DEFAULT_CONFIG_FILE) ){ // has access path and file not exists
            let defaultEnvContent = JSON.parse(fs.readFileSync(DEFAULT_CONFIG_FILE, 'utf8'));
            defaultEnvContent = JSON.stringify(
                this.mergeEnv(defaultEnvContent, sourceObject),
                null,
                4
            );
            const ENV_FILE_PATH = path.join(ENV_PATH, '.docker-compose.json'); 
            fs.writeFileSync(ENV_FILE_PATH, defaultEnvContent);
            return JSON.parse(defaultEnvContent);
        } else {
            return null;
        }
    },
    getPathConfigFolderDocker(){
        return path.join(os.homedir(), '.docker');
    },
    generateComposeFile( sourceObject ){
        json2yml(sourceObject, false, this.getComposeFilePath());
    }
}

const { getAppRootPath, getEnv, generateEnvFile, getPathConfigFolderDocker } = app;

export {
    getAppRootPath,
    getEnv,
    generateEnvFile,
    getPathConfigFolderDocker
}

export default app;