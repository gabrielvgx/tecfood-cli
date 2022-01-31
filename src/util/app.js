import path from 'path';
import fs from 'fs';
import os from 'os';

import mnemonic from './mnemonic.js';

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
        const PATH_ENV = path.join(APP_ROOT_PATH, 'src', 'build', 'config', 'environment.json');
        return PATH_ENV;
    },
    getEnv(){
        const APP_ROOT_PATH = this.getAppRootPath();
        const PATH_ENV = this.getEnvFilePath();
        const ENV = JSON.parse(fs.readFileSync(PATH_ENV, 'utf-8'));
        return ENV;
    },
    buildTemplateFiles(){
        const PATH_ENV = this.getEnvFilePath();
        if(!this.hasAccess(PATH_ENV)){
            this.generateEnvFile();
        }
        const ENV = JSON.parse(fs.readFileSync(PATH_ENV, 'utf-8'));
        const removeCommentYml = stringYml => stringYml.replace(/#.+/gi, '');
        const removeEmptySpaceStartLine = string => string.replace(/^\s+$/gim, '');
        const removeBreakLineInStartLine = string => string.replace(/^\n/gim, '');
        const replaceString = ( originalString ) => {
            let str = originalString;
            str = removeCommentYml(str);
            str = removeEmptySpaceStartLine(str);
            str = removeBreakLineInStartLine(str);
            return str;
        };
        const FILES = [
            {
                filePath: path.join(this.getAppRootPath(), 'src', 'docker', 'docker-compose.yml.template'),
                onBeforeWrite: replaceString
            }
        ];
        const replaceMnemonics = configFile => {
            const { filePath, onBeforeWrite = null } = configFile;
            mnemonic.replaceFromMap(filePath, ENV, { onBeforeWrite });
        };
        FILES.forEach( replaceMnemonics );
    },
    generateEnvFile( sourceObject = {} ){
        const ROOT_PATH = this.getAppRootPath();
        const ENV_PATH = path.join(ROOT_PATH, 'src', 'build', 'config');
        if(this.hasAccess(ENV_PATH) && !this.hasAccess(path.join(ENV_PATH, 'environment.json'))){ // has access path and file not exists
            const HOME_PATH = os.homedir();
            let defaultEnvContent = JSON.stringify(JSON.parse(fs.readFileSync(path.join(ENV_PATH, 'env-default.json'), 'utf-8')), null, 4);
            defaultEnvContent = JSON.stringify(
                Object.assign(
                    JSON.parse(defaultEnvContent), 
                    sourceObject
                ),
                null,
                4
            );
            defaultEnvContent = mnemonic.replaceMnemonic(defaultEnvContent, 'HOME_PATH', HOME_PATH);
            const ENV_FILE_PATH = path.join(ENV_PATH, 'environment.json'); 
            fs.writeFileSync(ENV_FILE_PATH, defaultEnvContent);
            return JSON.parse(defaultEnvContent);
        } else {
            return null;
        }
    },
    getPathConfigFolderDocker(){
        return path.join(os.homedir(), '.docker');
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