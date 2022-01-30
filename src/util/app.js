import path from 'path';
import fs from 'fs';
import os from 'os';

const app = {
    getAppRootPath(){
        const APP_NAME = 'tecfood-cli';
        const CURRENT_PATH = process.env.PWD;
        const PATTERN = new RegExp(`(?<=\\b${APP_NAME}\\b).+`, 'gi');
        const APP_ROOT_PATH = CURRENT_PATH.replace(PATTERN, '');
        return APP_ROOT_PATH;
    },
    getEnv(){
        const APP_ROOT_PATH = this.getAppRootPath();
        const PATH_ENV = path.join(APP_ROOT_PATH, 'src', 'build', 'config', 'environment.json');
        const ENV = JSON.parse(fs.readFileSync(PATH_ENV, 'utf-8'));
        return ENV;
    },
    getPathConfigFolderDocker(){
        return path.join(os.homedir(), '.docker');
    }
}

const { getAppRootPath, getEnv, getPathConfigFolderDocker } = app;

export {
    getAppRootPath,
    getEnv,
    getPathConfigFolderDocker
}

export default app;