// import ora from 'ora';
// import chalk from 'chalk';
// import Listr from 'listr';
// import prompts from 'prompts';
import path from 'path';
import os from 'os';

import question from './questions/question.js';
import app from './util/app.js';
import docker from './util/docker.js';
import emoji from 'node-emoji';
function build(){
    const HOME_PATH = os.homedir();
    const IP_PROXY = 'http://192.168.122.121:3128';
    const WORKDIR_PATH = `${HOME_PATH}/workfolder`;
    const DEFAULT_CONFIG = {
        services: {
            app: {
                volumes: [ `${WORKDIR_PATH}:/var/www` ]
            },
            basedev: {
                volumes: [ `${WORKDIR_PATH}:/home/developer/workfolder` ],
                ports: [ "3000:80" ]
            },
            birt: {
                environment: [
                    `http_proxy=${IP_PROXY}`,
                    `https_proxy=${IP_PROXY}`,
                ],
                volumes: [ `${WORKDIR_PATH}:/var/www` ],
                ports: [ "9191:9191" ]
            },
            mongo: {
                ports: [ "27017:27017" ]
            }
        }
    };
    app.generateEnvFile(DEFAULT_CONFIG);
}
build();
question.executeQuestions().then( services => {
    const ROOT_PATH = app.getAppRootPath();
    const dockerComposeFile = path.join(ROOT_PATH, 'src', 'docker', 'docker-compose.yml');
    if(app.hasAccess(dockerComposeFile)){
        docker.runServices( services );
    }
}).catch( error => {
    console.error(emoji.get('x'), error.message);
});

// let time_start = Date.now();
// const tasks = new Listr([
//     {
//         title: "Git",
//         task: () => {
//             let resolvePromise = Promise.resolve();
//             let promise = new Promise((resolve)=>resolvePromise = resolve);
//             setTimeout(_=>{
//                 resolvePromise();
//             }, 2500);
//             return promise;
//         }
//     },
//     {
//         title: "Docker",
//         task: () => {
//             let resolvePromise = Promise.resolve();
//             let rejectPromise = Promise.resolve();
//             let promise = new Promise((resolve, reject)=>{
//                 resolvePromise = resolve;
//                 rejectPromise = reject;
//                 });
//             setTimeout(_=>{
//                 rejectPromise(new Error('error pull images'));
//             }, 1000);
//             return promise;
//         }
//     }
// ], {concurrent: true, exitOnError: false});

// tasks.run().then(_=>{
//     console.log('Finish Tasks');
//     let time = (Date.now() - time_start)/1000;
//     console.log(`Duration: ${time} seconds.`);
// }).catch( err => {
//     console.error(err);
// });
// import templateOption from './src/questions/template_option.js'
// const spinner = ora(`Loading ${chalk.red('unicorns')}`).start();
// let options = templateOption.confirm("Utilizar configuracao padrao?");
// const resp = await prompts(options);
// const envOpts = {
//   type: 'multiselect',
//   name: 'value',
//   message: 'Ambientes a serem configurados',
//   choices: [
//     { title: 'Birt', value: 'BIRT' },
//     { title: 'Apps', value: 'APP', },
//     { title: 'PHP/Apache (image used in cloud9)', value: 'BASEDEV', selected: true }
//   ],
//   min: 1,
//   hint: '- Space to select. Return to submit'
// };
// const confirmOpts = {
//   type: 'text',
//   name: 'value',
//   message: 'Birt Container Name',
//   initial: "birt-container"
// };
// let response = await prompts(envOpts);
// let response2 = await prompts(confirmOpts);
// console.log(question.getTypes());
// console.log(response);
// setTimeout(_=>{
//     spinner.succeed("Finish");
//     spinner.fail("Fail");
//     spinner.warn("Warn");
//     spinner.info("Info");
//     spinner.stop()
// }, 3000);