import prompts from 'prompts';

import { text } from '../template_option.js';

const genericQuestions = {
    name: "generic",
    async crudListItem( listItems, titleQuestion, messageAddItem, chrSeparator = ':'){
        const STYLE = '\n\t';
        const hint = STYLE.concat(listItems.join(STYLE));
        const CANCEL_OPTION = {
            title: "Cancelar",
            value: "CANCEL"
        };
        let choices = listItems.map( item => ({title: item, value: item}))
                             .concat(CANCEL_OPTION);

        const execQuestionGetItem = async (hostValue, dockerValue) => {
            return await text(`Docker: ${dockerValue} - Host:`, hostValue);
        };

        const initialQuestion = [
            {
                type: 'select',
                name: "operation",
                message: titleQuestion,
                hint,
                choices: [
                    { title: "Adicionar", value: "ADD" },
                    { title: "Editar", value: "EDIT"},
                    { title: "Excluir", value: "DELETE"},
                    { title: "Confirmar", value: "CONFIRM"},
                    { title: "Cancelar", value: "CANCEL"},
                ],
                initial: 3
            }, 
            {
                type: prev => [ 'EDIT', 'DELETE' ].includes(prev) ? 'select': null,
                name: "itemSelection",
                message: titleQuestion,
                choices
            }
            
        ];
        const { operation, itemSelection } = await prompts( initialQuestion );
        if ( ['CANCEL', 'CONFIRM'].includes(operation) ) {
            return operation == 'CANCEL' ? null : listItems;
        } else if(operation){
            let dockerValue = '';
            let hostValue = '';
            let indexOldItem = -1;
            let newListItems = [...listItems];
            if ( ['EDIT', 'DELETE'].includes(operation) ) {
                let [ host, docker ] = itemSelection.split(':');
                dockerValue = docker;
                hostValue = host;
                indexOldItem = listItems.findIndex( item => item === `${host}${chrSeparator}${docker}`);
            }
            switch( operation ) {
                case 'ADD': 
                    let { value: NEW_ITEM } = await text(messageAddItem);
                    newListItems.push( NEW_ITEM );
                    break;
                case 'EDIT': 
                    let { value: NEW_HOST } = await execQuestionGetItem(hostValue, dockerValue);
                    newListItems[indexOldItem] = `${NEW_HOST}:${dockerValue}`;
                    break;
                case 'DELETE': 
                    newListItems.splice(indexOldItem, 1);
                    break;
                default: 
                    break;
            }
            return await this.crudListItem(newListItems, titleQuestion, messageAddItem, chrSeparator);
        } else {
            return null;
        }
    },
    async execute( config ){
        const {
            volumes,
            ports,
            container_name
        } = config;
        let newVolumes = await this.crudListItem(volumes, `Volume (${container_name})`, '/path/host:/path/docker');
        if(!newVolumes) {
            console.log('cancelVolumes', volumes);
            newVolumes = volumes;
        }
        let newPorts = await this.crudListItem(ports, `Porta (${container_name})`, 'PORTA_HOST:PORTA_DOCKER');
        if(!newPorts) newPorts = ports;
        let copyConfig = JSON.parse(JSON.stringify(config));
        return Object.assign(copyConfig, {volumes: newVolumes, ports: newPorts});
    }
}
const {
    execute
} = genericQuestions;

export { execute };
export default genericQuestions;