import path from 'path';
import { exec } from 'child_process';

import { getAppRootPath } from './app.js';

const terminal = {
    rootPath: getAppRootPath(),
    shellScriptsPath: path.join('src', 'util', 'scripts'),
    async execute( command, args = null, isScript = false ){
        return new Promise( ( resolve, reject ) => {
            let prefixCommand = `/bin/bash `;
            let suffixCommand = ``;
            if( isScript ) {
                const SCRIPT_NAME = command;
                command = path.join(this.rootPath, this.shellScriptsPath, SCRIPT_NAME);
            } else {
                prefixCommand += `-c "`;
                suffixCommand += `"`;
            }
            if( args !== null ){
                command = `${command} ${args}`;
            }
            
            exec(`${prefixCommand}${command}${suffixCommand}`, function(err, stdout, stderr){
                if( err || stderr) reject(stderr);
                else      resolve(stdout);
            });
        });
    }
}
export default terminal;