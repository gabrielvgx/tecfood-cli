import prompts from 'prompts';
import { eachSeries } from 'async';

import { confirm, text, password } from './template_option.js';
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
        let environments = await prompts(
            {
                type: 'multiselect',
                name: 'value',
                message: 'Ambientes a serem configurados',
                choices: [
                    { title: 'Birt', value: 'BIRT' },
                    { title: 'Apps', value: 'APP'  },
                    { title: 'PHP/Apache (based in cloud9)', value: 'BASEDEV', selected: true },
                    { title: 'Mongo 3.2', value: 'MONGO' },
                    { title: 'Algoritmo - Otimizador', value: 'ALGORITMO' },
                ],
                min: 1,
                hint: '- Space to select. Return to submit'
            },
            
        );
        if(!environments.value) throw new Error("Configuração de ambiente cancelada.");
        else console.log(environments);
        let optUseDefault = await prompts({
            type: 'select',
            name: 'value',
            message: 'Modo de instalação',
            choices: [
                { title: 'Padrão', description: 'Configuração automatizada (modo silencioso)', value: true },
                { title: 'Avançado', description: 'Configuração detalhada com interações com usuário recorrentes', value: false, },
            ],
            initial: 0
        });
        if(typeof optUseDefault.value !== 'boolean') throw new Error("Configuração de ambiente cancelada.");
        return {
            environments: environments.value,
            useDefault: optUseDefault.value
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
            let registry = new Set();
            environments.forEach( serviceName => {
                if(SERVICES[serviceName]){
                    registry.add(SERVICES[serviceName].REGISTRY || '');
                }
            });
            if( registry.size ) {
                this.requestCredentialsDocker(Array.from(registry)).then(this.persistCredentialsDocker).then(_ => resolveP(environments));
            } else {
                resolveP(environments);
            }
        }.bind(this));
        return promise;
    }
}

export default question;