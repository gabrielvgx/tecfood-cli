import { exec } from 'child_process';
import path from 'path';

let dockerLoginScript = path.resolve('src/util/scripts/docker_create_credential.sh');
const REGISTRY = 'dockerhub.teknisa.com';
const USER = 'teknisa';
const PASSWORD = 'teknisa2020';
exec(`/bin/bash ${dockerLoginScript} "${REGISTRY}" "${USER}" "${PASSWORD}"`, ( err, stdout, stderr ) => {
    if( err ){
        console.error(`exec error: ${err}`);
    } else {
        console.log(`stdout: ${stdout}`);
    }
});

