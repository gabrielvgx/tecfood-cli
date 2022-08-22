import prompts from 'prompts';
import { eachSeries } from 'async';

import { text, password } from './template_option.js';
import UtilApp from '../util/app.js';
import docker from '../util/docker.js';
import { getAllQuestions } from './modules/all_questions.js';

const question = {
    async requestCredentialsDocker( allRegistry ){
        let credentials = {};
        const OFFICIAL_DOCKER_REGISTRY = 'hub.docker.com';
        return eachSeries(allRegistry, function(registry, callback){
            text(`Usuário para login docker (${registry || OFFICIAL_DOCKER_REGISTRY})`).then( ({value: USER}) => {
                password(`Senha para login docker (${registry || OFFICIAL_DOCKER_REGISTRY})`).then( ({value: PASSWORD}) => {
                    credentials[registry] = { USER, PASSWORD };
                    callback();
                });
            });
        }).then(_ => credentials);
    },
    async persistCredentialsDocker( credentials ){
        return eachSeries(Object.keys(credentials), function( REGISTRY, callback) {
            const { USER, PASSWORD } = credentials[REGISTRY]; 
            docker.registerCredentials(USER, PASSWORD, REGISTRY).then(function(){
                callback();
            });
        });
    },
    async initialQuest(){
        const { environments, useDefault, typeConfigure } = await prompts([
            {
                type: 'select',
                name: 'typeConfigure',
                message: 'Em que posso ajudar?',
                choices: [
                    { title: 'Ambientes', description: 'Configurar ambientes', value: 'ENV' },
                    { title: 'APK',       description: 'Gerar APK - Cordova',  value: 'build_apk' },
                ],
                initial: 0,
                hint: '- Use "arrow-up" "arrow-down" to navigate. <Enter> to submit'
            },
            {
                type: prev => prev === 'ENV' ? 'multiselect' : null,
                name: 'environments',
                message: 'Ambientes a serem configurados',
                choices: [
                    { title: 'Birt', value: 'birt' },
                    { title: 'Apps', value: 'app'  },
                    { title: 'PHP/Apache (based in cloud9)', value: 'basedev', selected: true },
                    { title: 'Mongo 3.2', value: 'mongo' },
                    { title: 'Algoritmo - Otimizador', value: 'algoritmo' },
                ],
                min: 1,
                hint: '- <Space> to select. <Enter> to submit'
            },
            {
                type: prev => !!prev ? 'select' : 'null',
                name: 'useDefault',
                message: 'Modo de configuração',
                choices: [
                    { title: 'Padrão', description: 'Configuração automatizada (modo silencioso)', value: true },
                    { title: 'Avançado', description: 'Configuração detalhada com interações com usuário recorrentes', value: false, },
                ],
                initial: 0
            }
        ]);
        if(!typeConfigure || (!environments && !typeConfigure == 'ENV') || typeof useDefault !== 'boolean') throw new Error("Configuração cancelada.");
        return {
            environments: environments ? environments : typeConfigure,
            useDefault,
        };
    },
    removeBuildParams( envParams ){
        let copyEnv = JSON.parse(JSON.stringify(envParams));
        Object.keys(copyEnv.services).forEach( serviceName => {
            delete copyEnv.services[serviceName].buildParams;
        });
        return copyEnv;
    },
    async executeQuestions(){
        let questions = getAllQuestions();
        return new Promise( async resolve => {

            const { environments, useDefault } = await this.initialQuest();
            let promiseQuestions = Promise.resolve(null);
            let defaultEnv = UtilApp.getEnv();
            if( !useDefault ){
                let responseQuestions = {};
                promiseQuestions = eachSeries([questions[0]], function ( question, callback ) {
                    if(environments.includes(question.name)){
                        question.execute().then( response => {
                            Object.assign(responseQuestions, response);
                            callback();
                        });
                    } else if(question.name == 'generic'){
                        eachSeries(environments, function( serviceName, endCurIterate ) {
                            question.execute(defaultEnv.services[serviceName].volumes).then( volumes => {
                                defaultEnv.services[serviceName].volumes = volumes;
                                endCurIterate();
                            });
                        }).then( _ => callback() );
                    } else {
                        callback();
                    }
                }).then( _ => responseQuestions);
            }
            await promiseQuestions;
            // if(responseQuestions){
                // UtilApp.generateEnvFile(defaultEnv);
            // }
            defaultEnv  = this.removeBuildParams(defaultEnv);
            UtilApp.generateComposeFile(defaultEnv);
            let env = UtilApp.getEnv();
            // let nameServices = Object.keys(env.services);
            const REGISTRY_SET = environments.reduce( (setStructure, serviceName) => {
                let { buildParams: { private: isPrivateRegistry }, image = '' } = (env.services[serviceName] || {});
                if( isPrivateRegistry ){
                    setStructure.add(docker.getRegistryByImage(image) || '');
                }
                return setStructure;
            }, new Set());
            if( REGISTRY_SET.size ) {
                this.requestCredentialsDocker(Array.from(REGISTRY_SET)).then(
                    this.persistCredentialsDocker
                ).then(_ => resolve(environments));
            } else {
                resolve(environments);
            }
        });
    }
}

export default question;