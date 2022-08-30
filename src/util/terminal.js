import path from 'path';
import { exec } from 'child_process';

import { getAppRootPath } from './app.js';

const terminal = {
    rootPath: getAppRootPath(),
    shellScriptsPath: path.join('src', 'util', 'scripts'),
    async execute( command, args = null, isScript = false ){
        return new Promise( ( resolve, reject ) => {
            if( isScript ) {
                const SCRIPT_NAME = command;
                command = path.join(this.rootPath, this.shellScriptsPath, SCRIPT_NAME);
            }
            if( args !== null ){
                command = `${command} ${args}`;
            }
            
            exec(`/bin/bash ${command}`, function(err, stdout, stderr){
                if( err ) reject(stderr);
                else      resolve(stdout);
            });
        });
    }
}
export default terminal;