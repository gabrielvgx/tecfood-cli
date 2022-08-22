import prompts from 'prompts';

import { text } from '../template_option.js';

const genericQuestions = {
    name: "generic",
    async execute( volumes ){
        const STYLE = '\n\t';
        const hint = STYLE.concat(volumes.join(STYLE));
        const CANCEL_OPTION = {
            title: "Cancelar",
            value: "CANCEL"
        };
        let choices = volumes.map( volume => ({title: volume, value: volume}))
                             .concat(CANCEL_OPTION);
        // let configVolume =  volumes.reduce( ( configVolume, volume ) => {
        //     let [ host, docker ] = volume.split(':');
        //     configVolume[host] = docker;
        //     return configVolume;
        // }, {});

        const getVolume = async (host, docker) => {
            return await text(docker, host);
        };

        const volumesQuestion = [
            {
                type: 'select',
                name: "volumeOperation",
                message: "Volumes",
                hint,
                choices: [
                    { title: "Adicionar", value: "ADD" },
                    { title: "Editar", value: "EDIT"},
                    { title: "Excluir", value: "DELETE"},
                    { title: "Confirmar", value: "CONFIRM"},
                    { title: "Cancelar", value: "CANCEL"},
                ]
            }, 
            {
                type: prev => [ 'EDIT', 'DELETE' ].includes(prev) ? 'select': null,
                name: "volumeSelection",
                message: "Volume",
                choices
            }
            
        ];
        const { volumeOperation, volumeSelection } = await prompts(volumesQuestion);
        if ( ['CANCEL', 'CONFIRM'].includes(volumeOperation) ) {
            return volumes;
        } else {
            let docker = '';
            let host = '';
            let indexOldVolume = -1;
            let newVolumes = [...volumes];
            if ( ['EDIT', 'DELETE'].includes(volumeOperation) ) {
                let paths = volumeSelection.split(':');
                host = paths[0];
                docker = paths[1];
                indexOldVolume = volumes.findIndex( volume => volume === `${host}:${docker}`);
            }
            switch( volumeOperation ) {
                case 'ADD': 
                    let { value: NEW_VOLUME } = await text("Volume (/path/host:/path/docker)");
                    newVolumes.push( NEW_VOLUME );
                    break;
                case 'EDIT': 
                    let { value: NEW_HOST } = await getVolume(host, docker);
                    newVolumes[indexOldVolume] = `${NEW_HOST}:${docker}`;
                    break;
                case 'DELETE': 
                    newVolumes.splice(indexOldVolume, 1);
                    break;
                default: 
                    break;
            }
            return await this.execute(newVolumes);
        }
    }
}
const {
    execute
} = genericQuestions;

export { execute };
export default genericQuestions;