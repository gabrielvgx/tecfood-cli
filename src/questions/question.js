import prompts from 'prompts';
import async from 'async';

import { confirm } from './template_option.js';
import birt from './types/birt.js';
import app from './types/app.js';
import basedev from './types/basedev.js';

const question = {
    getTypes(){
        return {
            birt   : birt_options,
            app    : app_options,
            basedev: basedev_options
        };
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
                    { title: 'PHP/Apache (based in cloud9)', value: 'BASEDEV', selected: true }
                ],
                min: 1,
                hint: '- Space to select. Return to submit'
            },
            
        );
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
        return {
            environments: environments.value,
            useDefault: optUseDefault.value
        };
    },
    async executeQuestions(){
        let questions = [
            birt,
            app,
            basedev
        ];
        const { environments, useDefault } = await this.initialQuest();
        if(useDefault){
            return;
        }
        async.eachSeries(questions, function ( question, callback ) {
            if(environments.includes(question.name)){
                question.execute().then(callback);
            } else {
                callback();
            }
        });
    }
}

export default question;