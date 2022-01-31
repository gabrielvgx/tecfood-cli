import path from 'path';
import { exec } from 'child_process';

import { getAppRootPath } from './app.js';

const terminal = {
    rootPath: getAppRootPath(),
    shellScriptsPath: path.join('src', 'util', 'scripts'),
    execute( command, args = null, isScript = false ){
        let resolveP, rejectP;
        let promise = new Promise((resolve, reject)=>{
            resolveP = resolve;
            rejectP  = reject;
        });
        if( isScript ) {
            const SCRIPT_NAME = command;
            command = path.join(this.rootPath, this.shellScriptsPath, SCRIPT_NAME);
        }
        if( args !== null ){
            command = `${command} ${args}`;
        }
        exec(`/bin/bash ${command}`, function(err, stdout, stderr){
            if( err ) rejectP(stderr);
            else      resolveP(stdout);
        });
        return promise;
    }
}
export default terminal;