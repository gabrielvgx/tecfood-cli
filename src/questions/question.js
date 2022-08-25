import prompts from 'prompts';
import async from 'async';

import { text, password } from './template_option.js';
import UtilApp from '../util/app.js';
import docker from '../util/docker.js';
import genericQuestions from './modules/genericQuestions.js';

const question = {
    async requestCredentialsDocker( allRegistry ){
        let credentials = {};
        const OFFICIAL_DOCKER_REGISTRY = 'hub.docker.com';
        return async.eachSeries(allRegistry, function(registry, callback){
            text(`Usuário para login docker (${registry || OFFICIAL_DOCKER_REGISTRY})`).then( ({value: USER}) => {
                password(`Senha para login docker (${registry || OFFICIAL_DOCKER_REGISTRY})`).then( ({value: PASSWORD}) => {
                    credentials[registry] = { USER, PASSWORD };
                    callback();
                });
            });
        }).then(_ => credentials);
    },
    async persistCredentialsDocker( credentials ){
        return async.eachSeries(Object.keys(credentials), function( REGISTRY, callback) {
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
                    { title: 'SSH',       description: 'Gerenciar SSH',  value: 'SSH' },
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
                type: prev => !!prev && prev !== 'SSH' ? 'select' : 'null',
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
    removeUnselectedServices(env, selectedServices){
        
        let initialEnv = JSON.stringify(env);
        let modifiedEnv = initialEnv;
        initialEnv = JSON.parse(initialEnv);
        modifiedEnv = JSON.parse(modifiedEnv);
        Object.keys(initialEnv.services).forEach( serviceName => {
            if(!selectedServices.includes(serviceName)) {
                delete modifiedEnv.services[serviceName];
            }
        });
        return modifiedEnv;
    },
    async executeQuestions(){
        return new Promise( async resolve => {

            const { environments, useDefault } = await this.initialQuest();
            let promiseQuestions = Promise.resolve(null);
            let defaultEnv = UtilApp.getEnv();
            if( !useDefault ){
                promiseQuestions = async.eachSeries(environments, function( serviceName, next ) {
                    genericQuestions.execute(defaultEnv.services[serviceName]).then( responseQuestion => {
                        Object.assign(defaultEnv.services[serviceName], responseQuestion);
                        next();
                    });
                });
            }
            await promiseQuestions;
            defaultEnv  = this.removeBuildParams(defaultEnv);
            defaultEnv  = this.removeUnselectedServices(defaultEnv, environments);
            UtilApp.generateComposeFile(defaultEnv);
            let env = UtilApp.getEnv();
            env  = this.removeUnselectedServices(env, environments);
            
            const REGISTRY_SET = environments.reduce( (setStructure, serviceName) => {
                let isPrivateRegistry = false;
                let { buildParams, image = '' } = (env.services[serviceName] || {});
                if ( buildParams && buildParams.private ) {
                    isPrivateRegistry = true;
                }
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