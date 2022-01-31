import { exec } from 'child_process';
import path from 'path';

const terminal = {
    getAppRootPath(){
        const APP_NAME = 'tecfood-cli';
        const CURRENT_PATH = process.env.PWD;
        const PATTERN = new RegExp(`(?<=\\b${APP_NAME}\\b).+`, 'gi');
        const APP_ROOT_PATH = CURRENT_PATH.replace(PATTERN, '');
        return APP_ROOT_PATH;
    },
    command( instruction ){
        exec(`/bin/bash ${instruction}`, function(err, stdout, strerr){
            if( err ) {
                console.log('error ----');
                console.log(strerr);
            } else {
                console.log(JSON.parse(stdout).IndexServerAddress);
            }
        });
    }
}
terminal.command(path.join(terminal.getAppRootPath(), 'src', 'tests', 'terminal.sh'));
export default terminal;