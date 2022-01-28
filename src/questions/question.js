import prompts from 'prompts';

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
        let optUseDefault = await confirm("Usar configurações padrões", true);
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
        questions.forEach( async question => {
            let resp = await question.execute();
        });
    }
}

export default question;