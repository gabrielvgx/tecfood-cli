const app = {
    getAppRootPath(){
        const APP_NAME = 'tecfood-cli';
        const CURRENT_PATH = process.env.PWD;
        const PATTERN = new RegExp(`(?<=\\b${APP_NAME}\\b).+`, 'gi');
        const APP_ROOT_PATH = CURRENT_PATH.replace(PATTERN, '');
        return APP_ROOT_PATH;
    }
}

const { getAppRootPath } = app;

export {
    getAppRootPath
}

export default app;