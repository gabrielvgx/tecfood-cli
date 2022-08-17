import prompts from 'prompts';
import { eachSeries } from 'async';

import { text, password } from './template_option.js';
import birt from './modules/birt.js';
import app from './modules/app.js';
import basedev from './modules/basedev.js';
import mongo from './modules/mongo.js';
import algoritmo from './modules/algoritmo.js';
import UtilApp from '../util/app.js';
import docker from '../util/docker.js';

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
            return docker.registerCredentials(USER, PASSWORD, REGISTRY).then(function(){
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
                    { title: 'APK',       description: 'Gerar APK - Cordova',  value: 'BUILD_APK' },
                ],
                initial: 0,
            },
            {
                type: prev => prev === 'ENV' ? 'multiselect' : null,
                name: 'environments',
                message: 'Ambientes a serem configurados',
                choices: [
                    { title: 'Birt', value: 'BIRT' },
                    { title: 'Apps', value: 'APP'  },
                    { title: 'PHP/Apache (based in cloud9)', value: 'BASEDEV', selected: true },
                    { title: 'Mongo 3.2', value: 'MONGO' },
                    { title: 'Algoritmo - Otimizador', value: 'ALGORITMO' },
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
        if(!typeConfigure || (!environments && !typeConfigure == 'ENV') || !useDefault) throw new Error("Configuração cancelada.");
        return {
            environments: environments ? environments : typeConfigure,
            useDefault,
        };
    },
    async executeQuestions(){
        let questions = [
            birt,
            app,
            basedev,
            mongo,
            algoritmo
        ];
        let resolveP;
        const promise = new Promise( resolve => {
            resolveP = resolve;
        });
        const { environments, useDefault } = await this.initialQuest();
        let promiseQuestions = Promise.resolve(null);
        if( useDefault ){
            UtilApp.generateEnvFile();
        } else {
            let responseQuestions = {};
            promiseQuestions = eachSeries(questions, function ( question, callback ) {
                if(environments.includes(question.name)){
                    question.execute().then( response => {
                        Object.assign(responseQuestions, response);
                        callback();
                    });
                } else {
                    callback();
                }
            }).then( _ => responseQuestions);
        }
        promiseQuestions.then( function( responseQuestions ) {
            if(responseQuestions){
                UtilApp.generateEnvFile(responseQuestions);
            }
            UtilApp.buildTemplateFiles();
            const ENV = UtilApp.getEnv(); //env.json
            const SERVICES = ENV.SERVICES;
            let registrySet = new Set();
            environments.forEach( serviceName => {
                let { IS_PRIVATE = false, REGISTRY = '' } = (SERVICES[serviceName] || {});
                if(REGISTRY || IS_PRIVATE){
                    registrySet.add(REGISTRY || '');
                }
            });
            if( registrySet.size ) {
                this.requestCredentialsDocker(Array.from(registrySet)).then(this.persistCredentialsDocker).then(_ => resolveP(environments));
            } else {
                resolveP(environments);
            }
        }.bind(this));
        return promise;
    }
}

export default question;